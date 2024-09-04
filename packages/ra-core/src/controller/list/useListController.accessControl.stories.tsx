import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';

import { CoreAdminContext, Resource } from '../../core';
import { localStorageStore } from '../../store';
import { FakeBrowserDecorator } from '../../storybook/FakeBrowser';
import { AuthProvider, Exporter, SortPayload } from '../../types';
import { useListController } from './useListController';
import { QueryClient } from '@tanstack/react-query';
import { defaultExporter } from '../../export';

export default {
    title: 'ra-core/controller/list/useListController',
    decorators: [FakeBrowserDecorator],
    parameters: {
        initialEntries: ['/posts'],
    },
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

const dataProvider = fakeDataProvider({
    posts: [
        { id: 1, title: 'Post #1', votes: 90 },
        { id: 2, title: 'Post #2', votes: 20 },
        { id: 3, title: 'Post #3', votes: 30 },
        { id: 4, title: 'Post #4', votes: 40 },
        { id: 5, title: 'Post #5', votes: 50 },
        { id: 6, title: 'Post #6', votes: 60 },
        { id: 7, title: 'Post #7', votes: 70 },
    ],
});

const OrderedPostList = ({
    storeKey,
    sort,
    exporter = defaultExporter,
}: {
    storeKey: string | false;
    sort?: SortPayload;
    exporter?: Exporter;
}) => {
    const params = useListController({
        debounce: 200,
        perPage: 5,
        sort,
        storeKey,
        exporter,
    });
    return (
        <div>
            <br />
            <br />
            <button
                aria-label="export"
                onClick={() =>
                    (params.exporter as Function)(
                        params.data,
                        null,
                        null,
                        params.resource
                    )
                }
            >
                Export
            </button>
            <ul style={styles.ul}>
                {!params.isPending &&
                    params.data!.map(post => (
                        <li key={`post_${post.id}`}>
                            {`${post.title} - ${post.votes} votes`}
                        </li>
                    ))}
            </ul>
            <p>
                Note that this simple component does not react to the record
                properties access rights changes. The export does though.
            </p>
        </div>
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
        posts: boolean;
        'posts.id': boolean;
        'posts.title': boolean;
        'posts.votes': boolean;
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
                        checked={authorizedResources['posts.votes']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'posts.votes':
                                    !authorizedResources['posts.votes'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    posts.votes access
                </label>
            </div>
            <div>{children}</div>
        </div>
    );
};

export const ListsWithAccessControl = ({
    exporter,
    initialAuthorizedResources = {
        posts: false,
        'posts.id': true,
        'posts.title': true,
        'posts.votes': true,
    },
}: {
    exporter?: Exporter;
    initialAuthorizedResources?: {
        posts: boolean;
        'posts.id': boolean;
        'posts.title': boolean;
        'posts.votes': boolean;
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
    const queryClient = new QueryClient();

    return (
        <CoreAdminContext
            store={localStorageStore()}
            dataProvider={dataProvider}
            authProvider={authProvider}
            queryClient={queryClient}
        >
            <AccessControlUI
                authorizedResources={authorizedResources}
                setAuthorizedResources={setAuthorizedResources}
                queryClient={queryClient}
            >
                <Resource
                    name="posts"
                    list={props => (
                        <OrderedPostList {...props} exporter={exporter} />
                    )}
                />
            </AccessControlUI>
        </CoreAdminContext>
    );
};
