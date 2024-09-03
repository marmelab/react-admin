import {
    useQueries,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import { useEvent } from '../util';
import { useEffect } from 'react';
import { useResourceContext } from '../core';

export const combine = <ErrorType>(
    results: UseQueryResult<
        {
            canAccess: boolean;
            source: string;
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
                      const { source, canAccess } = data;
                      return {
                          ...acc,
                          [source]: canAccess,
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

/**
 * Checks if the user can access a resource keys.
 *
 * `useCanAccessRecordSources` returns an object describing the state of the RBAC request.
 * As calls to the `authProvider` are asynchronous, the hook returns
 * a `loading` state in addition to the `canAccess` key.
 *
 * @example
 * import { useCanAccessRecordSources } from 'react-admin';
 *
 * const DeleteUserButton = ({ record }) => {
 *     const { isPending, canAccess } = useCanAccessRecordSources([{ action: 'delete', resource: 'users', record, sources: ['id', 'name', 'email'] }]);
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
export const useCanAccessRecordSources = <ErrorType extends Error = Error>(
    params: UseCanAccessRecordSourcesOptions<ErrorType>
): UseCanAccessRecordSourcesResult<ErrorType> => {
    const authProvider = useAuthProvider();

    const { action, sources, record } = params;
    const resource = useResourceContext(params);
    if (!resource) {
        throw new Error(
            `useCanAccessRecordSources was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
        );
    }

    const logoutIfAccessDenied = useLogoutIfAccessDenied();

    const result = useQueries({
        queries: sources.map(source => {
            const resourceKey = `${params.resource}.${source}`;
            return {
                queryKey: [
                    'auth',
                    'canAccess',
                    JSON.stringify({
                        resource: resourceKey,
                        action,
                        record,
                    }),
                ],
                queryFn: async ({ signal }) => {
                    if (!authProvider || !authProvider.canAccess) {
                        return { canAccess: true, source };
                    }
                    const canAccess = await authProvider.canAccess({
                        resource: resourceKey,
                        action,
                        record,
                        signal,
                    });

                    return { canAccess, source };
                },
            };
        }),
        combine: combine<ErrorType>,
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

    return {
        canAccess: result.data,
        ...result,
    } as UseCanAccessRecordSourcesResult<ErrorType>;
};

export interface UseCanAccessRecordSourcesOptions<ErrorType = Error>
    extends Omit<UseQueryOptions<boolean, ErrorType>, 'queryKey' | 'queryFn'> {
    resource?: string;
    action: string;
    record?: unknown;
    sources: string[];
}

export type UseCanAccessRecordSourcesResult<ErrorType = Error> = UseQueryResult<
    Record<string, boolean>,
    ErrorType
> & {
    canAccess?: Record<string, boolean>;
};
