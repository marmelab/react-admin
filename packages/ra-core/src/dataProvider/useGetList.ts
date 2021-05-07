import { useMemo } from 'react';
import get from 'lodash/get';

import {
    PaginationPayload,
    SortPayload,
    ReduxState,
    Identifier,
    Record,
    RecordMap,
    UseDataProviderOptions,
} from '../types';
import { useQueryWithStore, Refetch } from './useQueryWithStore';

const defaultPagination = { page: 1, perPage: 25 };
const defaultSort = { field: 'id', order: 'DESC' };
const defaultFilter = {};
const defaultIds = [];
const defaultData = {};

/**
 * Call the dataProvider.getList() method and return the resolved result
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
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Object} pagination The request pagination { page, perPage }, e.g. { page: 1, perPage: 10 }
 * @param {Object} sort The request sort { field, order }, e.g. { field: 'id', order: 'DESC' }
 * @param {Object} filter The request filters, e.g. { title: 'hello, world' }
 * @param {Object} options Options object to pass to the dataProvider.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded, refetch }.
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
const useGetList = <RecordType extends Record = Record>(
    resource: string,
    pagination: PaginationPayload = defaultPagination,
    sort: SortPayload = defaultSort,
    filter: object = defaultFilter,
    options?: UseDataProviderOptions
): {
    data: RecordMap<RecordType>;
    ids: Identifier[];
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
    refetch: Refetch;
} => {
    const requestSignature = JSON.stringify({ pagination, sort, filter });

    const {
        data: { ids, allRecords },
        total,
        error,
        loading,
        loaded,
        refetch,
    } = useQueryWithStore(
        { type: 'getList', resource, payload: { pagination, sort, filter } },
        options,
        // ids and data selector
        (state: ReduxState): DataSelectorResult<RecordType> => ({
            ids: get(
                state.admin.resources,
                [resource, 'list', 'cachedRequests', requestSignature, 'ids'],
                null
            ),
            allRecords: get(
                state.admin.resources,
                [resource, 'data'],
                defaultData
            ) as RecordMap<RecordType>,
        }),
        // total selector (may return undefined)
        (state: ReduxState): number =>
            get(state.admin.resources, [
                resource,
                'list',
                'cachedRequests',
                requestSignature,
                'total',
            ]),
        isDataLoaded
    );

    const data = useMemo(
        () =>
            ids === null
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
        ids: ids === null ? defaultIds : ids,
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

const isDataLoaded = (data: DataSelectorResult) => data.ids !== null;

export default useGetList;
