import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import { useEvent } from '../util';
import { useEffect, useMemo } from 'react';

const combine = results => {
    return {
        data: results.data
            ? results.data.reduce((acc, { canAccess, source }) => ({
                  ...acc,
                  [source]: canAccess,
              }))
            : undefined,
        isPending: results.some(result => result.isPending),
        isError: results.some(result => result.isError),
        error: results.find(result => result.error)?.error,
    };
};

/**
 * Checks if the user can access a resource.
 *
 * `useCanAccessForRecord` returns an object describing the state of the RBAC request.
 * As calls to the `authProvider` are asynchronous, the hook returns
 * a `loading` state in addition to the `canAccess` key.
 *
 * @example
 * import { useCanAccessForRecord } from '@react-admin/ra-rbac';
 *
 * const DeleteUserButton = ({ record }) => {
 *     const { isPending, canAccess } = useCanAccessForRecord([{ action: 'delete', resource: 'users', record, source: ['id', 'name', 'email'] }]);
 *
 *     if (isPending) {
 *         return null;
 *     }
 *     return (
 *         <DataGrid>
 *             {canAccess.id && <TextField source="id" />}
 *             {canAccess.name && <TextField source="name" />}
 *             {canAccess.email && <TextField source="email" />}
 *         </Datagrid>
 *     );
 * };
 */
const useCanAccessForRecord = <ErrorType = Error>(
    params: useCanAccessForRecordOptions<ErrorType>
): useCanAccessForRecordResult<ErrorType> => {
    const authProvider = useAuthProvider();
    const { action, sources, record } = params;
    const logoutIfAccessDenied = useLogoutIfAccessDenied();

    const result = useQueries({
        queries: sources.map(source => {
            const resource = `${params.resource}.${source}`;
            return {
                queryKey: [
                    'auth',
                    'canAccess',
                    {
                        resource,
                        action,
                        record,
                    },
                ],
                queryFn: async ({ signal }) => {
                    if (!authProvider || !authProvider.canAccess) {
                        return true;
                    }
                    const canAccess = await authProvider.canAccess({
                        resource,
                        action,
                        record,
                        signal,
                    });

                    return { canAccess, source };
                },
            };
        }),
        combine,
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
        onErrorEvent(result.error);
    }, [onErrorEvent, result.error, result.isError]);

    return useMemo(
        () => ({
            canAccess: result.data,
            isPending: result.isPending,
            isError: result.isError,
            error: result.error,
        }),
        [result]
    );
};

export default useCanAccessForRecord;

export interface useCanAccessForRecordOptions<ErrorType = Error>
    extends Omit<UseQueryOptions<boolean, ErrorType>, 'queryKey' | 'queryFn'> {
    resource: string;
    action: string;
    record?: unknown;
    sources: string[];
}

export type useCanAccessForRecordResult<ErrorType = Error> = {
    canAccess: Record<string, boolean>;
    isPending: boolean;
    isError: boolean;
    error: ErrorType;
};
