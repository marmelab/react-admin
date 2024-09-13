import {
    InfiniteData,
    QueryKey,
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
    useQueryClient,
} from '@tanstack/react-query';

import { RaRecord, GetListParams, GetInfiniteListResult } from '../types';
import { useDataProvider } from './useDataProvider';
import { useEffect, useRef } from 'react';
import { useEvent } from '../util';

const MAX_DATA_LENGTH_TO_CACHE = 100;

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state. The return from useInfiniteGetList is equivalent to the return from react-hook form useInfiniteQuery.
 *
 * @see https://tanstack.com/query/v5/docs/react/reference/useInfiniteQuery
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getList parameters { pagination, sort, filter, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { fetchNextPage(); } }
 *
 * @typedef Params
 * @prop params.pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @prop params.sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @prop params.filter The request filters, e.g. { title: 'hello, world' }
 * @prop params.meta Optional meta parameters
 *
 * @returns The current request state. Destructure as { data, total, error, isPending, isSuccess, hasNextPage, fetchNextPage }.
 *
 * @example
 *
 * import { useInfiniteGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, total, isPending, error, hasNextPage, fetchNextPage } = useInfiniteGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isPending) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return (
 *        <>
 *            <ul>
 *                {data?.pages.map(page => {
 *                    return page.data.map(post => (
 *                        <li key={post.id}>{post.title}</li>
 *                    ));
 *                })}
 *            </ul>
 *            <div>
 *                <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
 *                    Fetch next page
 *                </button>
 *            </div>
 *        </>
 *    );
 * };
 */

export const useInfiniteGetList = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetListParams> = {},
    options: UseInfiniteGetListOptions<RecordType> = {}
): UseInfiniteGetListHookValue<RecordType> => {
    const {
        pagination = { page: 1, perPage: 25 },
        sort = { field: 'id', order: 'DESC' },
        filter = {},
        meta,
    } = params;
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const {
        onSuccess = noop,
        onError = noop,
        onSettled = noop,
        ...queryOptions
    } = options;
    const onSuccessEvent = useEvent(onSuccess);
    const onErrorEvent = useEvent(onError);
    const onSettledEvent = useEvent(onSettled);

    const result = useInfiniteQuery<
        GetInfiniteListResult<RecordType>,
        Error,
        InfiniteData<GetInfiniteListResult<RecordType>>,
        QueryKey,
        number
    >({
        queryKey: [
            resource,
            'getInfiniteList',
            { pagination, sort, filter, meta },
        ],
        queryFn: queryParams => {
            const { pageParam = pagination.page } = queryParams;
            return dataProvider
                .getList<RecordType>(resource, {
                    pagination: {
                        page: pageParam,
                        perPage: pagination.perPage,
                    },
                    sort,
                    filter,
                    meta,
                    signal:
                        dataProvider.supportAbortSignal === true
                            ? queryParams.signal
                            : undefined,
                })
                .then(({ data, pageInfo, total, meta }) => ({
                    data,
                    total,
                    pageParam,
                    pageInfo,
                    meta,
                }));
        },
        initialPageParam: pagination.page,
        ...queryOptions,
        getNextPageParam: lastLoadedPage => {
            if (lastLoadedPage.pageInfo) {
                return lastLoadedPage.pageInfo.hasNextPage
                    ? lastLoadedPage.pageParam + 1
                    : undefined;
            }
            const totalPages = Math.ceil(
                (lastLoadedPage.total || 0) / pagination.perPage
            );

            return lastLoadedPage.pageParam < totalPages
                ? Number(lastLoadedPage.pageParam) + 1
                : undefined;
        },
        getPreviousPageParam: lastLoadedPage => {
            if (lastLoadedPage.pageInfo) {
                return lastLoadedPage.pageInfo.hasPreviousPage
                    ? lastLoadedPage.pageParam - 1
                    : undefined;
            }

            return lastLoadedPage.pageParam === 1
                ? undefined
                : lastLoadedPage.pageParam - 1;
        },
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
        const allPagesDataLength = result.data.pages.reduce(
            (acc, page) => acc + page.data.length,
            0
        );
        if (allPagesDataLength <= MAX_DATA_LENGTH_TO_CACHE) {
            result.data.pages.forEach(page => {
                page.data.forEach(record => {
                    queryClient.setQueryData(
                        [
                            resourceValue.current,
                            'getOne',
                            { id: String(record.id), meta: metaValue.current },
                        ],
                        oldRecord => oldRecord ?? record
                    );
                });
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

    return (
        result.data
            ? {
                  ...result,
                  data: result.data,
                  total: result.data?.pages[0]?.total ?? undefined,
                  meta: result.data?.pages[0]?.meta,
              }
            : result
    ) as UseInfiniteQueryResult<
        InfiniteData<GetInfiniteListResult<RecordType>>,
        Error
    > & {
        total?: number;
        meta?: any;
    };
};

const noop = () => undefined;

export type UseInfiniteGetListOptions<RecordType extends RaRecord = any> = Omit<
    UseInfiniteQueryOptions<
        GetInfiniteListResult<RecordType>,
        Error,
        InfiniteData<GetInfiniteListResult<RecordType>>,
        GetInfiniteListResult<RecordType>,
        QueryKey,
        number
    >,
    | 'queryKey'
    | 'queryFn'
    | 'getNextPageParam'
    | 'getPreviousPageParam'
    | 'initialPageParam'
> & {
    onSuccess?: (data: InfiniteData<GetInfiniteListResult<RecordType>>) => void;
    onError?: (error: Error) => void;
    onSettled?: (
        data?: InfiniteData<GetInfiniteListResult<RecordType>>,
        error?: Error | null
    ) => void;
};

export type UseInfiniteGetListHookValue<RecordType extends RaRecord = any> =
    UseInfiniteQueryResult<InfiniteData<GetInfiniteListResult<RecordType>>> & {
        total?: number;
        pageParam?: number;
    };
