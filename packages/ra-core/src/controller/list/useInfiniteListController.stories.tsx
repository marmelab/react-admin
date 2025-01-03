import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';
import { QueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CoreAdmin, CoreAdminContext, CoreAdminUI, Resource } from '../../core';
import { AuthProvider, DataProvider } from '../../types';
import { useInfiniteListController } from './useInfiniteListController';
import { Browser } from '../../storybook/FakeBrowser';
import { TestMemoryRouter } from '../../routing';

export default {
    title: 'ra-core/controller/list/useInfiniteListController',
    excludeStories: ['defaultDataProvider'],
};

const styles = {
    mainContainer: {
        margin: '20px 10px',
    },

    ul: {
        marginTop: '20px',
        padding: '10px',
    },
};

export const defaultDataProvider = fakeDataProvider(
    {
        posts: [
            { id: 1, title: 'Post #1', votes: 90 },
            { id: 2, title: 'Post #2', votes: 20 },
            { id: 3, title: 'Post #3', votes: 30 },
            { id: 4, title: 'Post #4', votes: 40 },
            { id: 5, title: 'Post #5', votes: 50 },
            { id: 6, title: 'Post #6', votes: 60 },
            { id: 7, title: 'Post #7', votes: 70 },
        ],
    },
    process.env.NODE_ENV === 'development'
);

const List = params => {
    return (
        <div style={styles.mainContainer}>
            {params.isPending ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul style={styles.ul}>
                        {params.data?.map(post => (
                            <li key={`post_${post.id}`}>
                                {post.title} - {post.votes} votes
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Posts = ({ children = List, ...props }) => {
    const params = useInfiniteListController({
        resource: 'posts',
        ...props,
    });
    return children(params);
};

const ListWithCheckboxes = params => (
    <div style={styles.mainContainer}>
        {params.isPending ? (
            <p>Loading...</p>
        ) : (
            <div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <button
                        onClick={() => params.onSelectAll()}
                        disabled={params.total === params.selectedIds.length}
                    >
                        Select All
                    </button>
                    <button
                        onClick={() => params.onSelect([1])}
                        disabled={params.selectedIds.includes(1)}
                    >
                        Select item 1
                    </button>
                    <button
                        onClick={() => params.onSelectAll({ limit: 3 })}
                        disabled={params.selectedIds.length >= 3}
                    >
                        Limited Select All
                    </button>
                    <button
                        onClick={params.onUnselectItems}
                        disabled={params.selectedIds.length === 0}
                    >
                        Unselect All
                    </button>
                    <p data-testid="selected_ids">
                        Selected ids: {JSON.stringify(params.selectedIds)}
                    </p>
                </div>
                <ul
                    style={{
                        listStyleType: 'none',
                        ...styles.ul,
                    }}
                >
                    {params.data?.map(record => (
                        <li key={record.id}>
                            <input
                                type="checkbox"
                                checked={params.selectedIds.includes(record.id)}
                                onChange={() => params.onToggleItem(record.id)}
                                style={{
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                }}
                                data-testid={`checkbox-${record.id}`}
                            />
                            {record.id} - {record.title}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);

export const Basic = ({
    dataProvider = defaultDataProvider,
    children = ListWithCheckboxes,
}: {
    dataProvider?: DataProvider;
    children?: (props) => React.JSX.Element;
}) => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext dataProvider={dataProvider}>
                <CoreAdminUI>
                    <Resource name="posts" list={<Posts>{children}</Posts>} />
                </CoreAdminUI>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

const defaultAuthProvider: AuthProvider = {
    checkAuth: () => new Promise(resolve => setTimeout(resolve, 500)),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
};

export const Authenticated = ({
    authProvider = defaultAuthProvider,
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext
                dataProvider={dataProvider}
                authProvider={authProvider}
            >
                <CoreAdminUI>
                    <Resource name="posts" list={Posts} />
                </CoreAdminUI>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const DisableAuthentication = ({
    authProvider = defaultAuthProvider,
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext
                dataProvider={dataProvider}
                authProvider={authProvider}
            >
                <CoreAdminUI>
                    <Resource
                        name="posts"
                        list={<Posts disableAuthentication />}
                    />
                </CoreAdminUI>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

export const CanAccess = ({
    authProviderDelay = 300,
}: {
    authProviderDelay?: number;
}) => {
    return (
        <TestMemoryRouter>
            <AccessControlAdmin
                authProviderDelay={authProviderDelay}
                queryClient={new QueryClient()}
            />
        </TestMemoryRouter>
    );
};

const AccessControlAdmin = ({
    authProviderDelay,
    queryClient,
}: {
    authProviderDelay?: number;
    queryClient: QueryClient;
}) => {
    const [authorizedResources, setAuthorizedResources] = React.useState({
        'posts.list': true,
    });

    const authProvider: AuthProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.reject(new Error('Not implemented')),
        getPermissions: () => Promise.resolve(undefined),
        canAccess: ({ action, resource }) =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(authorizedResources[`${resource}.${action}`]);
                }, authProviderDelay);
            }),
    };
    return (
        <AccessControlUI
            queryClient={queryClient}
            authorizedResources={authorizedResources}
            setAuthorizedResources={setAuthorizedResources}
        >
            <CoreAdmin
                authProvider={authProvider}
                dataProvider={defaultDataProvider}
                queryClient={queryClient}
                accessDenied={AccessDenied}
                loading={Loading}
                authenticationError={AuthenticationError}
            >
                <Resource name="posts" list={<Posts />} />
            </CoreAdmin>
        </AccessControlUI>
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
        'posts.list': boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.list']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.list':
                                    !authorizedResources['posts.list'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.list access
                </label>
            </div>
            <Browser>{children}</Browser>
        </div>
    );
};

const AccessDenied = () => {
    return (
        <div>
            <div>Access denied</div>
            <Link to="/posts">List</Link>
        </div>
    );
};

const AuthenticationError = () => {
    return (
        <div>
            <div>AuthenticationError</div>
        </div>
    );
};

const Loading = () => <div>Loading...</div>;
