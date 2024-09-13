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

const StateInspector = ({ state }: { state: UseCanAccessResourcesResult }) => {
    return (
        <div>
            <span>{state.isPending && 'LOADING'}</span>
            {state.canAccess !== undefined && (
                <span>{JSON.stringify(state.canAccess)}</span>
            )}
            <span>{state.error && 'ERROR'}</span>
        </div>
    );
};

const defaultAuthProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => Promise.reject('bad method'),
    checkAuth: () => Promise.reject('bad method'),
    checkError: () => Promise.reject('bad method'),
    getPermissions: () => Promise.reject('bad method'),
    canAccess: ({ action }) =>
        new Promise(resolve => setTimeout(resolve, 500, action === 'read')),
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
            {result => <StateInspector state={result} />}
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
            {result => <StateInspector state={result} />}
        </UseCanAccessResources>
    </CoreAdminContext>
);
