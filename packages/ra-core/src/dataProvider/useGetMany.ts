import { useEffect, useRef } from 'react';
import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
    hashKey,
} from '@tanstack/react-query';

import { RaRecord, GetManyParams } from '../types';
import { useDataProvider } from './useDataProvider';
import { useEvent } from '../util';

/**
 * Call the dataProvider.getMany() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true, refetch }
 * - success: { data: [data from store], isPending: false, refetch }
 * - error: { error: [error from response], isPending: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getMany parameters { ids, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.ids The ids to get, e.g. [123, 456, 789]
 * @prop params.meta Optional meta parameters
 *
 * @returns The current request state. Destructure as { data, error, isPending, refetch }.
 *
 * @example
 *
 * import { useGetMany } from 'react-admin';
 *
 * const PostTags = ({ post }) => {
 *     const { data, isPending, error } = useGetMany(
 *         'tags',
 *         { ids: post.tags },
 *     );
 *     if (isPending) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(tag =>
 *         <li key={tag.id}>{tag.name}</li>
 *     )}</ul>;
 * };
 */
export const useGetMany = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetManyParams<RecordType>>,
    options: UseGetManyOptions<RecordType> = {}
): UseGetManyHookValue<RecordType> => {
    const { ids, meta } = params;
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

    const result = useQuery<RecordType[], Error, RecordType[]>({
        queryKey: [
            resource,
            'getMany',
            {
                ids: !ids || ids.length === 0 ? [] : ids.map(id => String(id)),
                meta,
            },
        ],
        queryFn: queryParams => {
            if (!ids || ids.length === 0) {
                // no need to call the dataProvider
                return Promise.resolve([]);
            }
            return dataProvider
                .getMany<RecordType>(resource, {
                    ids,
                    meta,
                    signal:
                        dataProvider.supportAbortSignal === true
                            ? queryParams.signal
                            : undefined,
                })
                .then(({ data }) => data);
        },
        placeholderData: () => {
            const records =
                !ids || ids.length === 0
                    ? []
                    : ids.map(id => {
                          const queryHash = hashKey([
                              resource,
                              'getOne',
                              { id: String(id), meta },
                          ]);
                          return queryCache.get<RecordType>(queryHash)?.state
                              ?.data;
                      });
            if (records.some(record => record === undefined)) {
                return undefined;
            } else {
                return records as RecordType[];
            }
        },
        retry: false,
        enabled: enabled ?? ids != null,
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
        result.data.forEach(record => {
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

const noop = () => undefined;

export type UseGetManyOptions<RecordType extends RaRecord = any> = Omit<
    UseQueryOptions<RecordType[], Error>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (data: RecordType[]) => void;
    onError?: (error: Error) => void;
    onSettled?: (data?: RecordType[], error?: Error | null) => void;
};

export type UseGetManyHookValue<RecordType extends RaRecord = any> =
    UseQueryResult<RecordType[], Error>;
