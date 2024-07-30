import { useEffect, useMemo, useRef } from 'react';
import {
    QueryClient,
    useQueryClient,
    useQuery,
    UseQueryOptions,
    hashKey,
} from '@tanstack/react-query';
import union from 'lodash/union';

import { UseGetManyHookValue } from './useGetMany';
import { Identifier, RaRecord, GetManyParams, DataProvider } from '../types';
import { useDataProvider } from './useDataProvider';
import { useEvent } from '../util';

/**
 * Call the dataProvider.getMany() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true, isFetching: true, refetch }
 * - success: { data: [data from response], isPending: false, isFetching: false, refetch }
 * - error: { error: [error from response], isPending: false, isFetching: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * This hook aggregates and deduplicates calls to the same resource, so for instance, if an app calls:
 *
 * useGetManyAggregate('tags', [1, 2, 3]);
 * useGetManyAggregate('tags', [3, 4]);
 *
 * during the same tick, the hook will only call the dataProvider once with the following parameters:
 *
 * dataProvider.getMany('tags', [1, 2, 3, 4])
 *
 * @param resource The resource name, e.g. 'posts'
 * @param {Params} params The getMany parameters { ids, meta }
 * @param {Object} options Options object to pass to the dataProvider.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onError Side effect function to be executed upon failure, e.g. { onError: error => notify(error.message) }
 *
 * @typedef Params
 * @prop params.ids The ids to get, e.g. [123, 456, 789]
 * @prop params.meta Optional meta parameters

 * @returns The current request state. Destructure as { data, error, isPending, isFetching, refetch }.
 *
 * @example
 *
 * import { useGetManyAggregate, useRecordContext } from 'react-admin';
 *
 * const PostTags = () => {
 *     const record = useRecordContext();
 *     const { data, isPending, error } = useGetManyAggregate('tags', { ids: record.tagIds });
 *     if (isPending) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return (
 *          <ul>
 *              {data.map(tag => (
 *                  <li key={tag.id}>{tag.name}</li>
 *              ))}
 *          </ul>
 *      );
 * };
 */
export const useGetManyAggregate = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetManyParams<RecordType>>,
    options: UseGetManyAggregateOptions<RecordType> = {}
): UseGetManyHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();
    const {
        onError = noop,
        onSuccess = noop,
        onSettled = noop,
        enabled,
        ...queryOptions
    } = options;
    const onSuccessEvent = useEvent(onSuccess);
    const onErrorEvent = useEvent(onError);
    const onSettledEvent = useEvent(onSettled);

    const { ids, meta } = params;
    const placeholderData = useMemo(() => {
        const records = (Array.isArray(ids) ? ids : [ids]).map(id => {
            const queryHash = hashKey([
                resource,
                'getOne',
                { id: String(id), meta },
            ]);
            return queryCache.get<RecordType>(queryHash)?.state?.data;
        });
        if (records.some(record => record === undefined)) {
            return undefined;
        } else {
            return records as RecordType[];
        }
    }, [ids, queryCache, resource, meta]);

    const result = useQuery<RecordType[], Error, RecordType[]>({
        queryKey: [
            resource,
            'getMany',
            {
                ids: (Array.isArray(ids) ? ids : [ids]).map(id => String(id)),
                meta,
            },
        ],
        queryFn: queryParams =>
            new Promise((resolve, reject) => {
                if (!ids || ids.length === 0) {
                    // no need to call the dataProvider
                    return resolve([]);
                }

                // debounced / batched fetch
                return callGetManyQueries({
                    resource,
                    ids,
                    meta,
                    resolve,
                    reject,
                    dataProvider,
                    queryClient,
                    signal:
                        dataProvider.supportAbortSignal === true
                            ? queryParams.signal
                            : undefined,
                });
            }),
        placeholderData,
        enabled: enabled ?? ids != null,
        retry: false,
        ...queryOptions,
    });

    const metaValue = useRef(meta);
    const resourceValue = useRef(resource);

    useEffect(() => {
        metaValue.current = meta;
    }, [meta]);

    useEffect(() => {
        resourceValue.current = resource;
    }, [resource]);

    useEffect(() => {
        if (
            result.data === undefined ||
            result.error != null ||
            result.isFetching
        )
            return;

        // optimistically populate the getOne cache
        (result.data ?? []).forEach(record => {
            queryClient.setQueryData(
                [
                    resourceValue.current,
                    'getOne',
                    { id: String(record.id), meta: metaValue.current },
                ],
                oldRecord => oldRecord ?? record
            );
        });

        onSuccessEvent(result.data);
    }, [
        queryClient,
        onSuccessEvent,
        result.data,
        result.error,
        result.isFetching,
    ]);

    useEffect(() => {
        if (result.error == null || result.isFetching) return;
        onErrorEvent(result.error);
    }, [onErrorEvent, result.error, result.isFetching]);

    useEffect(() => {
        if (result.status === 'pending' || result.isFetching) return;
        onSettledEvent(result.data, result.error);
    }, [
        onSettledEvent,
        result.data,
        result.error,
        result.status,
        result.isFetching,
    ]);

    return result;
};

/**
 * Batch all calls to a function into one single call with the arguments of all the calls.
 *
 * @example
 * let sum = 0;
 * const add = (args) => { sum = args.reduce((arg, total) => total + arg, 0); };
 * const addBatched = batch(add);
 * addBatched(2);
 * addBatched(8);
 * // add will be called once with arguments [2, 8]
 * // and sum will be equal to 10
 */
const batch = fn => {
    let capturedArgs: any[] = [];
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (arg: any) => {
        capturedArgs.push(arg);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            fn([...capturedArgs]);
            capturedArgs = [];
        }, 0);
    };
};

interface GetManyCallArgs {
    resource: string;
    ids: Identifier[];
    meta?: any;
    resolve: (data: any[]) => void;
    reject: (error?: any) => void;
    dataProvider: DataProvider;
    queryClient: QueryClient;
    signal?: AbortSignal;
}

/**
 * Group and execute all calls to the dataProvider.getMany() method for the current tick
 *
 * Thanks to batch(), this function executes at most once per tick,
 * whatever the number of calls to useGetManyAggregate().
 */
const callGetManyQueries = batch((calls: GetManyCallArgs[]) => {
    const dataProvider = calls[0].dataProvider;
    const queryClient = calls[0].queryClient;

    /**
     * Aggregate calls by resource
     *
     * callsByResource will look like:
     * {
     *     posts: [{ resource, ids, resolve, reject, dataProvider, queryClient }, ...],
     *     tags: [{ resource, ids, resolve, reject, dataProvider, queryClient }, ...],
     * }
     */
    const callsByResource = calls.reduce(
        (acc, callArgs) => {
            if (!acc[callArgs.resource]) {
                acc[callArgs.resource] = [];
            }
            acc[callArgs.resource].push(callArgs);
            return acc;
        },
        {} as { [resource: string]: GetManyCallArgs[] }
    );

    /**
     * For each resource, aggregate ids and call dataProvider.getMany() once
     */
    Object.keys(callsByResource).forEach(resource => {
        const callsForResource = callsByResource[resource];

        /**
         * Extract ids from queries, aggregate and deduplicate them
         *
         * @example from [[1, 2], [2, null, 3], [4, null]] to [1, 2, 3, 4]
         */
        const aggregatedIds = callsForResource
            .reduce((acc, { ids }) => union(acc, ids), []) // concat + unique
            .filter(v => v != null && v !== ''); // remove null values

        const uniqueMeta = callsForResource.reduce(
            (acc, { meta }) => meta || acc,
            undefined
        );

        if (aggregatedIds.length === 0) {
            // no need to call the data provider if all the ids are null
            callsForResource.forEach(({ resolve }) => {
                resolve([]);
            });
            return;
        }

        const callThatHasAllAggregatedIds = callsForResource.find(
            ({ ids, signal }) =>
                JSON.stringify(ids) === JSON.stringify(aggregatedIds) &&
                !signal?.aborted
        );
        if (callThatHasAllAggregatedIds) {
            // There is only one call (no aggregation), or one of the calls has the same ids as the sum of all calls.
            // Either way, we can't trigger a new fetchQuery with the same signature, as it's already pending.
            // Therefore, we reply with the dataProvider
            const { dataProvider, resource, ids, meta, signal } =
                callThatHasAllAggregatedIds;

            dataProvider
                .getMany<any>(resource, { ids, meta, signal })
                .then(({ data }) => data)
                .then(
                    data => {
                        // We must then resolve all the pending calls with the data they requested
                        callsForResource.forEach(({ ids, resolve }) => {
                            resolve(
                                data.filter(record =>
                                    ids
                                        .map(id => String(id))
                                        .includes(String(record.id))
                                )
                            );
                        });
                    },
                    error => {
                        // All pending calls must also receive the error
                        callsForResource.forEach(({ reject }) => {
                            reject(error);
                        });
                    }
                );
            return;
        }

        /**
         * Call dataProvider.getMany() with the aggregatedIds,
         * and resolve each of the promises using the results
         */
        queryClient
            .fetchQuery<any[], Error, any[]>({
                queryKey: [
                    resource,
                    'getMany',
                    {
                        ids: aggregatedIds.map(id => String(id)),
                        meta: uniqueMeta,
                    },
                ],
                queryFn: queryParams =>
                    dataProvider
                        .getMany<any>(resource, {
                            ids: aggregatedIds,
                            meta: uniqueMeta,
                            signal:
                                dataProvider.supportAbortSignal === true
                                    ? queryParams.signal
                                    : undefined,
                        })
                        .then(({ data }) => data),
            })
            .then(data => {
                callsForResource.forEach(({ ids, resolve }) => {
                    resolve(
                        data.filter(record =>
                            ids
                                .map(id => String(id))
                                .includes(String(record.id))
                        )
                    );
                });
            })
            .catch(error =>
                callsForResource.forEach(({ reject }) => reject(error))
            );
    });
});

const noop = () => undefined;

export type UseGetManyAggregateOptions<RecordType extends RaRecord> = Omit<
    UseQueryOptions<RecordType[]>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (data: RecordType[]) => void;
    onError?: (error: Error) => void;
    onSettled?: (data?: RecordType[], error?: Error | null) => void;
};
