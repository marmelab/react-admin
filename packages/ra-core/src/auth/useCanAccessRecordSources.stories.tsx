import * as React from 'react';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { QueryClient } from '@tanstack/react-query';
import { useCanAccessRecordSources } from './useCanAccessRecordSources';

export default {
    title: 'ra-core/auth/useCanAccessRecordSources',
};

const UseCanAccessRecordSources = ({
    children,
    action,
    resource,
    sources,
}: {
    children: any;
    action: string;
    resource: string;
    sources: string[];
}) => {
    const { canAccess, isPending } = useCanAccessRecordSources({
        action,
        resource,
        sources,
    });

    return children({ canAccess, isPending });
};

const StateInpector = result => {
    return <div>{JSON.stringify(result)}</div>;
};

const defaultAuthProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => Promise.reject('bad method'),
    checkAuth: () => Promise.reject('bad method'),
    checkError: () => Promise.reject('bad method'),
    getPermissions: () => Promise.reject('bad method'),
    canAccess: ({ action }) => Promise.resolve(action === 'read'),
};

export const Basic = ({
    authProvider = defaultAuthProvider,
    queryClient,
}: {
    authProvider?: AuthProvider | null;
    queryClient?: QueryClient;
}) => (
    <CoreAdminContext
        authProvider={authProvider != null ? authProvider : undefined}
        queryClient={queryClient}
    >
        <UseCanAccessRecordSources
            action="read"
            resource="posts"
            sources={['id', 'title', 'author']}
        >
            {StateInpector}
        </UseCanAccessRecordSources>
    </CoreAdminContext>
);
