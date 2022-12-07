import { useQuery, UseQueryOptions } from 'react-query';
import { useLocation } from 'react-router';
import { useRedirect } from '../routing';
import { AuthProvider, AuthRedirectResult } from '../types';
import useAuthProvider from './useAuthProvider';
import useLogout from './useLogout';

/**
 * This hook calls the `authProvider.handleCallback()` method on mount. This is meant to be used in a route called
 * by an external authentication service (e.g. Auth0) after the user has logged in.
 * By default, it redirects to application home page upon success, or to the `redirectTo` location returned by `authProvider. handleCallback`.
 *
 * @returns An object containing { isLoading, data, error, refetch }.
 */
export const useHandleAuthCallback = (
    options?: UseQueryOptions<ReturnType<AuthProvider['handleCallback']>>
) => {
    const authProvider = useAuthProvider();
    const redirect = useRedirect();
    const logout = useLogout();
    const location = useLocation();
    const locationState = location.state as any;
    const nextPathName = locationState && locationState.nextPathname;
    const nextSearch = locationState && locationState.nextSearch;
    const defaultRedirectUrl = nextPathName ? nextPathName + nextSearch : '/';

    return useQuery(
        ['auth', 'handleCallback'],
        () => authProvider.handleCallback(),
        {
            retry: false,
            onSuccess: data => {
                const redirectTo = (data as AuthRedirectResult)?.redirectTo;

                if (redirectTo === false) {
                    return;
                }

                redirect(data == null ? defaultRedirectUrl : redirectTo);
            },
            onError: err => {
                const { redirectTo = false, logoutOnFailure = true } = (err ??
                    {}) as AuthRedirectResult;

                if (logoutOnFailure) {
                    logout({}, redirectTo);
                }
                if (redirectTo === false) {
                    return;
                }

                redirect(redirectTo);
            },
            ...options,
        }
    );
};
