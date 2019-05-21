import { useEffect } from 'react';
// @ts-ignore
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { ReduxState } from '../types';
import { useSafeSetState } from './hooks';
import useDataProvider from './useDataProvider';

export interface Query {
    type: string;
    resource: string;
    payload: object;
}

export interface QueryOptions {
    meta?: any;
    action?: string;
}

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
 * @param {string} query.type The verb passed to th data provider, e.g. 'GET_LIST', 'GET_ONE'
 * @param {string} query.resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} query.payload The payload object, e.g; { post_id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {Object} options.meta Redux action metas, including side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
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
 *             type: 'GET_ONE',
 *             resource: 'users',
 *             payload: { id: record.id }
 *         },
 *         state => state.admin.resources.users.data[record.id]
 *     );
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 */
const useQueryWithStore = (
    query: Query,
    options: QueryOptions = {},
    dataSelector: (state: ReduxState) => any,
    totalSelector?: (state: ReduxState) => number
): {
    data?: any;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
} => {
    const { type, resource, payload } = query;
    const data = useSelector(dataSelector);
    const total = totalSelector ? useSelector(totalSelector) : null;
    const [state, setState] = useSafeSetState({
        data,
        total,
        error: null,
        loading: true,
        loaded: data !== undefined,
    });
    if (!isEqual(state.data, data) || state.total !== total) {
        setState({
            ...state,
            data,
            total,
            loaded: true,
        });
    }
    const dataProvider = useDataProvider();
    useEffect(() => {
        dataProvider(type, resource, payload, options)
            .then(() => {
                setState(prevState => ({
                    ...prevState,
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
    }, [JSON.stringify({ query, options })]); // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055

    return state;
};

export default useQueryWithStore;
