import { useEffect } from 'react';

import useGetPermissions from './useGetPermissions';
import { useSafeSetState } from '../util/hooks';

interface State<Permissions, Error> {
    isLoading: boolean;
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
 * - start: { isLoading: true }
 * - success: { permissions: [any], isLoading: false }
 * - error: { error: [error from provider], isLoading: false }
 *
 * Useful to enable features based on user permissions
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { permissions, error, isLoading }.
 *
 * @example
 *     import { usePermissions } from 'react-admin';
 *
 *     const PostDetail = props => {
 *         const { isLoading, permissions } = usePermissions();
 *         if (!isLoading && permissions == 'editor') {
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
        isLoading: true,
    });
    const getPermissions = useGetPermissions();
    useEffect(() => {
        getPermissions(params)
            .then(permissions => {
                setState({ isLoading: false, permissions });
            })
            .catch(error => {
                setState({
                    isLoading: false,
                    error,
                });
            });
    }, [getPermissions, params, setState]);
    return state;
};

export default usePermissions;
