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
import { useEffect } from 'react';

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state. The return from useInfiniteGetList is equivalent to the return from react-hook form useInfiniteQuery.
 *
 * @see https://react-query-v3.tanstack.com/reference/useInfiniteQuery
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
 * @returns The current request state. Destructure as { data, total, error, isLoading, isSuccess, hasNextPage, fetchNextPage }.
 *
 * @example
 *
 * import { useInfiniteGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, total, isLoading, error, hasNextPage, fetchNextPage } = useInfiniteGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isLoading) { return <Loading />; }
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
    const { onSuccess, onError, ...queryOptions } = options;

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
        queryFn: ({ pageParam = pagination.page }) =>
            dataProvider
                .getList<RecordType>(resource, {
                    pagination: {
                        page: pageParam,
                        perPage: pagination.perPage,
                    },
                    sort,
                    filter,
                    meta,
                })
                .then(({ data, pageInfo, total }) => ({
                    data,
                    total,
                    pageParam,
                    pageInfo,
                })),
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

    useEffect(() => {
        if (result.data != null) {
            // optimistically populate the getOne cache
            result.data.pages.forEach(page => {
                page.data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', { id: String(record.id), meta }],
                        oldRecord => oldRecord ?? record
                    );
                });
            });

            if (onSuccess) {
                onSuccess(result.data);
            }
        }
    }, [meta, onSuccess, queryClient, resource, result.data]);

    useEffect(() => {
        if (result.error != null && onError) {
            onError(result.error);
        }
    }, [onError, result.error]);

    return (result.data
        ? {
              ...result,
              data: result.data,
              total: result.data?.pages[0]?.total ?? undefined,
          }
        : result) as UseInfiniteQueryResult<
        InfiniteData<GetInfiniteListResult<RecordType>>,
        Error
    > & {
        total?: number;
    };
};

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
};

export type UseInfiniteGetListHookValue<
    RecordType extends RaRecord = any
> = UseInfiniteQueryResult<InfiniteData<GetInfiniteListResult<RecordType>>> & {
    total?: number;
    pageParam?: number;
};
