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

    const queryResult = useQuery<boolean, any>({
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
                if (!logoutOnFailure) return;
                const loginUrl = removeDoubleSlashes(
                    `${basename}/${defaultAuthParams.loginUrl}`
                );
                logout(
                    {},
                    error && error.redirectTo != null
                        ? error.redirectTo
                        : loginUrl
                );
                const shouldSkipNotify = error && error.message === false;
                !shouldSkipNotify &&
                    notify(getErrorMessage(error, 'ra.auth.auth_check_error'), {
                        type: 'error',
                    });
            })
    );

    useEffect(() => {
        if (queryResult.data === undefined || queryResult.isFetching) return;
        if (queryOptions.enabled === false) return;
        onSuccessEvent(queryResult.data);
    }, [
        onSuccessEvent,
        queryResult.data,
        queryResult.isFetching,
        queryOptions.enabled,
    ]);

    useEffect(() => {
        if (queryResult.error == null || queryResult.isFetching) return;
        if (queryOptions.enabled === false) return;
        onErrorEvent(queryResult.error);
    }, [
        onErrorEvent,
        queryResult.error,
        queryResult.isFetching,
        queryOptions.enabled,
    ]);

    useEffect(() => {
        if (queryResult.status === 'pending' || queryResult.isFetching) return;
        if (queryOptions.enabled === false) return;
        onSettledEvent(queryResult.data, queryResult.error);
    }, [
        onSettledEvent,
        queryResult.data,
        queryResult.error,
        queryResult.status,
        queryResult.isFetching,
        queryOptions.enabled,
    ]);

    const result = useMemo(() => {
        return {
            ...queryResult,
            authenticated: queryResult.error ? false : queryResult.data,
        };
    }, [queryResult]);

    return authProvider != null
        ? result
        : (noAuthProviderQueryResult as UseAuthStateResult<ErrorType>);
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
    authenticated?: QueryObserverResult<boolean, ErrorType>['data'];
};

export default useAuthState;

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
          ? defaultMessage
          : error.message;

const noop = () => {};

const noAuthProviderQueryResult = {
    authenticated: true,
    data: true,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    errorUpdateCount: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'idle',
    isError: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isPaused: false,
    isPlaceholderData: false,
    isPending: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: true,
    status: 'success',
    refetch: () => Promise.resolve(noAuthProviderQueryResult),
};
