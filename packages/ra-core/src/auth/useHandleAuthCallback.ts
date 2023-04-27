import { useQuery, UseQueryOptions } from 'react-query';
import { useLocation } from 'react-router';
import { useRedirect } from '../routing';
import { AuthProvider, AuthRedirectResult } from '../types';
import useAuthProvider from './useAuthProvider';

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
                // AuthProviders relying on a third party services redirect back to the app can't
                // use the location state to store the path on which the user was before the login.
                // So we support a fallback on the localStorage.
                const previousLocation = localStorage.getItem(
                    PreviousLocationStorageKey
                );
                const redirectTo =
                    (data as AuthRedirectResult)?.redirectTo ??
                    previousLocation;

                if (redirectTo === false) {
                    return;
                }

                redirect(redirectTo ?? defaultRedirectUrl);
            },
            ...options,
        }
    );
};

/**
 * Key used to store the previous location in localStorage.
 * Used by the useHandleAuthCallback hook to redirect the user to their previous location after a successful login.
 */
export const PreviousLocationStorageKey = '@react-admin/nextPathname';
