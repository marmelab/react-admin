import * as React from 'react';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { useCanAccess, UseCanAccessResult } from './useCanAccess';
import { QueryClient } from '@tanstack/react-query';
import { TestMemoryRouter } from '..';
import { Route, Routes } from 'react-router';

export default {
    title: 'ra-core/auth/useCanAccess',
};

const UseCanAccess = ({
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
    const res = useCanAccess({
        action,
        resource,
        record,
        retry: false,
    });

    return children(res);
};

const StateInspector = ({ state }: { state: UseCanAccessResult }) => {
    const renderCounter = React.useRef(0);
    renderCounter.current++;
    return (
        <>
            <div>
                <span>{state.isPending && 'LOADING'}</span>
                {state.canAccess !== undefined && (
                    <span>canAccess: {state.canAccess ? 'YES' : 'NO'}</span>
                )}
                {state.error ? <span>{state.error.message}</span> : null}
            </div>
            <div>
                <span>Renders: {renderCounter.current}</span>
            </div>
        </>
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
    <TestMemoryRouter>
        <CoreAdminContext
            authProvider={authProvider != null ? authProvider : undefined}
            queryClient={queryClient}
        >
            <Routes>
                <Route
                    path="/"
                    element={
                        <UseCanAccess action="read" resource="test">
                            {state => <StateInspector state={state} />}
                        </UseCanAccess>
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
                        <UseCanAccess action="read" resource="test">
                            {state => <StateInspector state={state} />}
                        </UseCanAccess>
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
