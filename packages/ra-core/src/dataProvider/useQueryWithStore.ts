import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import useDataProvider from './useDataProvider';
import getFetchType from './getFetchType';
import { useSafeSetState } from '../util/hooks';
import { ReduxState } from '../types';

export interface Query {
    type: string;
    resource: string;
    payload: object;
}

export interface QueryOptions {
    onSuccess?: (args?: any) => void;
    onFailure?: (error: any) => void;
    action?: string;
    [key: string]: any;
}

/**
 * Lists of records are initialized to a particular object,
 * so detecting if the list is empty requires some work.
 *
 * @see src/reducer/admin/data.ts
 */
const isEmptyList = data =>
    Array.isArray(data)
        ? data.length === 0
        : data &&
          Object.keys(data).length === 0 &&
          data.hasOwnProperty('fetchedAt');

/**
 * Default cache selector. Allows to cache responses by default.
 *
 * By default, custom queries are dispatched as a CUSTOM_QUERY Redux action.
 * The useDataProvider hookdispatches a CUSTOM_QUERY_SUCCESS when the response
 * comes, and the customQueries reducer stores the result in the store.
 * This selector reads the customQueries store and acts as a response cache.
 */
const defaultDataSelector = query => (state: ReduxState) => {
    const key = JSON.stringify({ ...query, type: getFetchType(query.type) });
    return state.admin.customQueries[key]
        ? state.admin.customQueries[key].data
        : undefined;
};

const defaultTotalSelector = () => null;

/**
 * Fetch the data provider through Redux, return the value from the store.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param {Object} query
 * @param {string} query.type The verb passed to th data provider, e.g. 'getList', 'getOne'
 * @param {string} query.resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} query.payload The payload object, e.g; { post_id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {Function} options.onSuccess Side effect function to be executed upon success of failure, e.g. { onSuccess: response => refresh() } }
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) } }
 * @param {function} dataSelector Redux selector to get the result. Required.
 * @param {function} totalSelector Redux selector to get the total (optional, only for LIST queries)
 *
 * @returns The current request state. Destructure as { data, total, error, loading, loaded }.
 *
 * @example
 *
 * import { useQueryWithStore } from 'react-admin';
 *
 * const UserProfile = ({ record }) => {
 *     const { data, loading, error } = useQueryWithStore(
 *         {
 *             type: 'getOne',
 *             resource: 'users',
 *             payload: { id: record.id }
 *         },
 *         {},
 *         state => state.admin.resources.users.data[record.id]
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 */
const useQueryWithStore = (
    query: Query,
    options: QueryOptions = { action: 'CUSTOM_QUERY' },
    dataSelector: (state: ReduxState) => any = defaultDataSelector(query),
    totalSelector: (state: ReduxState) => number = defaultTotalSelector
): {
    data?: any;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
} => {
    const { type, resource, payload } = query;
    const data = useSelector(dataSelector);
    const total = useSelector(totalSelector);
    const [state, setState] = useSafeSetState({
        data,
        total,
        error: null,
        loading: true,
        loaded: data !== undefined && !isEmptyList(data),
    });
    if (!isEqual(state.data, data) || state.total !== total) {
        if (isNaN(total)) {
            console.error(
                'Total from response is not a number. Please check your dataProvider or the API.'
            );
        } else {
            setState({
                ...state,
                data,
                total,
                loaded: true,
            });
        }
    }
    const dataProvider = useDataProvider();
    useEffect(() => {
        setState(prevState => ({ ...prevState, loading: true }));

        dataProvider[type](resource, payload, options)
            .then(() => {
                // We don't care about the dataProvider response here, because
                // it was already passed to SUCCESS reducers by the dataProvider
                // hook, and the result is available from the Redux store
                // through the data and total selectors.
                // In addition, if the query is optimistic, the response
                // will be empty, so it should not be used at all.
                setState(prevState => ({
                    ...prevState,
                    error: null,
                    loading: false,
                    loaded: true,
                }));
            })
            .catch(error => {
                setState({
                    error,
                    loading: false,
                    loaded: false,
                });
            });
        // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055
    }, [JSON.stringify({ query, options })]); // eslint-disable-line

    return state;
};

export default useQueryWithStore;
