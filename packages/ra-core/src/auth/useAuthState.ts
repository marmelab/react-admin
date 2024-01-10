import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import useLogout from './useLogout';
import { removeDoubleSlashes, useBasename } from '../routing';
import { useNotify } from '../notification';

interface State {
    isLoading: boolean;
    authenticated?: boolean;
}

const emptyParams = {};

/**
 * Hook for getting the authentication status
 *
 * Calls the authProvider.checkAuth() method asynchronously.
 *
 * The return value updates according to the authProvider request state:
 *
 * - isLoading: true just after mount, while the authProvider is being called. false once the authProvider has answered.
 * - authenticated: true while loading. then true or false depending on the authProvider response.
 *
 * To avoid rendering a component and force waiting for the authProvider response, use the useAuthState() hook
 * instead of the useAuthenticated() hook.
 *
 * You can render different content depending on the authenticated status.
 *
 * @see useAuthenticated()
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @param {Boolean} logoutOnFailure: Optional. Whether the user should be logged out if the authProvider fails to authenticate them. False by default.
 *
 * @returns The current auth check state. Destructure as { authenticated, error, isLoading }.
 *
 * @example
 * import { useAuthState, Loading } from 'react-admin';
 *
 * const MyPage = () => {
 *     const { isLoading, authenticated } = useAuthState();
 *     if (isLoading) {
 *         return <Loading />;
 *     }
 *     if (authenticated) {
 *        return <AuthenticatedContent />;
 *     }
 *     return <AnonymousContent />;
 * };
 */
const useAuthState = (
    params: any = emptyParams,
    logoutOnFailure: boolean = false,
    queryOptions?: UseQueryOptions<boolean, any>
): State => {
    const authProvider = useAuthProvider();
    const logout = useLogout();
    const basename = useBasename();
    const notify = useNotify();

    const result = useQuery<boolean, any>(
        ['auth', 'checkAuth', params],
        () => {
            // The authProvider is optional in react-admin
            return authProvider?.checkAuth(params).then(() => true);
        },
        {
            onError: error => {
                const loginUrl = removeDoubleSlashes(
                    `${basename}/${defaultAuthParams.loginUrl}`
                );
                if (logoutOnFailure) {
                    logout(
                        {},
                        error && error.redirectTo != null
                            ? error.redirectTo
                            : loginUrl
                    );
                    const shouldSkipNotify = error && error.message === false;
                    !shouldSkipNotify &&
                        notify(
                            getErrorMessage(error, 'ra.auth.auth_check_error'),
                            { type: 'error' }
                        );
                }
            },
            retry: false,
            ...queryOptions,
        }
    );

    return useMemo(() => {
        return {
            // If the data is undefined and the query isn't loading anymore, it means the query failed.
            // In that case, we set authenticated to false unless there's no authProvider.
            authenticated:
                result.data ?? result.isLoading ? true : authProvider == null, // Optimistic
            isLoading: result.isLoading,
            error: result.error,
        };
    }, [authProvider, result]);
};

export default useAuthState;

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;
