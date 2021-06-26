import get from 'lodash/get';
import { useMemo } from 'react';

import { CRUD_GET_MANY_REFERENCE } from '../actions/dataActions/crudGetManyReference';
import {
    PaginationPayload,
    SortPayload,
    Identifier,
    ReduxState,
    Record,
    RecordMap,
} from '../types';
import { useQueryWithStore } from './useQueryWithStore';
import {
    getIds,
    getTotal,
    nameRelatedTo,
} from '../reducer/admin/references/oneToMany';

const defaultIds = [];
const defaultData = {};

interface UseGetManyReferenceOptions {
    onSuccess?: (args?: any) => void;
    onFailure?: (error: any) => void;
    enabled?: boolean;
    [key: string]: any;
}

/**
 * Call the dataProvider.getManyReference() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false, refetch }
 * - success: { data: [data from store], ids: [ids from response], total: [total from response], loading: false, loaded: true, refetch }
 * - error: { error: [error from response], loading: false, loaded: false, refetch }
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
 * @param {Object} options Options object to pass to the dataProvider.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded, refetch }.
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
    pagination: PaginationPayload,
    sort: SortPayload,
    filter: object,
    referencingResource: string,
    options?: UseGetManyReferenceOptions
) => {
    const relatedTo = useMemo(
        () => nameRelatedTo(resource, id, referencingResource, target, filter),
        [filter, resource, id, referencingResource, target]
    );

    const {
        data: { ids, allRecords },
        total,
        error,
        loading,
        loaded,
        refetch,
    } = useQueryWithStore(
        {
            type: 'getManyReference',
            resource: resource,
            payload: { target, id, pagination, sort, filter },
        },
        { ...options, relatedTo, action: CRUD_GET_MANY_REFERENCE },
        // ids and data selector
        (state: ReduxState) => ({
            ids: getIds(state, relatedTo),
            allRecords: get(
                state.admin.resources,
                [resource, 'data'],
                defaultData
            ),
        }),
        (state: ReduxState) => getTotal(state, relatedTo),
        isDataLoaded
    );

    const data = useMemo(
        () =>
            ids == null
                ? defaultData
                : ids
                      .map(id => allRecords[id])
                      .reduce((acc, record) => {
                          if (!record) return acc;
                          acc[record.id] = record;
                          return acc;
                      }, {}),
        [ids, allRecords]
    );

    return {
        data,
        ids: ids || defaultIds,
        total,
        error,
        loading,
        loaded,
        refetch,
    };
};

interface DataSelectorResult<RecordType extends Record = Record> {
    ids: Identifier[];
    allRecords: RecordMap<RecordType>;
}

const isDataLoaded = (data: DataSelectorResult) => data.ids != null;

export default useGetManyReference;
