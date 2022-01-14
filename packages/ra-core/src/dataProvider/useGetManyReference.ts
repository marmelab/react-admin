import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
} from 'react-query';

import { RaRecord, GetManyReferenceParams } from '../types';
import { useDataProvider } from './useDataProvider';

/**
 * Call the dataProvider.getManyReference() method and return the resolved result
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
 * @param {Params} params The getManyReference parameters { target, id, pagination, sort, filter }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.target The target resource key, e.g. 'post_id'
 * @prop params.id The identifier of the record to look for in target, e.g. '123'
 * @prop params.pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @prop params.sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @prop params.filter The request filters, e.g. { title: 'hello, world' }
 *
 *
 * @returns The current request state. Destructure as { data, total, error, isLoading, refetch }.
 *
 * @example
 *
 * import { useGetManyReference } from 'react-admin';
 *
 * const PostComments = ({ record }) => {
 *     // fetch all comments related to the current record
 *     const { data, isLoading, error } = useGetManyReference(
 *         'comments',
 *         { target: 'post_id', id: record.id, pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
 *     );
 *     if (isLoading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(comment =>
 *         <li key={comment.id}>{comment.body}</li>
 *     )}</ul>;
 * };
 */
export const useGetManyReference = <RecordType extends RaRecord = any>(
    resource: string,
    params: Partial<GetManyReferenceParams> = {},
    options?: UseQueryOptions<{ data: RecordType[]; total: number }, Error>
): UseGetManyReferenceHookValue<RecordType> => {
    const {
        target,
        id,
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
        [
            resource,
            'getManyReference',
            { target, id, pagination, sort, filter },
        ],
        () =>
            dataProvider
                .getManyReference<RecordType>(resource, {
                    target,
                    id,
                    pagination,
                    sort,
                    filter,
                })
                .then(({ data, total }) => ({ data, total })),
        {
            onSuccess: ({ data }) => {
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', { id: String(record.id) }],
                        oldRecord => oldRecord ?? record
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

export type UseGetManyReferenceHookValue<
    RecordType extends RaRecord = any
> = UseQueryResult<RecordType[], Error> & { total?: number };
