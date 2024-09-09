import { useEffect, useMemo } from 'react';
import {
    QueryObserverLoadingResult,
    QueryObserverRefetchErrorResult,
    QueryObserverSuccessResult,
    useQuery,
    UseQueryOptions,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import { useEvent } from '../util';

/**
 * A hook that calls the authProvider.canAccess() method using react-query for a provided resource and action (and optionally a record).
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true }
 * - success: { canAccess: true | false, isPending: false }
 * - error: { error: [error from provider], isPending: false }
 *
 * Useful to enable or disable features based on users permissions.
 *
 * @param {Object} params Any params you want to pass to the authProvider
 * @param {string} params.resource The resource to check access for
 * @param {string} params.action The action to check access for
 * @param {Object} params.record Optional. The record to check access for
 *
 * @returns Return the react-query result and a canAccess property which is a boolean indicating the access status
 *
 * @example
 *     import { useCanAccess } from 'react-admin';
 *
 *     const PostDetail = () => {
 *         const { isPending, canAccess } = useCanAccess({
 *             resource: 'posts',
 *             action: 'read',
 *         });
 *         if (isPending || !canAccess) {
 *             return null;
 *         }
 *         return <PostEdit />;
 *     };
 */
export const useCanAccess = <ErrorType = Error>(
    params: UseCanAccessOptions<ErrorType>
): UseCanAccessResult<ErrorType> => {
    const authProvider = useAuthProvider();
    const logoutIfAccessDenied = useLogoutIfAccessDenied();
    const { onSuccess, onError, onSettled, ...queryOptions } = params ?? {};

    const result = useQuery({
        queryKey: ['auth', 'canAccess', JSON.stringify(params)],
        queryFn: async ({ signal }) => {
            if (!authProvider || !authProvider.canAccess) {
                return true;
            }
            return authProvider.canAccess({
                ...params,
                signal,
            });
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

    return useMemo(() => {
        return {
            ...result,
            canAccess: result.data,
        } as UseCanAccessResult<ErrorType>;
    }, [result]);
};

export interface UseCanAccessOptions<ErrorType = Error>
    extends Omit<UseQueryOptions<boolean, ErrorType>, 'queryKey' | 'queryFn'> {
    resource: string;
    action: string;
    record?: unknown;
    onSuccess?: (data: boolean) => void;
    onError?: (err: ErrorType) => void;
    onSettled?: (data?: boolean, error?: ErrorType | null) => void;
}

export type UseCanAccessResult<ErrorType = Error> =
    | UseCanAccessLoadingResult<ErrorType>
    | UseCanAccessRefetchErrorResult<ErrorType>
    | UseCanAccessSuccessResult<ErrorType>;

export interface UseCanAccessLoadingResult<ErrorType = Error>
    extends QueryObserverLoadingResult<boolean, ErrorType> {
    canAccess: undefined;
}
export interface UseCanAccessRefetchErrorResult<ErrorType = Error>
    extends QueryObserverRefetchErrorResult<boolean, ErrorType> {
    canAccess: undefined;
}
export interface UseCanAccessSuccessResult<ErrorType = Error>
    extends QueryObserverSuccessResult<boolean, ErrorType> {
    canAccess: boolean;
}

const noop = () => {};
