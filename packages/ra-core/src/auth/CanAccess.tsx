import * as React from 'react';
import { useLoadingContext } from '../core/useLoadingContext';
import { useUnauthorizedContext } from '../core/useUnauthorizedContext';
import { useCanAccess, UseCanAccessOptions } from './useCanAccess';
import { RaRecord } from '../types';

/**
 * A component that only displays its children after checking whether users are authorized to access the provided resource and action.
 * @param options
 * @param options.action The action to check. One of 'list', 'create', 'edit', 'show', 'delete', or a custom action.
 * @param options.resource The resource to check. e.g. 'posts', 'comments', 'users'
 * @param options.children The component to render if users are authorized.
 * @param options.loading An optional element to render while the authorization is being checked. Defaults to the loading component provided on `Admin`.
 * @param options.unauthorized An optional element to render if users are not authorized. Defaults to the unauthorized component provided on `Admin`.
 */
export const CanAccess = <
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord,
    ErrorType extends Error = Error,
>({
    action,
    children,
    loading,
    unauthorized,
    record,
    resource,
}: CanAccessProps<RecordType, ErrorType>) => {
    const { canAccess, isPending } = useCanAccess({
        action,
        record,
        resource,
    });

    const Loading = useLoadingContext();
    const Unauthorized = useUnauthorizedContext();

    return isPending
        ? loading ?? <Loading />
        : canAccess === false
          ? unauthorized ?? <Unauthorized />
          : children;
};

export interface CanAccessProps<
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord,
    ErrorType extends Error = Error,
> extends UseCanAccessOptions<RecordType, ErrorType> {
    children: React.ReactNode;
    loading?: React.ReactElement;
    unauthorized?: React.ReactElement;
}
