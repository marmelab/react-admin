import { Pagination, Sort, ReduxState } from '../types';
import useQueryWithStore from './useQueryWithStore';

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
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
 * @param {Object} filter The request filters, e.g. { title: 'hello, world' }
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
    if (options && options.action) {
        throw new Error(
            'useGetList() does not support custom action names. Use useQueryWithStore() and your own Redux selectors if you need a custom action name for a getList query'
        );
    }
    const key = JSON.stringify({
        type: 'GET_LIST',
        resource: resource,
        payload: { pagination, sort, filter },
    });
    const { data, total, error, loading, loaded } = useQueryWithStore(
        { type: 'getList', resource, payload: { pagination, sort, filter } },
        options,
        (state: ReduxState) =>
            state.admin.customQueries[key]
                ? state.admin.customQueries[key].data
                : null,
        (state: ReduxState) =>
            state.admin.customQueries[key]
                ? state.admin.customQueries[key].total
                : null
    );
    const ids = data ? data.map(record => record.id) : [];
    const dataObject = data
        ? data.reduce((acc, next) => {
              acc[next.id] = next;
              return acc;
          }, {})
        : {};

    return { data: dataObject, ids, total, error, loading, loaded };
};

export default useGetList;
