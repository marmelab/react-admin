import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
    AuthProvider,
    CoreAdminContext,
    DataProvider,
    DataProviderContext,
    RecordContextProvider,
    ResourceContextProvider,
    TestMemoryRouter,
} from 'ra-core';

import { ReferenceManyCount } from './ReferenceManyCount';

export default {
    title: 'ra-ui-materialui/fields/ReferenceManyCount',
    excludeStories: ['Wrapper'],
};

const post = {
    id: 1,
    title: 'Lorem Ipsum',
};
const comments = [
    { id: 1, post_id: 1, is_published: true },
    { id: 2, post_id: 1, is_published: true },
    { id: 3, post_id: 1, is_published: false },
    { id: 4, post_id: 2, is_published: true },
    { id: 5, post_id: 2, is_published: false },
];

export const Wrapper = ({
    queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    }),
    authProvider,
    dataProvider,
    children,
}: {
    queryClient?: QueryClient;
    authProvider?: AuthProvider;
    dataProvider: DataProvider;
    children: React.ReactNode;
}) => (
    <TestMemoryRouter>
        <CoreAdminContext
            queryClient={queryClient}
            authProvider={authProvider}
            dataProvider={dataProvider}
        >
            <ResourceContextProvider value="posts">
                <RecordContextProvider value={post}>
                    {children}
                </RecordContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const LoadingState = () => (
    <Wrapper dataProvider={{ getManyReference: () => new Promise(() => {}) }}>
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const ErrorState = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () => Promise.reject(new Error('problem')),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const WithFilter = () => (
    <Wrapper
        dataProvider={{
            getManyReference: (resource, params) =>
                Promise.resolve({
                    data: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ),
                    total: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ).length,
                }),
        }}
    >
        <ReferenceManyCount
            reference="comments"
            target="post_id"
            filter={{ is_published: true }}
        />
    </Wrapper>
);

export const Link = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" link />
    </Wrapper>
);

export const LinkWithFilter = () => (
    <Wrapper
        dataProvider={{
            getManyReference: (resource, params) =>
                Promise.resolve({
                    data: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ),
                    total: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ).length,
                }),
        }}
    >
        <ReferenceManyCount
            reference="comments"
            target="post_id"
            filter={{ is_published: true }}
            link
        />
    </Wrapper>
);

export const WithCustomVariant = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
    >
        <ReferenceManyCount
            reference="comments"
            target="post_id"
            variant="h1"
        />
    </Wrapper>
);

export const Slow = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve({
                                data: [
                                    comments.filter(c => c.post_id === 1)[0],
                                ],
                                total: comments.filter(c => c.post_id === 1)
                                    .length,
                            }),
                        2000
                    )
                ),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const AccessControl = ({
    initialAuthorizedResources = {
        comments: true,
    },
}: {
    initialAuthorizedResources?: {
        comments: boolean;
    };
}) => {
    const queryClient = new QueryClient();
    return (
        <AdminWithAccessControl
            initialAuthorizedResources={initialAuthorizedResources}
            queryClient={queryClient}
        />
    );
};

const AdminWithAccessControl = ({
    initialAuthorizedResources,
    queryClient,
}: {
    initialAuthorizedResources: { comments: boolean };
    queryClient: QueryClient;
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
        checkError: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
        login: () => Promise.reject(new Error('Not implemented')),
    };

    return (
        <Wrapper
            queryClient={queryClient}
            authProvider={authProvider}
            dataProvider={{
                getManyReference: () =>
                    Promise.resolve({
                        data: [comments.filter(c => c.post_id === 1)[0]],
                        total: comments.filter(c => c.post_id === 1).length,
                    }),
            }}
        >
            <AccessControlUI
                authorizedResources={authorizedResources}
                setAuthorizedResources={setAuthorizedResources}
                queryClient={queryClient}
            >
                <ReferenceManyCount reference="comments" target="post_id" />
            </AccessControlUI>
        </Wrapper>
    );
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
        comments: boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['comments']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                comments: !authorizedResources['comments'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    comments access
                </label>
            </div>
            <div>{children}</div>
        </div>
    );
};
