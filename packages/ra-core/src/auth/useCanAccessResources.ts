import { useEffect, useMemo } from 'react';
import {
    useQueries,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import { useEvent } from '../util';

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
 *              primaryText={record => canAccess.name ? record.name : ''}
 *              secondaryText={record => canAccess.email ? record.email : ''}
 *              tertiaryText={record => canAccess.id ? record.id : ''}
 *          />
 *     );
 * };
 */
export const useCanAccessResources = <ErrorType extends Error = Error>(
    params: UseCanAccessResourcesOptions<ErrorType>
): UseCanAccessResourcesResult<ErrorType> => {
    const authProvider = useAuthProvider();

    const { action, resources, record } = params;

    const logoutIfAccessDenied = useLogoutIfAccessDenied();

    const result = useQueries({
        queries: resources.map(resource => {
            return {
                queryKey: ['auth', 'canAccess', resource, action, record],
                queryFn: async ({ signal }) => {
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
                },
            };
        }),
        combine: combineSourceAccessResults<ErrorType>,
    });

    const onErrorEvent = useEvent((error: ErrorType) => {
        if (process.env.NODE_ENV === 'development') {
            console.error(error);
        }
        logoutIfAccessDenied(error);
    });

    useEffect(() => {
        if (result.isError === false) {
            return;
        }
        onErrorEvent(result.error as ErrorType);
    }, [onErrorEvent, result.error, result.isError]);

    return useMemo(() => {
        return {
            canAccess: result.data,
            ...result,
        } as UseCanAccessResourcesResult<ErrorType>;
    }, [result]);
};

export interface UseCanAccessResourcesOptions<ErrorType = Error>
    extends Omit<UseQueryOptions<boolean, ErrorType>, 'queryKey' | 'queryFn'> {
    resources: string[];
    action: string;
    record?: unknown;
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

const combineSourceAccessResults = <ErrorType>(
    results: UseQueryResult<
        {
            canAccess: boolean;
            resource: string;
        },
        ErrorType
    >[]
): {
    data?: Record<string, boolean>;
    isPending: boolean;
    isError: boolean;
    error?: ErrorType;
} => {
    return {
        data: results
            ? results.reduce(
                  (acc, { data }) => {
                      if (!data) {
                          return acc;
                      }
                      const { resource, canAccess } = data;
                      return {
                          ...acc,
                          [resource]: canAccess,
                      };
                  },
                  {} as Record<string, boolean>
              )
            : undefined,
        isPending: results.some(result => result.isPending),
        isError: results.some(result => result.isError),
        error: results.find(result => result.error)?.error || undefined,
    };
};
