import { useEffect, useMemo } from 'react';
import {
    QueryObserverResult,
    useQuery,
    UseQueryOptions,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import { useEvent } from '../util';

/**
 * Hook for determining if user can access given resource
 *
 * Calls the authProvider.canAccess() method using react-query.
 * If the authProvider returns a rejected promise, returns false.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true }
 * - success: { permissions: [any], isPending: false }
 * - error: { error: [error from provider], isPending: false }
 *
 * Useful to enable features based on user role
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { isAccessible, error, isPending, refetch }.
 *
 * @example
 *     import { useCanAccess } from 'react-admin';
 *
 *     const PostDetail = () => {
 *         const { isPending, permissions } = useCanAccess({
 *             resource: 'posts',
 *             action: 'read',
 *         });
 *         if (!isPending && isAccessible) {
 *             return <PostEdit />
 *         } else {
 *             return null;
 *         }
 *     };
 */
const useCanAccess = <ErrorType = Error>(
    params: UseCanAccessOptions<ErrorType>
): UseCanAccessResult<ErrorType> => {
    const authProvider = useAuthProvider();
    const logoutIfAccessDenied = useLogoutIfAccessDenied();
    const { onSuccess, onError, onSettled, ...queryOptions } = params ?? {};

    const result = useQuery({
        queryKey: ['auth', 'canAccess', params],
        queryFn: async ({ signal }) => {
            if (!authProvider || !authProvider.canAccess) {
                return true;
            }
            const canAccess = await authProvider.canAccess({
                ...params,
                signal,
            });

            return canAccess;
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
        if (result.isError === false) {
            return;
        }
        onErrorEvent(result.error);
    }, [onErrorEvent, result.error, result.isError]);

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
            isAccessible: result.data,
        }),
        [result]
    );
};

export default useCanAccess;

export interface UseCanAccessOptions<ErrorType = Error>
    extends Omit<UseQueryOptions<boolean, ErrorType>, 'queryKey' | 'queryFn'> {
    resource: string;
    action: string;
    record?: unknown;
    onSuccess?: (data: boolean) => void;
    onError?: (err: ErrorType) => void;
    onSettled?: (data?: boolean, error?: ErrorType | null) => void;
}

export type UseCanAccessResult<ErrorType = Error> = QueryObserverResult<
    boolean,
    ErrorType
> & {
    isAccessible: boolean | undefined;
};

const noop = () => {};
