import { useMemo, useRef } from 'react';
import get from 'lodash/get';

import {
    PaginationPayload,
    SortPayload,
    ReduxState,
    Identifier,
    Record,
    RecordMap,
} from '../types';
import { useQueryWithStore, Refetch } from './useQueryWithStore';

const defaultIds = [];
const defaultData = {};

/**
 * Call the dataProvider.getList() method and return the resolved result
 * as well as the loading state.
 *
 * Uses a special cache to avoid showing an empty list while re-fetching the
 * list after changing params.
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
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, total, ids, error, loading, loaded, refetch }.
 *
 * @example
 *
 * import { useGetMainList } from 'react-admin';
 *
 * const LatestNews = () => {
 *     const { data, ids, loading, error } = useGetMainList(
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
export const useGetMainList = <RecordType extends Record = Record>(
    resource: string,
    pagination: PaginationPayload,
    sort: SortPayload,
    filter: object,
    options?: any
): {
    data?: RecordMap<RecordType>;
    ids?: Identifier[];
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
    refetch: Refetch;
} => {
    const requestSignature = JSON.stringify({ pagination, sort, filter });
    const memo = useRef<Memo<RecordType>>({});
    const {
        data: { finalIds, finalTotal, allRecords },
        error,
        loading,
        loaded,
        refetch,
    } = useQueryWithStore(
        { type: 'getList', resource, payload: { pagination, sort, filter } },
        options,
        // ids and data selector
        (state: ReduxState): DataSelectorResult<RecordType> => {
            const ids = get(state.admin.resources, [
                resource,
                'list',
                'cachedRequests',
                requestSignature,
                'ids',
            ]); // default value undefined
            const total = get(state.admin.resources, [
                resource,
                'list',
                'cachedRequests',
                requestSignature,
                'total',
            ]); // default value undefined

            // When the user changes the page/sort/filter, the list of ids from
            // the cached requests is empty. To avoid rendering an empty list
            // at that moment, we override the ids and total with the latest
            // loaded ones.
            const mainIds = get(state.admin.resources, [
                resource,
                'list',
                'ids',
            ]); // default value [] (see list.ids reducer)

            // Since the total can be empty during the loading phase
            // We need to override that total with the latest loaded one
            const mainTotal = get(state.admin.resources, [
                resource,
                'list',
                'total',
            ]); // default value null (see list.total reducer)

            // Is [] for a page that was never loaded
            const finalIds = typeof ids === 'undefined' ? mainIds : ids;
            // Is null for a page that was never loaded.
            const finalTotal = typeof total === 'undefined' ? mainTotal : total;

            const allRecords = get(
                state.admin.resources,
                [resource, 'data'],
                defaultData
            ) as RecordMap<RecordType>;
            // poor man's useMemo inside a hook using a ref
            if (
                memo.current.finalIds !== finalIds ||
                memo.current.finalTotal !== finalTotal ||
                memo.current.allRecords !== allRecords
            ) {
                const result = {
                    finalIds,
                    finalTotal,
                    allRecords,
                };
                memo.current = { finalIds, finalTotal, allRecords, result };
            }
            return memo.current.result;
        },
        () => null,
        isDataLoaded
    );

    const data = useMemo(
        () =>
            typeof finalIds === 'undefined'
                ? defaultData
                : finalIds
                      .map(id => allRecords[id])
                      .reduce((acc, record) => {
                          if (!record) return acc;
                          acc[record.id] = record;
                          return acc;
                      }, {}),
        [finalIds, allRecords]
    );

    return {
        data,
        ids: typeof finalIds === 'undefined' ? defaultIds : finalIds,
        total: finalTotal,
        error,
        loading,
        loaded,
        refetch,
    };
};

interface DataSelectorResult<RecordType extends Record = Record> {
    finalIds?: Identifier[];
    finalTotal: number;
    allRecords: RecordMap<RecordType>;
}

interface Memo<RecordType extends Record = Record> {
    finalIds?: Identifier[];
    finalTotal?: number;
    allRecords?: RecordMap<RecordType>;
    result?: DataSelectorResult<RecordType>;
}

const isDataLoaded = (data: DataSelectorResult) => data.finalTotal != null; // null or undefined
