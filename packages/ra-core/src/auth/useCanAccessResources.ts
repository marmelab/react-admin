import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import { HintedString } from '../types';
import { useRecordContext } from '../controller';

/**
 * Checks whether users can access the provided resources.
 *
 * `useCanAccessResources` returns an object describing the state of the request:
 *
 * - start: { isPending: true }
 * - success: { canAccess: Object<string, boolean>, isPending: false }
 * - error: { error: [error from provider], isPending: false }
 *
 * @param {Object} params Any params you want to pass to the authProvider
 * @param {string} params.action The action to check access for
 * @param {string[]} params.resources The list of resources to check access for
 * @param {Object} params.record Optional. The record to check access for
 *
 * @returns Return the react-query result and a canAccess property which is a map of the resources and their access status { [resource: string]: boolean }
 *
 * @example
 * import { useCanAccessResources } from 'react-admin';
 *
 * const UserList = ({ record }) => {
 *     const { isPending, canAccess } = useCanAccessResources({
 *         action: 'read',
 *         resources: ['users.id', 'users.name', 'users.email'],
 *         record
 *     });
 *
 *     if (isPending) {
 *         return null;
 *     }
 *     return (
 *         <SimpleList
 *              primaryText={record => canAccess.users.name ? record.name : ''}
 *              secondaryText={record => canAccess.users.email ? record.email : ''}
 *              tertiaryText={record => canAccess.users.id ? record.id : ''}
 *          />
 *     );
 * };
 */
export const useCanAccessResources = <
    RecordType extends Record<string, any> = Record<string, any>,
    ErrorType extends Error = Error,
>(
    params: UseCanAccessResourcesOptions<RecordType>
): UseCanAccessResourcesResult<ErrorType> => {
    const authProvider = useAuthProvider();
    const record = useRecordContext<RecordType>(params);

    const { action, resources, ...options } = params;

    const queryResult = useQuery({
        queryKey: ['auth', 'canAccess', resources, action, record],
        queryFn: async ({ signal }) => {
            const queries = await Promise.all(
                resources.map(async resource => {
                    if (!authProvider || !authProvider.canAccess) {
                        return { canAccess: true, resource };
                    }
                    const canAccess = await authProvider.canAccess({
                        resource,
                        action,
                        record,
                        signal: authProvider.supportAbortSignal
                            ? signal
                            : undefined,
                    });

                    return { canAccess, resource };
                })
            );

            const result = queries.reduce(
                (acc, { resource, canAccess }) => {
                    acc[resource] = canAccess;
                    return acc;
                },
                {} as Record<string, boolean>
            );

            return result;
        },
        ...options,
    });

    const result = useMemo(() => {
        return {
            canAccess: queryResult.data,
            ...queryResult,
        } as UseCanAccessResourcesResult<ErrorType>;
    }, [queryResult]);

    const resultWithoutAuthProvider = useMemo(() => {
        return {
            canAccess: resources.reduce(
                (acc, resource) => {
                    acc[resource] = true;
                    return acc;
                },
                {} as Record<string, boolean>
            ),
            isPending: false,
            isError: false,
            error: null,
        } as UseCanAccessResourcesResult<ErrorType>;
    }, [resources]);

    return !authProvider || !authProvider.canAccess
        ? resultWithoutAuthProvider
        : result;
};

export interface UseCanAccessResourcesOptions<
    RecordType extends Record<string, any> = Record<string, any>,
    ErrorType extends Error = Error,
> extends Omit<
        UseQueryOptions<Record<string, boolean>, ErrorType>,
        'queryKey' | 'queryFn'
    > {
    resources: string[];
    action: HintedString<'list' | 'create' | 'edit' | 'show' | 'delete'>;
    record?: RecordType;
}

export type UseCanAccessResourcesResult<ErrorType = Error> =
    | UseCanAccessResourcesLoadingResult
    | UseCanAccessResourcesLoadingErrorResult<ErrorType>
    | UseCanAccessResourcesRefetchErrorResult<ErrorType>
    | UseCanAccessResourcesSuccessResult;

export interface UseCanAccessResourcesLoadingResult {
    canAccess: undefined;
    error: null;
    isPending: true;
}
export interface UseCanAccessResourcesLoadingErrorResult<ErrorType = Error> {
    canAccess: undefined;
    error: ErrorType;
    isPending: false;
}
export interface UseCanAccessResourcesRefetchErrorResult<ErrorType = Error> {
    canAccess: Record<string, boolean>;
    error: ErrorType;
    isPending: false;
}
export interface UseCanAccessResourcesSuccessResult {
    canAccess: Record<string, boolean>;
    error: null;
    isPending: false;
}
