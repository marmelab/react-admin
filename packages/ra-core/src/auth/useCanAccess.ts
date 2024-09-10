import { useMemo } from 'react';
import {
    QueryObserverLoadingErrorResult,
    QueryObserverLoadingResult,
    QueryObserverRefetchErrorResult,
    QueryObserverSuccessResult,
    useQuery,
    UseQueryOptions,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';

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
 *         const { isPending, canAccess, error } = useCanAccess({
 *             resource: 'posts',
 *             action: 'read',
 *         });
 *         if (isPending || !canAccess) {
 *             return null;
 *         }
 *         if (error) {
 *             return <div>{error.message}</div>;
 *         }
 *         return <PostEdit />;
 *     };
 */
export const useCanAccess = <ErrorType = Error>(
    params: UseCanAccessOptions<ErrorType>
): UseCanAccessResult<ErrorType> => {
    const authProvider = useAuthProvider();

    const result = useQuery({
        queryKey: ['auth', 'canAccess', JSON.stringify(params)],
        queryFn: async ({ signal }) => {
            if (!authProvider || !authProvider.canAccess) {
                return true;
            }
            return authProvider.canAccess({
                ...params,
                signal: authProvider.supportAbortSignal ? signal : undefined,
            });
        },
        ...params,
    });

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
}

export type UseCanAccessResult<ErrorType = Error> =
    | UseCanAccessLoadingResult<ErrorType>
    | UseCanAccessLoadingErrorResult<ErrorType>
    | UseCanAccessRefetchErrorResult<ErrorType>
    | UseCanAccessSuccessResult<ErrorType>;

export interface UseCanAccessLoadingResult<ErrorType = Error>
    extends QueryObserverLoadingResult<boolean, ErrorType> {
    canAccess: undefined;
}
export interface UseCanAccessLoadingErrorResult<ErrorType = Error>
    extends QueryObserverLoadingErrorResult<boolean, ErrorType> {
    canAccess: undefined;
}
export interface UseCanAccessRefetchErrorResult<ErrorType = Error>
    extends QueryObserverRefetchErrorResult<boolean, ErrorType> {
    canAccess: boolean;
}
export interface UseCanAccessSuccessResult<ErrorType = Error>
    extends QueryObserverSuccessResult<boolean, ErrorType> {
    canAccess: boolean;
}
