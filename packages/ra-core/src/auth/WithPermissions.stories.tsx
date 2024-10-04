import * as React from 'react';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { TestMemoryRouter, WithPermissions } from '..';

export default {
    title: 'ra-core/auth/WithPermissions',
};

export const NoAuthProvider = () => (
    <TestMemoryRouter>
        <CoreAdminContext>
            <WithPermissions component={StateInspector} />
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const NoAuthProviderGetPermissions = ({
    loading = () => <p>Loading...</p>,
}: {
    loading: React.ComponentType;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext
            authProvider={{
                login: () => Promise.reject('bad method'),
                logout: () => Promise.reject('bad method'),
                checkAuth: () =>
                    new Promise(resolve => setTimeout(resolve, 300)),
                checkError: () => Promise.reject('bad method'),
            }}
        >
            <WithPermissions component={StateInspector} loading={loading} />
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const WithAuthProviderAndGetPermissions = ({
    loading = () => <p>Loading...</p>,
    authProvider = {
        login: () => Promise.reject('bad method'),
        logout: () => Promise.reject('bad method'),
        checkAuth: () => new Promise(resolve => setTimeout(resolve, 300)),
        checkError: () => Promise.reject('bad method'),
        getPermissions: () =>
            new Promise(resolve => setTimeout(resolve, 300, 'admin')),
    },
}: {
    loading: React.ComponentType;
    authProvider?: AuthProvider;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={authProvider}>
            <WithPermissions component={StateInspector} loading={loading} />
        </CoreAdminContext>
    </TestMemoryRouter>
);

const StateInspector = ({ permissions }: { permissions: any }) => (
    <div>
        {permissions === 'admin' ? (
            <p>Sensitive data</p>
        ) : (
            <p>Non sensitive data</p>
        )}
    </div>
);
