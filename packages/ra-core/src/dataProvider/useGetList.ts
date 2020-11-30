import { useMemo } from 'react';
import get from 'lodash/get';

import {
    PaginationPayload,
    SortPayload,
    ReduxState,
    Identifier,
    Record,
    RecordMap,
} from '../types';
import useQueryWithStore from './useQueryWithStore';

const defaultIds = [];
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
 * @param {Object} options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
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
const useGetList = <RecordType extends Record = Record>(
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
} => {
    const requestSignature = JSON.stringify({ pagination, sort, filter });

    const {
        data: { ids, allRecords },
        total,
        error,
        loading,
        loaded,
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
            ),
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
    };
};

interface DataSelectorResult<RecordType extends Record = Record> {
    ids: Identifier[];
    allRecords: RecordMap<RecordType>;
}

const isDataLoaded = (data: DataSelectorResult) => data.ids !== null;

export default useGetList;
