import { useSelector } from 'react-redux';
import get from 'lodash/get';

import { CRUD_GET_MATCHING } from '../actions/dataActions/crudGetMatching';
import {
    Identifier,
    PaginationPayload,
    SortPayload,
    Record,
    ReduxState,
} from '../types';
import useQueryWithStore from './useQueryWithStore';
import {
    getReferenceResource,
    getPossibleReferenceValues,
    getPossibleReferences,
} from '../reducer';

const referenceSource = (resource, source) => `${resource}@${source}`;

/**
 * Call the dataProvider.getList() method return the resolved result
 * as well as the loading state.
 *
 * React-admin uses a different store location for the result of this query
 * than for useGetList(). Therefore, calling useGetMatching() does not modify
 * the ids and total for the resource.
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
 * @param {string} resource The referenced resource name, e.g. 'tags'
 * @param {Object} pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @param {Object} sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @param {Object} filter The request filters, e.g. { title: 'hello, world' }
 * @param {string} source The field in resource containing the ids of the referenced records, e.g. 'tag_ids'
 * @param {string} referencingResource The resource name, e.g. 'posts'. Used to build a cache key
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded }.
 *
 * @example
 *
 * import { useGetMatching } from 'react-admin';
 *
 * const PostTags = () => {
 *     // call dataProvider.getList('tags', { pagination: { page: 1, perPage: 10 }, sort: { { field: 'published_at', order: 'DESC' } } })
 *     const { data, loading, error } = useGetMatching(
 *         'tags',
 *         { page: 1, perPage: 10 },
 *         { field: 'published_at', order: 'DESC' },
 *         {},
 *         'tag_ids',
 *         'posts',
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <ul>{data.map(tag =>
 *         <li key={tag.id}>{tag.name}</li>
 *     )}</ul>;
 * };
 */
const useGetMatching = (
    resource: string,
    pagination: PaginationPayload,
    sort: SortPayload,
    filter: object,
    source: string,
    referencingResource: string,
    options?: any
): UseGetMatchingResult => {
    const relatedTo = referenceSource(referencingResource, source);
    const payload = { pagination, sort, filter };
    const {
        data: possibleValues,
        total,
        error,
        loading,
        loaded,
    } = useQueryWithStore(
        {
            type: 'getList',
            resource,
            payload,
        },
        {
            ...options,
            relatedTo,
            action: CRUD_GET_MATCHING,
        },
        (state: ReduxState) =>
            getPossibleReferenceValues(state, {
                referenceSource,
                resource: referencingResource,
                source,
            }),
        (state: ReduxState) =>
            get(
                state.admin.resources,
                [
                    resource,
                    'list',
                    'cachedRequests',
                    JSON.stringify(payload),
                    'total',
                ],
                null
            )
    );

    const referenceState = useSelector(state =>
        getReferenceResource(state, {
            reference: resource,
        })
    );

    const possibleReferences = getPossibleReferences(
        referenceState,
        possibleValues,
        []
    );

    return {
        data: possibleReferences,
        ids: possibleValues,
        total,
        error,
        loading,
        loaded,
    };
};

interface UseGetMatchingResult {
    data: Record[];
    ids: Identifier[];
    total: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
}

export default useGetMatching;
