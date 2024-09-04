import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider, Exporter } from '../types';
import { CoreAdminContext, TestMemoryRouter } from '..';
import { useExporter } from './useExporter';

export default {
    title: 'ra-core/export/useExporter',
};

const AccessControlUI = ({
    children,
    setAuthorizedResources,
    authorizedResources,
    queryClient,
}: {
    children: React.ReactNode;
    setAuthorizedResources: Function;
    authorizedResources: {
        posts: boolean;
        'posts.id': boolean;
        'posts.title': boolean;
        'posts.author': boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources.posts}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                posts: !authorizedResources.posts,
                            }));
                            queryClient.clear();
                        }}
                    />
                    posts access
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.id']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.id': !authorizedResources['posts.id'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.id access
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.title']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.title':
                                    !authorizedResources['posts.title'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.title access
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.author']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.author':
                                    !authorizedResources['posts.author'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.author access
                </label>
            </div>
            <div>{children}</div>
        </div>
    );
};

export const AccessControl = ({
    customExporter,
    initialAuthorizedResources = {
        posts: true,
        'posts.id': false,
        'posts.title': true,
        'posts.author': true,
    },
}: {
    customExporter?: Exporter;
    initialAuthorizedResources?: {
        posts: boolean;
        'posts.id': boolean;
        'posts.title': boolean;
        'posts.author': boolean;
    };
}) => {
    const queryClient = new QueryClient();

    return (
        <TestMemoryRouter initialEntries={['/books']}>
            <AdminWithAccessControl
                customExporter={customExporter}
                queryClient={queryClient}
                initialAuthorizedResources={initialAuthorizedResources}
            />
        </TestMemoryRouter>
    );
};

export const AccessControlWithoutAuthProvider = ({
    customExporter,
}: {
    customExporter: Exporter;
}) => (
    <CoreAdminContext>
        <UseExporter
            customExporter={customExporter}
            records={[
                {
                    id: 1,
                    title: 'How to implement access control',
                },
                {
                    id: 2,
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ]}
            resource="posts"
        />
    </CoreAdminContext>
);

export const AccessControlWithoutAuthProviderCanAccess = ({
    customExporter,
}: {
    customExporter: Exporter;
}) => (
    <CoreAdminContext
        authProvider={{
            checkAuth: () => Promise.resolve(),
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.resolve(),
        }}
    >
        <UseExporter
            customExporter={customExporter}
            records={[
                {
                    id: 1,
                    title: 'How to implement access control',
                },
                {
                    id: 2,
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ]}
            resource="posts"
        />
    </CoreAdminContext>
);

const AdminWithAccessControl = ({
    customExporter,
    queryClient,
    initialAuthorizedResources,
}: {
    customExporter?: Exporter;
    queryClient: QueryClient;
    initialAuthorizedResources: {
        posts: boolean;
        'posts.id': boolean;
        'posts.title': boolean;
        'posts.author': boolean;
    };
}) => {
    const [authorizedResources, setAuthorizedResources] = React.useState(
        initialAuthorizedResources
    );

    const authProvider: AuthProvider = {
        canAccess: async ({ resource }) => {
            return new Promise(resolve =>
                setTimeout(resolve, 100, authorizedResources[resource])
            );
        },
        logout: () => Promise.reject(new Error('Not implemented')),
        checkError: () => Promise.reject(new Error('Not implemented')),
        checkAuth: () => Promise.resolve(),
        getPermissions: () => Promise.reject(new Error('Not implemented')),
        login: () => Promise.reject(new Error('Not implemented')),
    };
    return (
        <CoreAdminContext queryClient={queryClient} authProvider={authProvider}>
            <AccessControlUI
                authorizedResources={authorizedResources}
                setAuthorizedResources={setAuthorizedResources}
                queryClient={queryClient}
            >
                <UseExporter
                    customExporter={customExporter}
                    records={[
                        {
                            id: 1,
                            title: 'How to implement access control',
                        },
                        {
                            id: 2,
                            title: 'How to test access control',
                            author: 'John Doe',
                        },
                    ]}
                    resource="posts"
                />
            </AccessControlUI>
        </CoreAdminContext>
    );
};

const UseExporter = ({
    customExporter,
    records,
    resource,
}: {
    customExporter?: Exporter;
    records: Record<string, unknown>[];
    resource: string;
}) => {
    const [exportResult, setExportResult] = React.useState<any>(null);
    const finalExporter =
        customExporter ?? ((records: any[]) => setExportResult(records));
    const exporter = useExporter({ exporter: finalExporter });

    return (
        <>
            <button
                onClick={() => {
                    if (!exporter) {
                        return;
                    }
                    exporter(records, null, null, resource);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }}
            >
                Export
            </button>
            {exportResult && <pre>{JSON.stringify(exportResult, null, 2)}</pre>}
        </>
    );
};
