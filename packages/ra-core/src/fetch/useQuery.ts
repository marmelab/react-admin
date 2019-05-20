import { useEffect } from 'react';
// @ts-ignore
import { useSelector } from 'react-redux';

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
    undoable?: false;
}

/**
 * Fetch the data provider through Redux
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * @param {Object} query
 * @param {string} query.type The verb passed to th data provider, e.g. 'GET_LIST', 'GET_ONE'
 * @param {string} query.resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} query.payload The payload object, e.g; { post_id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {Object} options.meta Redux action metas, including side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 * @param {function} selector Redux selector to get the result
 *
 * @returns The current request state. Destructure as { data, total, error, loading, loaded }.
 *
 * @example
 *
 * import { useQuery } from 'react-admin';
 *
 * const UserProfile = ({ record }) => {
 *     const { data, loading, error } = useQuery({
 *         type: 'GET_ONE',
 *         resource: 'users',
 *         payload: { id: record.id }
 *     });
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 *
 * @example
 *
 * import { useQuery } from 'react-admin';
 *
 * const payload = {
 *    pagination: { page: 1, perPage: 10 },
 *    sort: { field: 'username', order: 'ASC' },
 * };
 * const UserList = () => {
 *     const { data, total, loading, error } = useQuery({
 *         type: 'GET_LIST',
 *         resource: 'users',
 *         payload
 *     });
 *     if (loading) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return (
 *         <div>
 *             <p>Total users: {total}</p>
 *             <ul>
 *                 {data.map(user => <li key={user.username}>{user.username}</li>)}
 *             </ul>
 *         </div>
 *     );
 * };
 */
const useQuery = (
    query: Query,
    options: QueryOptions = {},
    selector?: (state: ReduxState) => any
): {
    data?: any;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
} => {
    const { type, resource, payload } = query;
    const [state, setState] = useSafeSetState({
        data: selector ? useSelector(selector) : null,
        error: null,
        total: null,
        loading: true,
        loaded: false,
    });
    const dataProvider = useDataProvider();
    useEffect(() => {
        dataProvider(type, resource, payload, options)
            .then(({ data: dataFromResponse, total: totalFromResponse }) => {
                setState({
                    data: dataFromResponse,
                    total: totalFromResponse,
                    loading: false,
                    loaded: true,
                });
            })
            .catch(errorFromResponse => {
                setState({
                    error: errorFromResponse,
                    loading: false,
                    loaded: false,
                });
            });
    }, [JSON.stringify({ query, options })]); // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055

    return state;
};

export default useQuery;
