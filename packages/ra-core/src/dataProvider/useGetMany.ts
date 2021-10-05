import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import { CRUD_GET_MANY } from '../actions/dataActions/crudGetMany';
import { Identifier, Record, ReduxState, DataProviderProxy } from '../types';
import { useSafeSetState } from '../util/hooks';
import useDataProvider from './useDataProvider';
import { useEffect } from 'react';
import { useVersion } from '../controller';
import { Refetch } from './useQueryWithStore';

type Callback = (args?: any) => void;
type SetState = (args: any) => void;
interface Query {
    ids: Identifier[];
    onSuccess: Callback;
    onFailure: Callback;
    setState: SetState;
}
interface QueriesToCall {
    [resource: string]: Query[];
}
interface UseGetManyOptions {
    onSuccess?: Callback;
    onFailure?: Callback;
    enabled?: boolean;
}
interface UseGetManyResult {
    data: Record[];
    error?: any;
    loading: boolean;
    loaded: boolean;
    refetch: Refetch;
}
let queriesToCall: QueriesToCall = {};
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
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) }
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
const useGetMany = (
    resource: string,
    ids: Identifier[],
    options: UseGetManyOptions = { enabled: true }
): UseGetManyResult => {
    // we can't use useQueryWithStore here because we're aggregating queries first
    // therefore part of the useQueryWithStore logic will have to be repeated below
    const selectMany = useMemo(makeGetManySelector, []);
    const data = useSelector((state: ReduxState) =>
        selectMany(state, resource, ids)
    );
    const version = useVersion(); // used to allow force reload
    // used to force a refetch without relying on version
    // which might trigger other queries as well
    const [innerVersion, setInnerVersion] = useSafeSetState(0);

    const refetch = useCallback(() => {
        setInnerVersion(prevInnerVersion => prevInnerVersion + 1);
    }, [setInnerVersion]);

    const [state, setState] = useSafeSetState({
        data,
        error: null,
        loading: ids.length !== 0,
        loaded: data.length !== 0 && !data.includes(undefined),
        refetch,
    });
    if (!isEqual(state.data, data)) {
        setState({
            ...state,
            data,
        });
    }
    dataProvider = useDataProvider(); // not the best way to pass the dataProvider to a function outside the hook, but I couldn't find a better one
    useEffect(
        () => {
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
             *     { ids: [345], setState, onFailure }
             *   ]
             * }
             */
            queriesToCall[resource] = queriesToCall[resource].concat({
                ids,
                setState,
                onSuccess: options && options.onSuccess,
                onFailure: options && options.onFailure,
            });
            callQueries(); // debounced by lodash
        },
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            JSON.stringify({
                resource,
                ids,
                options,
                version,
                innerVersion,
            }),
            dataProvider,
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    return state;
};

/**
 * Memoized selector for getting an array of resources based on an array of ids
 *
 * @see https://react-redux.js.org/next/api/hooks#using-memoizing-selectors
 */
const makeGetManySelector = () =>
    createSelector(
        [
            (state: ReduxState, resource) =>
                get(state, ['admin', 'resources', resource, 'data']),
            (_, __, ids) => ids,
        ],
        (resourceData, ids) =>
            resourceData
                ? ids.map(id => resourceData[id])
                : ids.map(id => undefined)
    );

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
                    loading: false,
                    loaded: true,
                });
                if (onSuccess) {
                    onSuccess({ data: emptyArray });
                }
            });
            return;
        }
        dataProvider
            .getMany(resource, { ids: accumulatedIds }, DataProviderOptions)
            .then(response =>
                // Forces batching, see https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
                ReactDOM.unstable_batchedUpdates(() =>
                    queries.forEach(({ ids, setState, onSuccess }) => {
                        setState(prevState => ({
                            ...prevState,
                            error: null,
                            loading: false,
                            loaded: true,
                        }));
                        if (onSuccess) {
                            const subData = ids.map(
                                id =>
                                    response.data.find(datum => datum.id == id) // eslint-disable-line eqeqeq
                            );
                            onSuccess({ data: subData });
                        }
                    })
                )
            )
            .catch(error =>
                ReactDOM.unstable_batchedUpdates(() =>
                    queries.forEach(({ setState, onFailure }) => {
                        setState({ error, loading: false, loaded: false });
                        onFailure && onFailure(error);
                    })
                )
            );
        delete queriesToCall[resource];
    });
});

const emptyArray = [];

export default useGetMany;
