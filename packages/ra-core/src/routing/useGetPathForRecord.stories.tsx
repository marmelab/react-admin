import * as React from 'react';
import { useGetPathForRecord } from './useGetPathForRecord';
import { Link } from 'react-router-dom';
import {
    AuthProvider,
    CoreAdminContext,
    RecordContextProvider,
    ResourceContextProvider,
    ResourceDefinitionContextProvider,
    TestMemoryRouter,
} from '..';
import { QueryClient } from '@tanstack/react-query';

export default {
    title: 'ra-core/routing/useGetPathForRecord',
};

const EditLink = () => {
    const path = useGetPathForRecord({ link: 'edit' });
    return path ? <Link to={path}>Edit</Link> : <span>Edit no link</span>;
};

const ShowLink = () => {
    const path = useGetPathForRecord({ link: 'show' });
    return path ? <Link to={path}>Show</Link> : <span>Show no link</span>;
};

const InferredLink = () => {
    const path = useGetPathForRecord();
    return path ? <Link to={path}>Link</Link> : <span>No link</span>;
};

export const NoAuthProvider = () => (
    <TestMemoryRouter>
        <CoreAdminContext>
            <ResourceContextProvider value="posts">
                <RecordContextProvider value={{ id: 123 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                        <EditLink />
                        <ShowLink />
                    </div>
                </RecordContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const InferredEditLink = () => (
    <TestMemoryRouter>
        <CoreAdminContext>
            <ResourceContextProvider value="posts">
                <ResourceDefinitionContextProvider
                    definitions={{
                        posts: { name: 'posts', hasEdit: true, hasShow: false },
                    }}
                >
                    <RecordContextProvider value={{ id: 123 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                            <InferredLink />
                        </div>
                    </RecordContextProvider>
                </ResourceDefinitionContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const InferredShowLink = () => (
    <TestMemoryRouter>
        <CoreAdminContext>
            <ResourceContextProvider value="posts">
                <ResourceDefinitionContextProvider
                    definitions={{
                        posts: { name: 'posts', hasEdit: false, hasShow: true },
                    }}
                >
                    <RecordContextProvider value={{ id: 123 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                            <InferredLink />
                        </div>
                    </RecordContextProvider>
                </ResourceDefinitionContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const SlowLoading = () => {
    const [record, setRecord] = React.useState<any>(undefined);
    const handleClick = () => {
        setRecord({ id: 123 });
    };
    return (
        <TestMemoryRouter>
            <CoreAdminContext>
                <ResourceContextProvider value="posts">
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: {
                                name: 'posts',
                                hasEdit: true,
                                hasShow: false,
                            },
                        }}
                    >
                        <RecordContextProvider value={record}>
                            <div style={{ display: 'flex', gap: 2 }}>
                                <ShowLink />
                            </div>
                            <button onClick={handleClick}>Load record</button>
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </ResourceContextProvider>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const AccessControlWithLinkTypeProvided = ({
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
        canAccess: ({ action }) =>
            new Promise(resolve => setTimeout(resolve, 300, action === 'edit')),
    },
}: {
    authProvider?: AuthProvider;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext
            queryClient={new QueryClient()}
            authProvider={authProvider}
        >
            <ResourceContextProvider value="posts">
                <RecordContextProvider value={{ id: 123 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                        <EditLink />
                        <ShowLink />
                    </div>
                </RecordContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const InferredEditLinkWithAccessControl = () => (
    <TestMemoryRouter>
        <CoreAdminContext
            queryClient={new QueryClient()}
            authProvider={{
                login: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                checkAuth: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                getPermissions: () => Promise.resolve(),
                canAccess: ({ action }) =>
                    new Promise(resolve =>
                        setTimeout(resolve, 300, action === 'edit')
                    ),
            }}
        >
            <ResourceContextProvider value="posts">
                <ResourceDefinitionContextProvider
                    definitions={{
                        posts: { name: 'posts', hasEdit: true, hasShow: false },
                    }}
                >
                    <RecordContextProvider value={{ id: 123 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                            <InferredLink />
                        </div>
                    </RecordContextProvider>
                </ResourceDefinitionContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const InferredShowLinkWithAccessControl = () => (
    <TestMemoryRouter>
        <CoreAdminContext
            queryClient={new QueryClient()}
            authProvider={{
                login: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                checkAuth: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                getPermissions: () => Promise.resolve(),
                canAccess: ({ action }) =>
                    new Promise(resolve =>
                        setTimeout(resolve, 300, action === 'show')
                    ),
            }}
        >
            <ResourceContextProvider value="posts">
                <ResourceDefinitionContextProvider
                    definitions={{
                        posts: { name: 'posts', hasEdit: false, hasShow: true },
                    }}
                >
                    <RecordContextProvider value={{ id: 123 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                            <InferredLink />
                        </div>
                    </RecordContextProvider>
                </ResourceDefinitionContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);
