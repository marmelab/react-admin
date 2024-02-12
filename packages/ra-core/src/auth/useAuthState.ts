import { useEffect, useMemo } from 'react';
import {
    QueryObserverResult,
    useQuery,
    UseQueryOptions,
} from '@tanstack/react-query';
import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import useLogout from './useLogout';
import { removeDoubleSlashes, useBasename } from '../routing';
import { useNotify } from '../notification';
import { useEvent } from '../util';

const emptyParams = {};

/**
 * Hook for getting the authentication status
 *
 * Calls the authProvider.checkAuth() method asynchronously.
 *
 * The return value updates according to the authProvider request state:
 *
 * - isPending: true just after mount, while the authProvider is being called. false once the authProvider has answered.
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
 * @returns The current auth check state. Destructure as { authenticated, error, isPending }.
 *
 * @example
 * import { useAuthState, Loading } from 'react-admin';
 *
 * const MyPage = () => {
 *     const { isPending, authenticated } = useAuthState();
 *     if (isPending) {
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
): UseAuthStateResult<ErrorType> => {
    const authProvider = useAuthProvider();
    const logout = useLogout();
    const basename = useBasename();
    const notify = useNotify();
    const { onSuccess, onError, onSettled, ...options } = queryOptions;

    const result = useQuery<boolean, any>({
        queryKey: ['auth', 'checkAuth', params],
        queryFn: ({ signal }) => {
            // The authProvider is optional in react-admin
            if (!authProvider) {
                return true;
            }
            return authProvider
                .checkAuth({ ...params, signal })
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

    const onSuccessEvent = useEvent(onSuccess ?? noop);
    const onSettledEvent = useEvent(onSettled ?? noop);
    const onErrorEvent = useEvent(
        onError ??
            ((error: any) => {
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
            })
    );

    useEffect(() => {
        if (result.data === undefined || result.isFetching) return;
        onSuccessEvent(result.data);
    }, [onSuccessEvent, result.data, result.isFetching]);

    useEffect(() => {
        if (result.error == null || result.isFetching) return;
        onErrorEvent(result.error);
    }, [onErrorEvent, result.error, result.isFetching]);

    useEffect(() => {
        if (result.status === 'pending' || result.isFetching) return;
        onSettledEvent(result.data, result.error);
    }, [
        onSettledEvent,
        result.data,
        result.error,
        result.status,
        result.isFetching,
    ]);

    return useMemo(() => {
        return {
            ...result,
            // If the data is undefined and the query isn't loading anymore, it means the query failed.
            // In that case, we set authenticated to false unless there's no authProvider.
            authenticated:
                result.data ?? result.isLoading ? true : authProvider == null, // Optimistic,
        };
    }, [authProvider, result]);
};

type UseAuthStateOptions<ErrorType = Error> = Omit<
    UseQueryOptions<boolean, ErrorType>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (data: boolean) => void;
    onError?: (err: ErrorType) => void;
    onSettled?: (data?: boolean, error?: Error) => void;
};

export type UseAuthStateResult<ErrorType = Error> = QueryObserverResult<
    boolean,
    ErrorType
> & {
    authenticated: boolean;
};

export default useAuthState;

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;

const noop = () => {};
