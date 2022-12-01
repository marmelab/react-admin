import { useQuery, UseQueryOptions } from 'react-query';
import { useBasename, useRedirect } from '../routing';
import { removeDoubleSlashes } from '../routing/useCreatePath';
import { AuthRedirectResult } from '../types';
import useAuthProvider from './useAuthProvider';

/**
 * This hook calls the `authProvider.handleLoginCallback()` method. This is meant to be used in a route called
 * by an external authentication service (e.g. Auth0) after the user has logged in.
 * By default, it redirects to the `redirectTo` location, home page if undefined.
 *
 * @returns The result of the `handleLoginCallback` call. Destructure as { isLoading, data, error, refetch }.
 */
export const useHandleLoginCallback = <
    HandleLoginCallbackResult = AuthRedirectResult | void
>(
    options?: UseQueryOptions<HandleLoginCallbackResult>
) => {
    const authProvider = useAuthProvider();
    const redirect = useRedirect();
    const basename = useBasename();

    return useQuery(
        ['handleLoginCallback', 'auth'],
        () => authProvider.handleLoginCallback<HandleLoginCallbackResult>(),
        {
            retry: false,
            onSuccess: data => {
                const redirectTo = (data as AuthRedirectResult)?.redirectTo;

                if (redirectTo === false) {
                    return;
                }

                redirect(
                    data == null || redirectTo === true
                        ? removeDoubleSlashes(`${basename}/`)
                        : redirectTo
                );
            },
            onError: err => {
                const redirectTo = (err as AuthRedirectResult)?.redirectTo;

                if (redirectTo === false) {
                    return;
                }

                redirect(
                    err == null || redirectTo === true
                        ? removeDoubleSlashes(`${basename}/`)
                        : redirectTo
                );
            },
            ...options,
        }
    );
};
