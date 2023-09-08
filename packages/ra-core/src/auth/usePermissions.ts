import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import useAuthProvider from './useAuthProvider';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';

const emptyParams = {};

/**
 * Hook for getting user permissions
 *
 * Calls the authProvider.getPermissions() method using react-query.
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
 * @returns The current auth check state. Destructure as { permissions, error, isLoading, refetch }.
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
    params = emptyParams,
    queryParams: UseQueryOptions<Permissions, Error> = {
        staleTime: 5 * 60 * 1000,
    }
) => {
    const authProvider = useAuthProvider();
    const logoutIfAccessDenied = useLogoutIfAccessDenied();

    const result = useQuery(
        ['auth', 'getPermissions', params],
        authProvider
            ? () => authProvider.getPermissions(params)
            : async () => [],
        {
            onError: error => {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
                logoutIfAccessDenied(error);
            },
            ...queryParams,
        }
    );

    return useMemo(
        () => ({
            permissions: result.data,
            isLoading: result.isLoading,
            error: result.error,
            refetch: result.refetch,
        }),
        [result]
    );
};

export default usePermissions;
