import { useMemo } from 'react';
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
    const selectMany = useMemo(makeGetManySelector, []);
    const data = useSelector((state: ReduxState) =>
        selectMany(state, resource, ids)
    );
    const [state, setState] = useSafeSetState({
        data,
        error: null,
        loading: true,
        loaded: data.length !== 0 && !data.includes(undefined),
    });
    if (!isEqual(state.data, data)) {
        setState({
            ...state,
            data,
            loaded: true,
        });
    }
    dataProvider = useDataProvider();
    useEffect(() => {
        if (!queriesToCall[resource]) {
            queriesToCall[resource] = [];
        }
        queriesToCall[resource] = queriesToCall[resource].concat({
            ids,
            setState,
            onSuccess: options && options.onSuccess,
            onFailure: options && options.onfailure,
        });
        callQueries();
    }, [JSON.stringify({ resource, ids, options }), dataProvider]); // eslint-disable-line react-hooks/exhaustive-deps

    return state;
};

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

const callQueries = debounce(() => {
    const resources = Object.keys(queriesToCall);
    resources.forEach(resource => {
        const queries = [...queriesToCall[resource]];
        const accumulatedIds = queries
            .reduce((acc, { ids }) => union(acc, ids), []) // concat + unique
            .filter(v => v != null);
        if (accumulatedIds.length === 0) return;
        dataProvider(
            GET_MANY,
            resource,
            { ids: accumulatedIds },
            {
                action: CRUD_GET_MANY,
                onSuccess: response => {
                    queries.forEach(({ ids, setState, onSuccess }) => {
                        const subData = {
                            data: ids.map(id =>
                                response.data.find(datum => datum.id == id)
                            ),
                        };
                        setState(prevState => ({
                            ...prevState,
                            loading: false,
                            loaded: true,
                        }));
                        onSuccess && onSuccess(subData);
                    });
                },
                onFailure: error => {
                    queries.forEach(({ setState, onFailure }) => {
                        setState({ error, loading: false, loaded: false });
                        onFailure && onFailure(error);
                    });
                },
            }
        );
        delete queriesToCall[resource];
    });
});

export default useGetMany;
