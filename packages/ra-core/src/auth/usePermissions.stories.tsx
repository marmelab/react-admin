import * as React from 'react';
import usePermissions, { UsePermissionsResult } from './usePermissions';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider, CoreAdminContext, TestMemoryRouter } from '..';

export default {
    title: 'ra-core/auth/usePermissions',
};

export const NoAuthProvider = () => (
    <TestMemoryRouter>
        <CoreAdminContext>
            <UsePermissions>{state => inspectState(state)}</UsePermissions>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const NoAuthProviderGetPermissions = () => (
    <TestMemoryRouter>
        <CoreAdminContext
            authProvider={{
                login: () => Promise.reject('bad method'),
                logout: () => Promise.reject('bad method'),
                checkAuth: () => Promise.reject('bad method'),
                checkError: () => Promise.reject('bad method'),
            }}
        >
            <UsePermissions>{state => inspectState(state)}</UsePermissions>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const WithAuthProviderAndGetPermissions = ({
    authProvider = {
        login: () => Promise.reject('bad method'),
        logout: () => Promise.reject('bad method'),
        checkAuth: () => Promise.reject('bad method'),
        checkError: () => Promise.reject('bad method'),
        getPermissions: () =>
            new Promise(resolve => setTimeout(resolve, 300, 'admin')),
    },
    queryClient,
}: {
    authProvider?: AuthProvider;
    queryClient?: QueryClient;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={authProvider} queryClient={queryClient}>
            <UsePermissions>{state => inspectState(state)}</UsePermissions>
        </CoreAdminContext>
    </TestMemoryRouter>
);

const UsePermissions = ({
    children,
}: {
    children: (state: UsePermissionsResult<any, Error>) => React.ReactNode;
}) => {
    const permissionQueryParams = {
        retry: false,
    };
    const res = usePermissions({}, permissionQueryParams);
    return children(res);
};

const inspectState = (state: UsePermissionsResult<any, Error>) => (
    <div>
        {state.isPending ? <span>LOADING</span> : null}
        {state.permissions ? (
            <span>PERMISSIONS: {state.permissions}</span>
        ) : null}
        {state.error ? <span>ERROR</span> : null}
    </div>
);
