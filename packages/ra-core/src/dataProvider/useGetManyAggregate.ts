import { useMemo } from 'react';
import {
    QueryClient,
    useQueryClient,
    useQuery,
    UseQueryOptions,
    hashQueryKey,
} from 'react-query';
import union from 'lodash/union';

import { UseGetManyHookValue } from './useGetMany';
import { Identifier, Record, GetManyParams, DataProvider } from '../types';
import useDataProvider from './useDataProvider';

/**
 * Call the dataProvider.getMany() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false, refetch }
 * - success: { data: [data from response], loading: false, loaded: true, refetch }
 * - error: { error: [error from response], loading: false, loaded: false, refetch }
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
 * @param ids The resource identifiers, e.g. [123, 456, 789]
 * @param {Object} options Options object to pass to the dataProvider.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onError Side effect function to be executed upon failure, e.g. { onError: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, error, loading, loaded, refetch }.
 *
 * @example
 *
 * import { useGetManyAggregate } from 'react-admin';
 *
 * const PostTags = ({ record }) => {
 *     const { data, loading, error } = useGetManyAggregate('tags', record.tagIds);
 *     if (loading) { return <Loading />; }
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
export const useGetManyAggregate = <RecordType extends Record = Record>(
    resource: string,
    params: GetManyParams,
    options: UseQueryOptions<RecordType[], Error> = {}
): UseGetManyHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();
    const { ids } = params;
    const placeholderData = useMemo(() => {
        const records = ids.map(id => {
            const queryHash = hashQueryKey([resource, 'getOne', String(id)]);
            return queryCache.get<RecordType>(queryHash)?.state?.data;
        });
        if (records.some(record => record === undefined)) {
            return undefined;
        } else {
            return records;
        }
    }, [ids, queryCache, resource]);

    return useQuery<RecordType[], Error, RecordType[]>(
        [resource, 'getMany', { ids: ids.map(id => String(id)) }],
        () =>
            new Promise((resolve, reject) =>
                // debounced / batched fetch
                callGetManyQueries({
                    resource,
                    ids,
                    resolve,
                    reject,
                    dataProvider,
                    queryClient,
                })
            ),
        {
            placeholderData,
            onSuccess: data => {
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', String(record.id)],
                        record
                    );
                });
            },
            retry: false,
            ...options,
        }
    );
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
    let capturedArgs = [];
    let timeout = null;
    return arg => {
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
    resolve: (data: any[]) => void;
    reject: (error?: any) => void;
    dataProvider: DataProvider;
    queryClient: QueryClient;
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
    const callsByResource = calls.reduce((acc, callArgs) => {
        if (!acc[callArgs.resource]) {
            acc[callArgs.resource] = [];
        }
        acc[callArgs.resource].push(callArgs);
        return acc;
    }, {} as { [resource: string]: GetManyCallArgs[] });

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

        if (aggregatedIds.length === 0) {
            // no need to call the data provider if all the ids are null
            callsForResource.forEach(({ resolve }) => {
                resolve([]);
            });
            return;
        }

        if (
            callsForResource.find(
                ({ ids }) =>
                    JSON.stringify(ids) === JSON.stringify(aggregatedIds)
            )
        ) {
            // There is only one call (no aggregation), or one of the calls has the same ids as the sum of all calls.
            // Either way, we can't trigger a new fetchQuery with the same signature, as it's already pending.
            // Therefore, we reply with the dataProvider
            const {
                dataProvider,
                resource,
                ids,
                resolve,
                reject,
            } = callsForResource[0];
            dataProvider
                .getMany<any>(resource, { ids })
                .then(({ data }) => data)
                .then(resolve, reject);
            return;
        }

        /**
         * Call dataProvider.getMany() with the aggregatedIds,
         * and resolve each of the promises using the results
         */
        queryClient
            .fetchQuery<any[], Error, any[]>(
                [
                    resource,
                    'getMany',
                    { ids: aggregatedIds.map(id => String(id)) },
                ],
                () =>
                    dataProvider
                        .getMany<any>(resource, { ids: aggregatedIds })
                        .then(({ data }) => data)
            )
            .then(data => {
                callsForResource.forEach(({ ids, resolve }) => {
                    resolve(data.filter(record => ids.includes(record.id)));
                });
            })
            .catch(error =>
                callsForResource.forEach(({ reject }) => reject(error))
            );
    });
});
