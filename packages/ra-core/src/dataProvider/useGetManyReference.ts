import { useSelector, shallowEqual } from 'react-redux';
import { CRUD_GET_MANY_REFERENCE } from '../actions/dataActions/crudGetManyReference';
import { Pagination, Sort, Identifier, ReduxState } from '../types';
import useQueryWithStore from './useQueryWithStore';
import {
    getReferences,
    getIds,
    getTotal,
    nameRelatedTo,
} from '../reducer/admin/references/oneToMany';
import { useMemo } from 'react';

/**
 * Call the dataProvider.getManyReference() method and return the resolved result
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
 * @param {string} resource The referenced resource name, e.g. 'comments'
 * @param {string} target The target resource key, e.g. 'post_id'
 * @param {Object} id The identifier of the record to look for in 'target'
 * @param {Object} pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @param {Object} sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @param {Object} filter The request filters, e.g. { body: 'hello, world' }
 * @param {string} referencingResource The resource name, e.g. 'posts'. Used to generate a cache key
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded }.
 *
 * @example
 *
 * import { useGetManyReference } from 'react-admin';
 *
 * const PostComments = ({ post_id }) => {
 *     const { data, ids, loading, error } = useGetManyReference(
 *         'comments',
 *         'post_id',
 *         post_id,
 *         { page: 1, perPage: 10 },
 *         { field: 'published_at', order: 'DESC' }
 *         {},
 *         'posts',
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{ids.map(id =>
 *         <li key={id}>{data[id].body}</li>
 *     )}</ul>;
 * };
 */
const useGetManyReference = (
    resource: string,
    target: string,
    id: Identifier,
    pagination: Pagination,
    sort: Sort,
    filter: object,
    referencingResource: string,
    options?: any
) => {
    const relatedTo = useMemo(
        () => nameRelatedTo(resource, id, referencingResource, target, filter),
        [filter, resource, id, referencingResource, target]
    );

    const { data: ids, total, error, loading, loaded } = useQueryWithStore(
        {
            type: 'getManyReference',
            resource: resource,
            payload: { target, id, pagination, sort, filter },
        },
        { ...options, relatedTo, action: CRUD_GET_MANY_REFERENCE },
        selectIds(relatedTo),
        selectTotal(relatedTo)
    );
    const data = useSelector(selectData(resource, relatedTo), shallowEqual);

    return { data, ids, total, error, loading, loaded };
};

export default useGetManyReference;

const selectData = (reference: string, relatedTo: string) => (
    state: ReduxState
) => getReferences(state, reference, relatedTo);

const selectIds = (relatedTo: string) => (state: ReduxState) =>
    getIds(state, relatedTo);

const selectTotal = (relatedTo: string) => (state: ReduxState) =>
    getTotal(state, relatedTo);
