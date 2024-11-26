import * as React from 'react';
import { Location } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { CanAccess } from './CanAccess';
import { TestMemoryRouter } from '..';

export default {
    title: 'ra-core/auth/CanAccess',
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
    basename,
    locationCallback,
}: {
    authProvider?: AuthProvider;
    basename?: string;
    locationCallback?: (location: Location) => void;
}) => (
    <TestMemoryRouter locationCallback={locationCallback}>
        <CoreAdminContext
            authProvider={authProvider}
            basename={basename}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <CanAccess action="read" resource="test">
                protected content
            </CanAccess>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const AccessDenied = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={authProvider}>
            <CanAccess action="show" resource="test">
                protected content
            </CanAccess>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const CustomLoading = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={authProvider}>
            <CanAccess
                action="read"
                resource="test"
                loading={<div>Please wait...</div>}
            >
                protected content
            </CanAccess>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const CustomAccessDenied = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={authProvider}>
            <CanAccess
                action="show"
                resource="test"
                accessDenied={<div>Not allowed</div>}
            >
                protected content
            </CanAccess>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const NoAuthProvider = () => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={undefined}>
            <CanAccess action="read" resource="test">
                protected content
            </CanAccess>
        </CoreAdminContext>
    </TestMemoryRouter>
);
