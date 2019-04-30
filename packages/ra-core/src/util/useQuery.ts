import { useReducer, useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import useDataProvider from './useDataProvider';

interface State {
    data?: any;
    total?: number;
    loading: boolean;
    loaded: boolean;
    error?: any;
}

/**
 * Fetch the data provider and return the result.
 *
 * @example
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
    options?: any
): State => {
    const [state, setState] = useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        {
            data: null,
            error: null,
            total: null,
            loading: false,
            loaded: false,
        }
    );
    const dataProvider = useDataProvider();
    useEffect(() => {
        if (
            isEqual(previousInputs.current, [type, resource, payload, options])
        ) {
            return;
        }
        setState({ loading: true });
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
    });

    const previousInputs = useRef<any>();
    useEffect(() => {
        previousInputs.current = [type, resource, payload, options];
    });

    return state;
};

export default useQuery;
