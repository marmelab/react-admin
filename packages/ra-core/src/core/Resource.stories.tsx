import * as React from 'react';
import { NavigateFunction, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { Browser } from '../storybook/FakeBrowser';
import { TestMemoryRouter } from '../routing';
import { AuthProvider } from '../types';
import { Resource } from './Resource';
import { CoreAdmin } from './CoreAdmin';

export default {
    title: 'ra-core/Admin/Resource',
};

const PostList = () => (
    <div>
        <div>PostList</div>
        <Link to="/posts/create">create</Link> <Link to="/posts/123">edit</Link>{' '}
        <Link to="/posts/123/show">show</Link>{' '}
        <Link to="/posts/customroute">custom</Link>
    </div>
);
const PostEdit = () => (
    <div>
        <div>PostEdit</div>
        <Link to="/posts">list</Link>
    </div>
);
const PostCreate = () => (
    <div>
        <div>PostCreate</div>
        <Link to="/posts">list</Link>
    </div>
);
const PostShow = () => (
    <div>
        <div>PostShow</div>
        <Link to="/posts">list</Link>
    </div>
);
const PostIcon = () => <div>PostIcon</div>;

const PostCustomRoute = () => (
    <div>
        <div>PostCustomRoute</div>
        <Link to="/posts">list</Link>
    </div>
);

const resource = {
    name: 'posts',
    options: { foo: 'bar' },
    list: PostList,
    edit: PostEdit,
    create: PostCreate,
    show: PostShow,
    icon: PostIcon,
    children: <Route path="customroute" element={<PostCustomRoute />} />,
};

export const Basic = ({
    navigateCallback,
}: {
    navigateCallback?: (n: NavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <CoreAdmin loading={Loading}>
            <Resource {...resource} />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const AccessControl = ({
    authProviderDelay = 300,
}: {
    authProviderDelay?: number;
}) => {
    const queryClient = new QueryClient();
    return (
        <TestMemoryRouter>
            <AccessControlAdmin
                queryClient={queryClient}
                authProviderDelay={authProviderDelay}
            />
        </TestMemoryRouter>
    );
};

export const SlowAccessControl = ({
    authProviderDelay = 1000,
}: {
    authProviderDelay?: number;
}) => {
    return <AccessControl authProviderDelay={authProviderDelay} />;
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
        'posts.create': false,
        'posts.edit': false,
        'posts.show': true,
    });

    const authProvider: AuthProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkAuth: () => Promise.reject(new Error('Not implemented')),
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
                queryClient={queryClient}
                unauthorized={Unauthorized}
                loading={Loading}
            >
                <Resource {...resource} />
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
        'posts.create': boolean;
        'posts.edit': boolean;
        'posts.show': boolean;
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
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.create']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.create':
                                    !authorizedResources['posts.create'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.create access
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.edit']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.edit':
                                    !authorizedResources['posts.edit'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.edit access
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['posts.show']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.show':
                                    !authorizedResources['posts.show'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.show access
                </label>
            </div>
            <Browser>{children}</Browser>
        </div>
    );
};

const Unauthorized = () => {
    return (
        <div>
            <div>Unauthorized</div>
            <Link to="..">list</Link>
        </div>
    );
};

const Loading = () => <div>Loading...</div>;
