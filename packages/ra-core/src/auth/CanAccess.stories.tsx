import * as React from 'react';
import { Location } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core/CoreAdminContext';
import { CanAccess } from './CanAccess';
import { TestMemoryRouter } from '../routing/TestMemoryRouter';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

const data = Array.from({ length: 1000 }, (_, i) => {
    const post = {
        id: i + 1,
        title: `Post ${i + 1}`,
        body: `This is the body of post ${i + 1}`,
    };

    Array.from({ length: 100 }, (_, i) => {
        post[`property${i + 1}`] = `Another very long property ${i + 1}`;
    });

    return post;
});

export const ManyCalls = ({
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
            <div>
                {data.map(post => (
                    <CanAccess
                        key={post.id}
                        action="read"
                        resource="posts"
                        record={post}
                    >
                        <div>{post.title}</div>
                    </CanAccess>
                ))}
                <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="bottom-right"
                />
            </div>
        </CoreAdminContext>
    </TestMemoryRouter>
);
