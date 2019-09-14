import { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';

import { CRUD_GET_MANY } from '../actions/dataActions/crudGetMany';
import { GET_MANY } from '../dataFetchActions';
import { Identifier, ReduxState } from '../types';
import { useSafeSetState } from '../util/hooks';
import useDataProvider, { DataProviderHookFunction } from './useDataProvider';
import { useEffect } from 'react';

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

let queriesToCall: QueriesToCall = {};
let dataProvider: DataProviderHookFunction;

/**
 * Call the dataProvider with a GET_MANY verb and return the result as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
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
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, error, loading, loaded }.
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
const useGetMany = (resource: string, ids: Identifier[], options: any = {}) => {
    // we can't use useQueryWithStore here because we're aggregating queries first
    // therefore part of the useQueryWithStore logic will have to be repeated below
    const selectMany = useMemo(makeGetManySelector, []);
    const data = useSelector((state: ReduxState) =>
        selectMany(state, resource, ids)
    );
    const [state, setState] = useSafeSetState({
        data,
        error: null,
        loading: ids.length !== 0,
        loaded:
            ids.length === 0 ||
            (data.length !== 0 && !data.includes(undefined)),
    });
    if (!isEqual(state.data, data)) {
        setState({
            ...state,
            data,
            loaded: true,
        });
    }
    dataProvider = useDataProvider(); // not the best way to pass the dataProvider to a function outside the hook, but I couldn't find a better one
    useEffect(() => {
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
    }, [JSON.stringify({ resource, ids, options }), dataProvider]); // eslint-disable-line react-hooks/exhaustive-deps

    return state;
};

/**
 * Memoized selector for getting an array of resources based on an array of ids
 *
 * @see https://react-redux.js.org/next/api/hooks#using-memoizing-selectors
 */
const makeGetManySelector = () =>
    createSelector(
        (state: ReduxState) => state.admin.resources,
        (_, resource) => resource,
        (_, __, ids) => ids,
        (resources, resource, ids) =>
            resources[resource]
                ? ids.map(id => resources[resource].data[id])
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
            .filter(v => v != null); // remove null values
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
        dataProvider(
            GET_MANY,
            resource,
            { ids: accumulatedIds },
            { action: CRUD_GET_MANY }
        )
            .then(response =>
                // Forces batching, see https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973
                ReactDOM.unstable_batchedUpdates(() =>
                    queries.forEach(({ ids, setState, onSuccess }) => {
                        setState(prevState => ({
                            ...prevState,
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
