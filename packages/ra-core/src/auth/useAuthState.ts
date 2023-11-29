import { useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import useLogout from './useLogout';
import { removeDoubleSlashes, useBasename } from '../routing';
import { useNotify } from '../notification';

const emptyParams = {};

/**
 * Hook for getting the authentication status
 *
 * Calls the authProvider.checkAuth() method asynchronously.
 *
 * The return value updates according to the authProvider request state:
 *
 * - isLoading: true just after mount, while the authProvider is being called. false once the authProvider has answered.
 * - data: true while loading. then true or false depending on the authProvider response.
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
 *     const { isLoading, data: authenticated } = useAuthState();
 *     if (isLoading) {
 *         return <Loading />;
 *     }
 *     if (authenticated) {
 *        return <AuthenticatedContent />;
 *     }
 *     return <AnonymousContent />;
 * };
 */
const useAuthState = <ErrorType = Error>(
    params: any = emptyParams,
    logoutOnFailure: boolean = false,
    queryOptions: UseAuthStateOptions<ErrorType> = emptyParams
) => {
    const authProvider = useAuthProvider();
    const logout = useLogout();
    const basename = useBasename();
    const notify = useNotify();
    const { onSuccess, onError, ...options } = queryOptions;

    const result = useQuery<boolean, any>({
        queryKey: ['auth', 'checkAuth', params],
        placeholderData: true, // Optimistic
        queryFn: () => {
            // The authProvider is optional in react-admin
            if (!authProvider) {
                return true;
            }
            return authProvider
                .checkAuth(params)
                .then(() => true)
                .catch(error => {
                    // This is necessary because react-query requires the error to be defined
                    if (error != null) {
                        throw error;
                    }

                    throw new Error();
                });
        },
        retry: false,
        ...options,
    });

    useEffect(() => {
        if (result.data != null && onSuccess) {
            onSuccess(result.data);
        }
    }, [onSuccess, result.data]);

    useEffect(() => {
        if (result.error != null) {
            if (onError) {
                return onError(result.error);
            }

            const loginUrl = removeDoubleSlashes(
                `${basename}/${defaultAuthParams.loginUrl}`
            );
            if (logoutOnFailure) {
                logout(
                    {},
                    result.error && result.error.redirectTo != null
                        ? result.error.redirectTo
                        : loginUrl
                );
                const shouldSkipNotify =
                    result.error && result.error.message === false;
                !shouldSkipNotify &&
                    notify(
                        getErrorMessage(
                            result.error,
                            'ra.auth.auth_check_error'
                        ),
                        { type: 'error' }
                    );
            }
        }
    }, [basename, logout, logoutOnFailure, notify, onError, result.error]);

    return result;
};

type UseAuthStateOptions<ErrorType = Error> = Omit<
    UseQueryOptions<boolean, ErrorType>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (data: boolean) => void;
    onError?: (err: ErrorType) => void;
};

export default useAuthState;

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;
