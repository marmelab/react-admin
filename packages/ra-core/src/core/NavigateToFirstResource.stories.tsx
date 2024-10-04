import * as React from 'react';
import { TestMemoryRouter } from '../routing';
import { CoreAdmin } from './CoreAdmin';
import { Resource } from './Resource';
import { Browser } from '../storybook/FakeBrowser';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../types';
import { Link } from 'react-router-dom';

export default {
    title: 'ra-core/core/NavigateToFirstResource',
};

export const NoAuthProvider = () => (
    <TestMemoryRouter>
        <CoreAdmin>
            <Resource name="settings" edit={() => <div>Settings</div>} />
            <Resource name="posts" list={() => <div>Posts</div>} />
            <Resource name="users" list={() => <div>Users</div>} />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const AccessControl = () => (
    <TestMemoryRouter>
        <AccessControlAdmin queryClient={new QueryClient()} />
    </TestMemoryRouter>
);

const AccessControlAdmin = ({ queryClient }: { queryClient: QueryClient }) => {
    const [authorizedResources, setAuthorizedResources] = React.useState({
        'posts.list': true,
        'users.list': true,
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
                }, 300);
            }),
    };
    return (
        <CoreAdmin
            queryClient={queryClient}
            authProvider={authProvider}
            layout={({ children }) => (
                <AccessControlUI
                    authorizedResources={authorizedResources}
                    setAuthorizedResources={setAuthorizedResources}
                    queryClient={queryClient}
                >
                    {children}
                </AccessControlUI>
            )}
        >
            <Resource name="settings" edit={() => <div>Settings</div>} />
            <Resource
                name="posts"
                list={() => (
                    <div>
                        <div>Posts</div>
                        <Link to="/">Go home</Link>
                    </div>
                )}
            />
            <Resource
                name="users"
                list={() => (
                    <div>
                        <div>Users</div>
                        <Link to="/">Go home</Link>
                    </div>
                )}
            />
        </CoreAdmin>
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
        'users.list': boolean;
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
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['users.list']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'users.list':
                                    !authorizedResources['users.list'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    users.list access
                </label>
            </div>
            <Browser>{children}</Browser>
        </div>
    );
};
