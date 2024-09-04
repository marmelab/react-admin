import * as React from 'react';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { QueryClient } from '@tanstack/react-query';
import {
    useCanAccessResources,
    UseCanAccessResourcesResult,
} from './useCanAccessResources';

export default {
    title: 'ra-core/auth/useCanAccessResources',
};

const UseCanAccessResources = ({
    children,
    action,
    resources,
}: {
    children: any;
    action: string;
    resources: string[];
}) => {
    const { canAccess, isPending } = useCanAccessResources({
        action,
        resources,
    });

    return children({ canAccess, isPending });
};

const StateInspector = ({
    result,
}: {
    result: UseCanAccessResourcesResult;
}) => {
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
        <UseCanAccessResources
            action="read"
            resources={['posts.id', 'posts.title', 'posts.author']}
        >
            {result => <StateInspector result={result} />}
        </UseCanAccessResources>
    </CoreAdminContext>
);

export const NoAuthProvider = ({
    queryClient,
}: {
    queryClient?: QueryClient;
}) => (
    <CoreAdminContext queryClient={queryClient}>
        <UseCanAccessResources
            action="read"
            resources={['posts.id', 'posts.title', 'posts.author']}
        >
            {result => <StateInspector result={result} />}
        </UseCanAccessResources>
    </CoreAdminContext>
);
