// @ts-ignore
import { useSelector } from 'react-redux';
import { CRUD_GET_LIST } from '../actions/dataActions/crudGetList';
import { GET_LIST } from '../dataFetchActions';
import { Pagination, Sort, ReduxState } from '../types';
import useQueryWithStore from '../fetch/useQueryWithStore';
import { ObjectMethod } from '@babel/types';

/**
 * Call the dataProvider with a GET_LIST verb and return the result as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from store], ids: [ids from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Object} pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @param {Object} sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @param {Object} filters The request filters, e.g. { title: 'hello, world' }
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded }.
 *
 * @example
 *
 * import { useGetList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, ids, loading, error } = useGetList(
 *         'posts',
 *         { page: 1, perPage: 10 },
 *         { field: 'published_at', order: 'DESC' }
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{ids.map(id =>
 *         <li key={id}>{data[id].title}</li>
 *     )}</ul>;
 * };
 */
const useGetList = (
    resource: string,
    pagination: Pagination,
    sort: Sort,
    filter: object,
    options?: any
) => {
    const { data, total, error, loading, loaded } = useQueryWithStore(
        { type: GET_LIST, resource, payload: { pagination, sort, filter } },
        { ...options, action: CRUD_GET_LIST },
        (state: ReduxState) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].data
                : null,
        (state: ReduxState) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].list.total
                : null
    );
    const ids = useSelector(
        (state: ReduxState) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].list.ids
                : null,
        [resource]
    );
    return { data, ids, total, error, loading, loaded };
};

export default useGetList;
