import ReactDOM from 'react-dom';
import { QueryClient, useQueryClient } from 'react-query';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import { CRUD_GET_MANY } from '../actions/dataActions/crudGetMany';
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
type SetState = (args: any) => void;
interface Query {
    ids: Identifier[];
    onSuccess: Callback;
    onError: Callback;
    setState: SetState;
}
interface QueriesToCall {
    [resource: string]: Query[];
}
interface UseGetManyOptions {
    onSuccess?: Callback;
    onError?: Callback;
    enabled?: boolean;
}
interface UseGetManyAggregateResult<RecordType extends Record = Record> {
    data: RecordType[];
    error?: any;
    isFetching: boolean;
    isLoading: boolean;
    refetch: Refetch;
}
let queriesToCall: QueriesToCall = {};
let queryClient: QueryClient;
let dataProvider: DataProviderProxy;

const DataProviderOptions = { action: CRUD_GET_MANY };

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
    options: UseGetManyOptions = { enabled: true }
): UseGetManyAggregateResult<RecordType> => {
    dataProvider = useDataProvider();
    queryClient = useQueryClient(); // not the best way to pass the queryClient to a function outside the hook, but I couldn't find a better one
    const { ids } = params;
    const dataFromCache = ids.map(id =>
        queryClient.getQueryData<RecordType[]>([resource, 'getOne', String(id)])
    );
    const data = dataFromCache.find(record => record !== undefined)
        ? dataFromCache
        : undefined;
    const [state, setState] = useSafeSetState({
        data,
        error: null,
        isLoading: !data,
        isFetching: true,
        refetch: () => {}, // fixme
    });

    useEffect(() => {
        if (options.enabled === false) {
            return;
        }

        if (!queriesToCall[resource]) {
            queriesToCall[resource] = [];
        }
        /**
         * queriesToCall stores the queries to call under the following shape:
         *
         * {
         *   'posts': [
         *     { ids: [1, 2], setState }
         *     { ids: [2, 3], setState, onSuccess }
         *     { ids: [4, 5], setState }
         *   ],
         *   'comments': [
         *     { ids: [345], setState, onError }
         *   ]
         * }
         */
        queriesToCall[resource] = queriesToCall[resource].concat({
            ids,
            setState,
            onSuccess: options && options.onSuccess,
            onError: options && options.onError,
        });
        callQueries(); // debounced by lodash
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify({ resource, ids, options }), setState]);

    return state;
};

/**
 * Call the dataProvider once per resource
 */
const callQueries = debounce(() => {
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
            queries.forEach(({ ids, setState, onSuccess }) => {
                setState({
                    data: emptyArray,
                    isLoading: false,
                    isFetching: false,
                });
                if (onSuccess) {
                    onSuccess({ data: emptyArray });
                }
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
                // Forces batching, see https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
                ReactDOM.unstable_batchedUpdates(() =>
                    queries.forEach(({ ids, setState, onSuccess }) => {
                        const subData = ids.map(
                            id => data.find(datum => datum.id == id) // eslint-disable-line eqeqeq
                        );
                        setState({
                            data: subData,
                            error: null,
                            isFetching: false,
                            isLoading: false,
                        });
                        if (onSuccess) {
                            onSuccess({ data: subData });
                        }
                    })
                );
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getOne', String(record.id)],
                        record
                    );
                });
            })
            .catch(error =>
                ReactDOM.unstable_batchedUpdates(() =>
                    queries.forEach(({ setState, onError }) => {
                        setState({
                            error,
                            isLoading: false,
                            isFetching: false,
                        });
                        onError && onError(error);
                    })
                )
            );
        delete queriesToCall[resource];
    });
});

const emptyArray = [];
