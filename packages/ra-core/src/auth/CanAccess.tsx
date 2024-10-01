import * as React from 'react';
import { useCanAccess, UseCanAccessOptions } from './useCanAccess';
import { RaRecord } from '../types';
import { Navigate } from 'react-router';

/**
 * A component that only displays its children after checking whether users are authorized to access the provided resource and action.
 * @param options
 * @param options.action The action to check. One of 'list', 'create', 'edit', 'show', 'delete', or a custom action.
 * @param options.resource The resource to check. e.g. 'posts', 'comments', 'users'
 * @param options.children The component to render if users are authorized.
 * @param options.loading An optional element to render while the authorization is being checked. Defaults to null.
 * @param options.accessDenied An optional element to render if users are denied access. Defaults to null.
 * @param options.error An optional element to render if an error occur while checking users access rights. Redirect users to `/authentication-error` by default.
 */
export const CanAccess = <
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord,
    ErrorType extends Error = Error,
>({
    children,
    loading = null,
    accessDenied = null,
    error: errorElement = DEFAULT_ERROR,
    ...props
}: CanAccessProps<RecordType, ErrorType>) => {
    const { canAccess, error, isPending } = useCanAccess(props);

    if (isPending) {
        return loading;
    }

    if (error) {
        return errorElement;
    }

    if (canAccess === false) {
        return accessDenied;
    }

    return children;
};

export interface CanAccessProps<
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord,
    ErrorType extends Error = Error,
> extends UseCanAccessOptions<RecordType, ErrorType> {
    children: React.ReactNode;
    loading?: React.ReactNode;
    accessDenied?: React.ReactNode;
    error?: React.ReactNode;
}

const DEFAULT_ERROR = <Navigate to="/authentication-error" />;
