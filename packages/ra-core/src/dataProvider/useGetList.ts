import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
} from 'react-query';

import { Record, GetListParams } from '../types';
import useDataProvider from './useDataProvider';

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isLoading: true, refetch }
 * - success: { data: [data from store], total: [total from response], isLoading: false, refetch }
 * - error: { error: [error from response], isLoading: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Params} params The getList parameters { pagination, sort, filter }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh() } }
 *
 * @typedef Params
 * @props params.pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @props params.sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @props params.filter The request filters, e.g. { title: 'hello, world' }
 *
 * @returns The current request state. Destructure as { data, total, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, total, isLoading, error } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(item =>
 *         <li key={item.id}>{item.title}</li>
 *     )}</ul>;
 * };
 */
export const useGetList = <RecordType extends Record = Record>(
    resource: string,
    params: Partial<GetListParams> = {},
    options?: UseQueryOptions<{ data: RecordType[]; total: number }, Error>
): UseGetListHookValue<RecordType> => {
    const {
        pagination = { page: 1, perPage: 25 },
        sort = { field: 'id', order: 'DESC' },
        filter = {},
    } = params;
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const result = useQuery<
        { data: RecordType[]; total: number },
        Error,
        { data: RecordType[]; total: number }
    >(
        [resource, 'getList', { pagination, sort, filter }],
        () =>
            dataProvider
                .getList<RecordType>(resource, { pagination, sort, filter })
                .then(({ data, total }) => ({ data, total })),
        {
            onSuccess: ({ data }) => {
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', String(record.id)],
                        record
                    );
                });
            },
            ...options,
        }
    );

    return (result.data
        ? {
              ...result,
              data: result.data?.data,
              total: result.data?.total,
          }
        : result) as UseQueryResult<RecordType[], Error> & { total?: number };
};

export type UseGetListHookValue<
    RecordType extends Record = Record
> = UseQueryResult<RecordType[], Error> & { total?: number };
