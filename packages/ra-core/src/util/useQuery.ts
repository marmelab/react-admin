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

// thanks Kent C Dodds for the following helpers

function useSetState(initialState) {
    return useReducer(
        (state, newState) => ({ ...state, ...newState }),
        initialState
    );
}

function useSafeSetState(initialState) {
    const [state, setState] = useSetState(initialState);

    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => (mountedRef.current = false);
    }, []);
    const safeSetState = args => mountedRef.current && setState(args);

    return [state, safeSetState];
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function useDeepCompareEffect(callback, inputs) {
    const cleanupRef = useRef();
    useEffect(() => {
        if (!isEqual(previousInputs, inputs)) {
            cleanupRef.current = callback();
        }
        return cleanupRef.current;
    });
    const previousInputs = usePrevious(inputs);
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
    const [state, setState] = useSafeSetState({
        data: null,
        error: null,
        total: null,
        loading: true,
        loaded: false,
    });
    const dataProvider = useDataProvider();
    useDeepCompareEffect(() => {
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
    }, [type, resource, payload, options]);

    return state;
};

export default useQuery;
