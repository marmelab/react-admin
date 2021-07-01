import { useEffect } from 'react';

import useGetPermissions from './useGetPermissions';
import { useSafeSetState } from '../util/hooks';

interface State<Permissions, Error> {
    loading: boolean;
    loaded: boolean;
    permissions?: Permissions;
    error?: Error;
}

const emptyParams = {};

/**
 * Hook for getting user permissions
 *
 * Calls the authProvider.getPermissions() method asynchronously.
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
 * @param {Object} params Any params you want to pass to the authProvider
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
const usePermissions = <Permissions = any, Error = any>(
    params = emptyParams
): State<Permissions, Error> => {
    const [state, setState] = useSafeSetState<State<Permissions, Error>>({
        loading: true,
        loaded: false,
    });
    const getPermissions = useGetPermissions();
    useEffect(() => {
        getPermissions(params)
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
    }, [getPermissions, params, setState]);
    return state;
};

export default usePermissions;
