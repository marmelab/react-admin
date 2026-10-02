import { useMemo } from 'react';
import {
    notifyManager,
    QueryClient,
    QueryKey,
    QueryObserverLoadingErrorResult,
    QueryObserverLoadingResult,
    QueryObserverRefetchErrorResult,
    QueryObserverSuccessResult,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import { useResourceContext } from '../core';
import { useRecordContext } from '../controller';
import { HintedString } from '../types';

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
export const useCanAccess = <
    RecordType extends Record<string, any> = Record<string, any>,
    ErrorType extends Error = Error,
>(
    params: UseCanAccessOptions<RecordType, ErrorType>
): UseCanAccessResult<ErrorType> => {
    const authProvider = useAuthProvider();
    const queryClient = useQueryClient();
    const resource = useResourceContext(params);

    if (!resource) {
        throw new Error(
            'useCanAccess must be used inside a <Resource> component or provide a resource prop'
        );
    }
    const record = useRecordContext<RecordType>(params);
    const { record: _record, ...restParams } = params;
    const authProviderHasCanAccess = !!authProvider?.canAccess;

    const queryResult = useQuery({
        queryKey: [
            'auth',
            'canAccess',
            { ...restParams, recordId: record?.id, resource },
        ],
        queryFn: async ({ queryKey, signal }) => {
            if (!authProvider || !authProvider.canAccess) {
                return true;
            }
            const canAccess = await authProvider.canAccess({
                ...params,
                record,
                resource,
                signal: authProvider.supportAbortSignal ? signal : undefined,
            });
            return resolveWithSettledChecks(
                queryClient,
                queryKey,
                signal,
                canAccess
            );
        },
        enabled: authProviderHasCanAccess,
        ...params,
    });

    const result = useMemo(() => {
        // Don't check for the authProvider or authProvider.canAccess method in the useMemo
        // to avoid unnecessary re-renders
        return {
            ...queryResult,
            canAccess: queryResult.data,
        } as UseCanAccessResult<ErrorType>;
    }, [queryResult]);

    return authProviderHasCanAccess
        ? result
        : (emptyQueryObserverResult as unknown as UseCanAccessResult<ErrorType>);
};

interface SettledCheck {
    queryClient: QueryClient;
    queryKey: QueryKey;
    signal: AbortSignal;
    canAccess: boolean;
    resolve: (canAccess: boolean) => void;
}

let settledChecks: SettledCheck[] = [];

/**
 * Resolve the access checks that settle together in a single React update.
 *
 * Each useCanAccess with a record (e.g. the link of every row of a Datagrid) owns a
 * distinct query. Resolving them one by one makes react-query flush one observer
 * notification per query, each in its own task, and React commits each of them
 * separately. React 19 counts those commits as nested updates while an update from
 * an earlier commit is still pending, and throws "Maximum update depth exceeded"
 * past 50 of them.
 *
 * Writing the result of every settled check inside a single notifyManager
 * transaction makes react-query flush all the observer notifications at once, so
 * all the consumers get their result in one commit, as resolveCallsWithData does in
 * useGetManyAggregate. The checks are then resolved to let their query leave the
 * fetching state.
 *
 * The batch is flushed in a microtask, so it adds no task: react-query already
 * delivers the notifications on its own setTimeout(0), and the checks of one
 * authProvider settle in the same round of microtasks.
 *
 * A check is written only while its own fetch is still running. react-query aborts
 * the signal of a fetch that is canceled or removed, and a refetch of the same query
 * runs with a new signal, so a stale result never lands in a newer fetch.
 */
const resolveWithSettledChecks = (
    queryClient: QueryClient,
    queryKey: QueryKey,
    signal: AbortSignal,
    canAccess: boolean
) =>
    new Promise<boolean>(resolve => {
        settledChecks.push({
            queryClient,
            queryKey,
            signal,
            canAccess,
            resolve,
        });
        if (settledChecks.length > 1) return;
        queueMicrotask(() => {
            const checks = settledChecks;
            settledChecks = [];
            notifyManager.batch(() => {
                checks.forEach(check => {
                    if (check.signal.aborted) return;
                    check.queryClient.setQueryData(
                        check.queryKey,
                        check.canAccess
                    );
                });
            });
            checks.forEach(check => check.resolve(check.canAccess));
        });
    });

const emptyQueryObserverResult = {
    canAccess: true,
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
    refetch: () => Promise.resolve(emptyQueryObserverResult),
};

export interface UseCanAccessOptions<
    RecordType extends Record<string, any> = Record<string, any>,
    ErrorType extends Error = Error,
> extends Omit<UseQueryOptions<boolean, ErrorType>, 'queryKey' | 'queryFn'> {
    resource?: string;
    action: HintedString<'list' | 'create' | 'edit' | 'show' | 'delete'>;
    record?: RecordType;
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
