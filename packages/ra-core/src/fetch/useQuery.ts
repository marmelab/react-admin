import { useEffect } from 'react';
import { useSafeSetState } from './hooks';
import useDataProvider from './useDataProvider';

/**
 * Fetch the data provider through Redux
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { data: [data from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * @param type The verb passed to th data provider, e.g. 'GET_LIST', 'GET_ONE'
 * @param resource A resource name, e.g. 'posts', 'comments'
 * @param payload The payload object, e.g; { post_id: 12 }
 * @param meta Redux action metas, including side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as { data, total, error, loading, loaded }.
 *
 * @example
 *
 * import { useQuery } from 'react-admin';
 *
 * const UserProfile = ({ record }) => {
 *     const { data, loading, error } = useQuery('GET_ONE', 'users', { id: record.id });
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
 *     const { data, total, loading, error } = useQuery('GET_LIST', 'users', payload);
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
    type: string,
    resource: string,
    payload?: any,
    meta?: any
): {
    data?: any;
    total?: number;
    error?: any;
    loading: boolean;
    loaded: boolean;
} => {
    const [state, setState] = useSafeSetState({
        data: null,
        error: null,
        total: null,
        loading: true,
        loaded: false,
    });
    const dataProvider = useDataProvider();
    useEffect(() => {
        dataProvider(type, resource, payload, meta)
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
    }, [JSON.stringify({ type, resource, payload, meta })]); // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055

    return state;
};

export default useQuery;
