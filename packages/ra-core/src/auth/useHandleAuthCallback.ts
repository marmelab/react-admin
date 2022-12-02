import { useQuery, UseQueryOptions } from 'react-query';
import { useRedirect } from '../routing';
import { AuthRedirectResult } from '../types';
import useAuthProvider from './useAuthProvider';

/**
 * This hook calls the `authProvider.handleLoginCallback()` method. This is meant to be used in a route called
 * by an external authentication service (e.g. Auth0) after the user has logged in.
 * By default, it redirects to application home page upon success, or to the `redirectTo` location returned by `authProvider. handleLoginCallback`.
 *
 * @returns An object containing { isLoading, data, error, refetch }.
 */
export const useHandleAuthCallback = <
    HandleLoginCallbackResult = AuthRedirectResult | void
>(
    options?: UseQueryOptions<HandleLoginCallbackResult>
) => {
    const authProvider = useAuthProvider();
    const redirect = useRedirect();

    return useQuery(
        ['auth', 'handleLoginCallback'],
        () => authProvider.handleLoginCallback<HandleLoginCallbackResult>(),
        {
            retry: false,
            onSuccess: data => {
                const redirectTo = (data as AuthRedirectResult)?.redirectTo;

                if (redirectTo === false) {
                    return;
                }

                redirect(
                    data == null || redirectTo === true ? '/' : redirectTo
                );
            },
            onError: err => {
                const redirectTo = (err as AuthRedirectResult)?.redirectTo;

                if (redirectTo === false) {
                    return;
                }

                redirect(err == null || redirectTo === true ? '/' : redirectTo);
            },
            ...options,
        }
    );
};
