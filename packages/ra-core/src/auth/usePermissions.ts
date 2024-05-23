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

    const result = useQuery<PermissionsType, ErrorType>({
        queryKey: ['auth', 'getPermissions', params],
        queryFn: async ({ signal }) => {
            if (!authProvider) return Promise.resolve([]);
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

    return useMemo(
        () => ({
            ...result,
            permissions: result.data,
        }),
        [result]
    );
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
