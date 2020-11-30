import { useEffect } from 'react';
import isEqual from 'lodash/isEqual';

import useGetPermissions from './useGetPermissions';
import { useSafeSetState } from '../util/hooks';

interface State {
    loading: boolean;
    loaded: boolean;
    permissions?: any;
    error?: any;
}

const emptyParams = {};

// keep a cache of already fetched permissions to initialize state for new
// components and avoid a useless rerender if the permissions haven't changed
const alreadyFetchedPermissions = { '{}': [] };

/**
 * Hook for getting user permissions
 *
 * Calls the authProvider.getPrmissions() method asynchronously.
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
const usePermissions = (params = emptyParams) => {
    const [state, setState] = useSafeSetState<State>({
        loading: true,
        loaded: false,
        permissions: alreadyFetchedPermissions[JSON.stringify(params)],
    });
    const getPermissions = useGetPermissions();
    useEffect(() => {
        getPermissions(params)
            .then(permissions => {
                const key = JSON.stringify(params);
                if (!isEqual(permissions, alreadyFetchedPermissions[key])) {
                    alreadyFetchedPermissions[key] = permissions;
                    setState({ loading: false, loaded: true, permissions });
                }
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
