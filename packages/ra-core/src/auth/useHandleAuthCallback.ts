import { useEffect } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import { useRedirect } from '../routing';
import { AuthRedirectResult } from '../types';
import useAuthProvider from './useAuthProvider';
import { useEvent } from '../util';

/**
 * This hook calls the `authProvider.handleCallback()` method on mount. This is meant to be used in a route called
 * by an external authentication service (e.g. Auth0) after the user has logged in.
 * By default, it redirects to application home page upon success, or to the `redirectTo` location returned by `authProvider. handleCallback`.
 *
 * @returns An object containing { isPending, data, error, refetch }.
 */
export const useHandleAuthCallback = (
    options?: UseHandleAuthCallbackOptions
) => {
    const authProvider = useAuthProvider();
    const redirect = useRedirect();
    const location = useLocation();
    const locationState = location.state as any;
    const nextPathName = locationState && locationState.nextPathname;
    const nextSearch = locationState && locationState.nextSearch;
    const defaultRedirectUrl = nextPathName ? nextPathName + nextSearch : '/';
    const { onSuccess, onError, onSettled, ...queryOptions } = options ?? {};

    const queryResult = useQuery({
        queryKey: ['auth', 'handleCallback'],
        queryFn: ({ signal }) =>
            authProvider && typeof authProvider.handleCallback === 'function'
                ? authProvider
                      .handleCallback({ signal })
                      .then(result => result ?? null)
                : Promise.resolve(),
        retry: false,
        ...queryOptions,
    });

    const onSuccessEvent = useEvent(
        onSuccess ??
            ((data: any) => {
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
            })
    );
    const onErrorEvent = useEvent(onError ?? noop);
    const onSettledEvent = useEvent(onSettled ?? noop);

    useEffect(() => {
        if (queryResult.error == null || queryResult.isFetching) return;
        onErrorEvent(queryResult.error);
    }, [onErrorEvent, queryResult.error, queryResult.isFetching]);

    useEffect(() => {
        if (queryResult.data === undefined || queryResult.isFetching) return;
        onSuccessEvent(queryResult.data);
    }, [onSuccessEvent, queryResult.data, queryResult.isFetching]);

    useEffect(() => {
        if (queryResult.status === 'pending' || queryResult.isFetching) return;
        onSettledEvent(queryResult.data, queryResult.error);
    }, [
        onSettledEvent,
        queryResult.data,
        queryResult.error,
        queryResult.status,
        queryResult.isFetching,
    ]);

    return queryResult;
};

/**
 * Key used to store the previous location in localStorage.
 * Used by the useHandleAuthCallback hook to redirect the user to their previous location after a successful login.
 */
export const PreviousLocationStorageKey = '@react-admin/nextPathname';

export type UseHandleAuthCallbackOptions = Omit<
    UseQueryOptions<AuthRedirectResult | void>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (data: AuthRedirectResult | void) => void;
    onError?: (err: Error) => void;
    onSettled?: (
        data?: AuthRedirectResult | void,
        error?: Error | null
    ) => void;
};

const noop = () => {};
