import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Route, Routes } from 'react-router';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { useRequireAccess, UseRequireAccessResult } from './useRequireAccess';
import { TestMemoryRouter } from '..';

export default {
    title: 'ra-core/auth/useRequireAccess',
};

const UseRequireAccess = ({
    children,
    action,
    resource,
    record,
}: {
    children: any;
    action: string;
    resource: string;
    record?: any;
}) => {
    const res = useRequireAccess({
        action,
        resource,
        record,
        retry: false,
    });

    return children(res);
};

const StateInspector = ({ state }: { state: UseRequireAccessResult }) => (
    <div>
        <span>{state.isPending ? 'Loading' : 'Protected Content'}</span>
        <span>{state.error ? 'Error' : null}</span>
    </div>
);

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
    <TestMemoryRouter>
        <CoreAdminContext
            authProvider={authProvider != null ? authProvider : undefined}
            queryClient={queryClient}
        >
            <Routes>
                <Route
                    path="/"
                    element={
                        <UseRequireAccess action="read" resource="test">
                            {state => <StateInspector state={state} />}
                        </UseRequireAccess>
                    }
                />
                <Route
                    path="/access-denied"
                    element={<div>Access denied</div>}
                />
                <Route
                    path="/authentication-error"
                    element={<div>Authentication Error</div>}
                />
            </Routes>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const NoAuthProvider = ({
    queryClient,
}: {
    queryClient?: QueryClient;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={undefined} queryClient={queryClient}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <UseRequireAccess action="read" resource="test">
                            {state => <StateInspector state={state} />}
                        </UseRequireAccess>
                    }
                />
                <Route
                    path="/access-denied"
                    element={<div>Access denied</div>}
                />
                <Route
                    path="/authentication-error"
                    element={<div>Authentication Error</div>}
                />
            </Routes>
        </CoreAdminContext>
    </TestMemoryRouter>
);
