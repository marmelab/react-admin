import { useInfiniteQuery } from 'react-query';

import { RaRecord, GetListParams } from '../types';
import { useDataProvider } from './useDataProvider';

export const useInfiniteGetList = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetListParams> = {},
    options?
) => {
    const {
        pagination = { page: 1, perPage: 25 },
        sort = { field: 'id', order: 'DESC' },
        filter = {},
        meta,
    } = params;
    const dataProvider = useDataProvider();

    const result = useInfiniteQuery(
        [resource, 'getList', { pagination, sort, filter, meta }],
        ({ pageParam = pagination.page }) =>
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
                .then(({ data, total }) => ({
                    data,
                    total,
                    pageParam,
                })),
        {
            getNextPageParam: lastPage => {
                const totalPages = Math.ceil(
                    (lastPage.total || 0) / pagination.perPage
                );

                return lastPage.pageParam < totalPages
                    ? Number(lastPage.pageParam) + 1
                    : undefined;
            },
        }
    );

    return {
        ...result,
        data: result.data,
        fetchNextPage: () => result.fetchNextPage(),
        isLoading: result.isLoading,
        isSuccess: result.isSuccess,
        error: result.error,
        hasNextPage: result.hasNextPage,
    };
};
