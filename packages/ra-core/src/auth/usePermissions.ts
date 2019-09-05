import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import useAuthProvider from './useAuthProvider';
import { useSafeSetState } from '../util/hooks';
import { ReduxState } from '../types';

interface State {
    loading: boolean;
    loaded: boolean;
    permissions?: any;
    error?: any;
}

const emptyParams = {};

/**
 * Hook for getting user permissions
 *
 * Calls the authProvider asynchronously with the AUTH_GET_PERMISSIONS verb.
 * If the authProvider returns a rejected promise, returns empty permissions.
 *
 * The return value updates according to the request state:
 *
 * - start: { loading: true, loaded: false }
 * - success: { permissions: [any], loading: false, loaded: true }
 * - error: { error: [error from provider], loading: false, loaded: true }
 *
 * Useful to enable features based on user permissions
 *
 * @param {Object} authParams Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { permissions, error, loading, loaded }.
 *
 * @example
 *     import { usePermissions } from 'react-admin';
 *
 *     const PostDetail = props => {
 *         const { loaded, permissions } = usePermissions();
 *         if (loaded && permissions == 'editor') {
 *             return <PostEdit {...props} />
 *         } else {
 *             return <PostShow {...props} />
 *         }
 *     };
 */
const usePermissions = (authParams = emptyParams) => {
    const [state, setState] = useSafeSetState<State>({
        loading: true,
        loaded: false,
    });
    const location = useSelector((state: ReduxState) => state.router.location);
    const { getPermissions } = useAuthProvider(authParams);
    useEffect(() => {
        getPermissions(location)
            .then(permissions => {
                setState({ loading: false, loaded: true, permissions });
            })
            .catch(error => {
                setState({
                    loading: false,
                    loaded: true,
                    error,
                });
            });
    }, [authParams, getPermissions, location, setState]);
    return state;
};

export default usePermissions;
