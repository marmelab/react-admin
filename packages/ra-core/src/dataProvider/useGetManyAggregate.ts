import ReactDOM from 'react-dom';
import {
    QueryClient,
    useQueryClient,
    useQuery,
    UseQueryOptions,
} from 'react-query';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import { CRUD_GET_MANY } from '../actions/dataActions/crudGetMany';
import { UseGetManyHookValue } from './useGetMany';
import {
    Identifier,
    Record,
    ReduxState,
    DataProviderProxy,
    GetManyParams,
} from '../types';
import { useSafeSetState } from '../util/hooks';
import { useEffect } from 'react';
import { Refetch } from './useQueryWithStore';
import { useDataProvider } from '.';

type Callback = (args?: any) => void;

interface Query {
    ids: Identifier[];
    resolve: Callback;
    reject: Callback;
}
interface QueriesToCall {
    [resource: string]: Query[];
}

let queriesToCall: QueriesToCall = {};

/**
 * Call the dataProvider.getMany() method and return the resolved result
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false, refetch }
 * - success: { data: [data from response], loading: false, loaded: true, refetch }
 * - error: { error: [error from response], loading: false, loaded: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * This hook aggregates and deduplicates calls to the same resource, so for instance, if an app calls:
 *
 * useGetMany('tags', [1, 2, 3]);
 * useGetMany('tags', [3, 4]);
 *
 * during the same tick, the hook will only call the dataProvider once with the following parameters:
 *
 * dataProvider(GET_MANY, 'tags', [1, 2, 3, 4])
 *
 * @param resource The resource name, e.g. 'posts'
 * @param ids The resource identifiers, e.g. [123, 456, 789]
 * @param {Object} options Options object to pass to the dataProvider.
 * @param {boolean} options.enabled Flag to conditionally run the query. If it's false, the query will not run
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @param {Function} options.onError Side effect function to be executed upon failure, e.g. { onError: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, error, loading, loaded, refetch }.
 *
 * @example
 *
 * import { useGetMany } from 'react-admin';
 *
 * const PostTags = ({ record }) => {
 *     const { data, loading, error } = useGetMany('tags', record.tagIds);
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return (
 *          <ul>
 *              {data.map(tag => (
 *                  <li key={tag.id}>{tag.name}</li>
 *              ))}
 *          </ul>
 *      );
 * };
 */
export const useGetManyAggregate = <RecordType extends Record = Record>(
    resource: string,
    params: GetManyParams,
    options: UseQueryOptions<RecordType[], Error>
): UseGetManyHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { ids } = params;

    return useQuery<RecordType[], Error, RecordType[]>(
        [resource, 'getMany', { ids: ids.map(id => String(id)) }],
        () =>
            new Promise((resolve, reject) => {
                if (!queriesToCall[resource]) {
                    queriesToCall[resource] = [];
                }
                /**
                 * queriesToCall stores the queries to call under the following shape:
                 *
                 * {
                 *   'posts': [
                 *     { ids: [1, 2], resolve, reject }
                 *     { ids: [2, 3], resolve, reject }
                 *     { ids: [4, 5], resolve, reject }
                 *   ],
                 *   'comments': [
                 *     { ids: [345], resolve, reject }
                 *   ]
                 * }
                 */
                queriesToCall[resource] = queriesToCall[resource].concat({
                    ids,
                    resolve,
                    reject,
                });
                callQueries(dataProvider, queryClient); // debounced by lodash
            }),
        {
            onSuccess: data => {
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', String(record.id)],
                        record
                    );
                });
            },
            ...options,
        }
    );
};

/**
 * Call the dataProvider once per resource
 */
const callQueries = debounce(
    (dataProvider: DataProviderProxy, queryClient: QueryClient) => {
        const resources = Object.keys(queriesToCall);
        resources.forEach(resource => {
            const queries = [...queriesToCall[resource]]; // cloning to avoid side effects
            /**
             * Extract ids from queries, aggregate and deduplicate them
             *
             * @example from [[1, 2], [2, null, 3], [4, null]] to [1, 2, 3, 4]
             */
            const accumulatedIds = queries
                .reduce((acc, { ids }) => union(acc, ids), []) // concat + unique
                .filter(v => v != null && v !== ''); // remove null values
            if (accumulatedIds.length === 0) {
                // no need to call the data provider if all the ids are null
                queries.forEach(({ resolve }) => {
                    resolve({ data: [] });
                });
                return;
            }
            queryClient
                .fetchQuery<any[], Error, any[]>(
                    [
                        resource,
                        'getMany',
                        { ids: accumulatedIds.map(id => String(id)) },
                    ],
                    () =>
                        dataProvider
                            .getMany<any>(resource, { ids: accumulatedIds })
                            .then(({ data }) => data)
                )
                .then(data => {
                    queries.forEach(({ ids, resolve }) => {
                        resolve(data.filter(record => ids.includes(record.id)));
                    });
                })
                .catch(error => queries.forEach(({ reject }) => reject(error)));

            delete queriesToCall[resource];
        });
    }
);
