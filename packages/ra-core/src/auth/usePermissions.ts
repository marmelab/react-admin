import { useEffect, useMemo } from 'react';
import {
    QueryObserverResult,
    useQuery,
    UseQueryOptions,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import { useEvent } from '../util';

const emptyParams = {};

/**
 * Hook for getting user permissions
 *
 * Calls the authProvider.getPermissions() method using react-query.
 * If the authProvider returns a rejected promise, returns empty permissions.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true }
 * - success: { permissions: [any], isPending: false }
 * - error: { error: [error from provider], isPending: false }
 *
 * Useful to enable features based on user permissions
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { permissions, error, isPending, refetch }.
 *
 * @example
 *     import { usePermissions } from 'react-admin';
 *
 *     const PostDetail = () => {
 *         const { isPending, permissions } = usePermissions();
 *         if (!isPending && permissions == 'editor') {
 *             return <PostEdit />
 *         } else {
 *             return <PostShow />
 *         }
 *     };
 */
const usePermissions = <PermissionsType = any, ErrorType = Error>(
    params = emptyParams,
    queryParams: UsePermissionsOptions<PermissionsType, ErrorType> = {
        staleTime: 5 * 60 * 1000,
    }
): UsePermissionsResult<PermissionsType, ErrorType> => {
    const authProvider = useAuthProvider();
    const logoutIfAccessDenied = useLogoutIfAccessDenied();
    const { onSuccess, onError, onSettled, ...queryOptions } =
        queryParams ?? {};

    const queryResult = useQuery<PermissionsType, ErrorType>({
        queryKey: ['auth', 'getPermissions', params],
        queryFn: async ({ signal }) => {
            if (!authProvider || !authProvider.getPermissions) {
                return [];
            }
            const permissions = await authProvider.getPermissions({
                ...params,
                signal,
            });
            return permissions ?? null;
        },
        ...queryOptions,
    });

    const onSuccessEvent = useEvent(onSuccess ?? noop);
    const onSettledEvent = useEvent(onSettled ?? noop);
    const onErrorEvent = useEvent(
        onError ??
            ((error: ErrorType) => {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
                logoutIfAccessDenied(error);
            })
    );

    useEffect(() => {
        if (queryResult.data === undefined || queryResult.isFetching) return;
        onSuccessEvent(queryResult.data);
    }, [onSuccessEvent, queryResult.data, queryResult.isFetching]);

    useEffect(() => {
        if (queryResult.error == null || queryResult.isFetching) return;
        onErrorEvent(queryResult.error);
    }, [onErrorEvent, queryResult.error, queryResult.isFetching]);

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

    const result = useMemo(
        () => ({
            ...queryResult,
            permissions: queryResult.data,
        }),
        [queryResult]
    );

    return !authProvider || !authProvider.getPermissions
        ? (fakeQueryResult as UsePermissionsResult<PermissionsType, ErrorType>)
        : result;
};

export default usePermissions;

export interface UsePermissionsOptions<PermissionsType = any, ErrorType = Error>
    extends Omit<
        UseQueryOptions<PermissionsType, ErrorType>,
        'queryKey' | 'queryFn'
    > {
    onSuccess?: (data: PermissionsType) => void;
    onError?: (err: ErrorType) => void;
    onSettled?: (data?: PermissionsType, error?: ErrorType | null) => void;
}

export type UsePermissionsResult<
    PermissionsType = any,
    ErrorType = Error,
> = QueryObserverResult<PermissionsType, ErrorType> & {
    permissions: PermissionsType | undefined;
};

const noop = () => {};

const fakeQueryResult = {
    permissions: undefined,
    data: undefined,
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
    refetch: () => Promise.resolve(fakeQueryResult),
};
