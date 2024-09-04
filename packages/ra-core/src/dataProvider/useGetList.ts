import { useEffect, useMemo, useRef } from 'react';
import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
} from '@tanstack/react-query';

import { RaRecord, GetListParams, GetListResult } from '../types';
import { useDataProvider } from './useDataProvider';
import { useEvent } from '../util';

const MAX_DATA_LENGTH_TO_CACHE = 100;

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true, refetch }
 * - success: { data: [data from store], total: [total from response], isPending: false, refetch }
 * - error: { error: [error from response], isPending: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getList parameters { pagination, sort, filter, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @prop params.sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @prop params.filter The request filters, e.g. { title: 'hello, world' }
 * @prop params.meta Optional meta parameters
 *
 * @returns The current request state. Destructure as { data, total, error, isPending, refetch }.
 *
 * @example
 *
 * import { useGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, total, isPending, error } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isPending) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(item =>
 *         <li key={item.id}>{item.title}</li>
 *     )}</ul>;
 * };
 */
export const useGetList = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetListParams> = {},
    options: UseGetListOptions<RecordType> = {}
): UseGetListHookValue<RecordType> => {
    const {
        pagination = { page: 1, perPage: 25 },
        sort = { field: 'id', order: 'DESC' },
        filter = {},
        meta,
    } = params;
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const {
        onError = noop,
        onSuccess = noop,
        onSettled = noop,
        ...queryOptions
    } = options;
    const onSuccessEvent = useEvent(onSuccess);
    const onErrorEvent = useEvent(onError);
    const onSettledEvent = useEvent(onSettled);

    const result = useQuery<
        GetListResult<RecordType>,
        Error,
        GetListResult<RecordType>
    >({
        queryKey: [resource, 'getList', { pagination, sort, filter, meta }],
        queryFn: queryParams =>
            dataProvider
                .getList<RecordType>(resource, {
                    pagination,
                    sort,
                    filter,
                    meta,
                    signal:
                        dataProvider.supportAbortSignal === true
                            ? queryParams.signal
                            : undefined,
                })
                .then(({ data, total, pageInfo, meta }) => ({
                    data,
                    total,
                    pageInfo,
                    meta,
                })),
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
        if (
            result.data?.data &&
            result.data.data.length <= MAX_DATA_LENGTH_TO_CACHE
        ) {
            result.data.data.forEach(record => {
                queryClient.setQueryData(
                    [
                        resourceValue.current,
                        'getOne',
                        { id: String(record.id), meta: metaValue.current },
                    ],
                    oldRecord => oldRecord ?? record
                );
            });
        }
        onSuccessEvent(result.data);
    }, [
        onSuccessEvent,
        queryClient,
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

    return useMemo(
        () =>
            result.data
                ? {
                      ...result,
                      ...result.data,
                  }
                : result,
        [result]
    ) as UseQueryResult<RecordType[], Error> & {
        total?: number;
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
        };
        meta?: any;
    };
};

const noop = () => undefined;

export type UseGetListOptions<RecordType extends RaRecord = any> = Omit<
    UseQueryOptions<GetListResult<RecordType>, Error>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (value: GetListResult<RecordType>) => void;
    onError?: (error: Error) => void;
    onSettled?: (
        data?: GetListResult<RecordType>,
        error?: Error | null
    ) => void;
};

export type UseGetListHookValue<RecordType extends RaRecord = any> =
    UseQueryResult<RecordType[], Error> & {
        total?: number;
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
        };
        meta?: any;
    };
