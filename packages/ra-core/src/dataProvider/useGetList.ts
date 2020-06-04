import { useSelector, shallowEqual } from 'react-redux';
import get from 'lodash/get';

import {
    Pagination,
    Sort,
    ReduxState,
    Identifier,
    Record,
    RecordMap,
} from '../types';
import useQueryWithStore from './useQueryWithStore';

const defaultData = {};

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
const useGetList = <RecordType = Record>(
    resource: string,
    pagination: Pagination,
    sort: Sort,
    filter: object,
    options?: any
): {
    data?: RecordMap<RecordType>;
    ids?: Identifier[];
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
} => {
    const requestSignature = JSON.stringify({ pagination, sort, filter });

    const { data: ids, total, error, loading, loaded } = useQueryWithStore(
        { type: 'getList', resource, payload: { pagination, sort, filter } },
        options,
        // data selector (may return [])
        // We don't want the list to reset to first page after a bulk delete if the current page still exists
        // But CrudDeleteMany reset all "cachedRequests" for this resource.
        // It caused ids to be empty, and useListController to automatically reset to page 1
        // Now, it "cachedRequests" is undefined, we try default ids before setting an empty ids array
        (state: ReduxState): Identifier[] =>
            get(
                state.admin.resources,
                [resource, 'list', 'cachedRequests', requestSignature, 'ids'],
                state.admin.resources[resource]
                    ? state.admin.resources[resource].list.ids
                    : []
            ),
        // total selector (may return undefined)
        (state: ReduxState): number =>
            get(state.admin.resources, [
                resource,
                'list',
                'cachedRequests',
                requestSignature,
                'total',
            ])
    );

    const data = useSelector((state: ReduxState): RecordMap<RecordType> => {
        if (!ids) return defaultData;
        const allResourceData = get(
            state.admin.resources,
            [resource, 'data'],
            defaultData
        );
        return ids
            .map(id => allResourceData[id])
            .reduce((acc, record) => {
                if (!record) return acc;
                acc[record.id] = record;
                return acc;
            }, {});
    }, shallowEqual);

    return { data, ids, total, error, loading, loaded };
};

export default useGetList;
