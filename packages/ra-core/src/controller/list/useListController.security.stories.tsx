import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';

import { CoreAdminContext, CoreAdminUI, Resource } from '../../core';
import { AuthProvider, DataProvider } from '../../types';
import { useListController } from './useListController';

export default {
    title: 'ra-core/controller/list/useListController',
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

const defaultDataProvider = fakeDataProvider(
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

const Posts = () => {
    const params = useListController({
        resource: 'posts',
    });
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
        <CoreAdminContext
            dataProvider={dataProvider}
            authProvider={authProvider}
        >
            <CoreAdminUI>
                <Resource name="posts" list={Posts} />
            </CoreAdminUI>
        </CoreAdminContext>
    );
};
