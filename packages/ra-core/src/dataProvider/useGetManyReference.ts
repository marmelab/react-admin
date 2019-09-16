import { useSelector, shallowEqual } from 'react-redux';
import { CRUD_GET_MANY_REFERENCE } from '../actions/dataActions/crudGetManyReference';
import { GET_MANY_REFERENCE } from '../dataFetchActions';
import { Pagination, Sort, Identifier } from '../types';
import useQueryWithStore from './useQueryWithStore';
import {
    getReferences,
    getIds,
    getTotal,
    nameRelatedTo,
} from '../reducer/admin/references/oneToMany';
import { useMemo } from 'react';

/**
 * Call the dataProvider with a GET_MANY_REFERENCE verb and return the result as well as the loading state.
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
 * @param {string} reference The referenced resource name, e.g. 'comments'
 * @param {string} target The target resource key, e.g. 'post_id'
 * @param {Object} id The identifier of the record to look for in 'target'
 * @param {Object} pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @param {Object} sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @param {Object} filters The request filters, e.g. { body: 'hello, world' }
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
 *         'posts',
 *         'comments',
 *         'post_id',
 *         post_id,
 *         { page: 1, perPage: 10 },
 *         { field: 'published_at', order: 'DESC' }
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
    reference: string,
    target: string,
    id: Identifier,
    pagination: Pagination,
    sort: Sort,
    filter: object,
    source: string,
    options?: any
) => {
    const relatedTo = useMemo(
        () => nameRelatedTo(reference, id, resource, target, filter),
        [filter, reference, id, resource, target]
    );

    const { data: ids, total, error, loading, loaded } = useQueryWithStore(
        {
            type: GET_MANY_REFERENCE,
            resource: reference,
            payload: { target, id, pagination, sort, filter, source },
        },
        { ...options, relatedTo, action: CRUD_GET_MANY_REFERENCE },
        selectIds(relatedTo),
        selectTotal(relatedTo)
    );
    const data = useSelector(selectData(reference, relatedTo), shallowEqual);

    return { data, ids, total, error, loading, loaded };
};

export default useGetManyReference;

const selectData = (reference, relatedTo) => state =>
    getReferences(state, reference, relatedTo);

const selectIds = relatedTo => state => getIds(state, relatedTo);

const selectTotal = relatedTo => state => getTotal(state, relatedTo);
