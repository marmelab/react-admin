import * as React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import fakeDataProvider from 'ra-data-fakerest';

import {
    CoreAdminContext,
    CoreAdminUI,
    CustomRoutes,
    Resource,
} from '../../core';
import { localStorageStore } from '../../store';
import { FakeBrowserDecorator } from '../../storybook/FakeBrowser';
import { CoreLayoutProps, SortPayload } from '../../types';
import { useListController } from './useListController';

export default {
    title: 'ra-core/controller/list/useListController',
    decorators: [FakeBrowserDecorator],
    parameters: {
        initialEntries: ['/top'],
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
}: {
    storeKey: string | false;
    sort?: SortPayload;
}) => {
    const params = useListController({
        resource: 'posts',
        debounce: 200,
        perPage: 3,
        sort,
        storeKey,
    });
    return (
        <div>
            <span aria-label="storeKey" data-value={storeKey}>
                storeKey: {storeKey}
            </span>
            <br />
            <span aria-label="perPage" data-value={params.perPage}>
                perPage: {params.perPage}
            </span>
            <br />
            <br />
            <button
                aria-label="incrementPerPage"
                disabled={params.perPage > params.data?.length ?? false}
                onClick={() => params.setPerPage(++params.perPage)}
            >
                Increment perPage
            </button>{' '}
            <button
                aria-label="decrementPerPage"
                disabled={params.perPage <= 0}
                onClick={() => params.setPerPage(--params.perPage)}
            >
                Decrement perPage
            </button>
            <ul style={styles.ul}>
                {!params.isPending &&
                    params.data.map(post => (
                        <li key={`post_${post.id}`}>
                            {post.title} - {post.votes} votes
                        </li>
                    ))}
            </ul>
        </div>
    );
};

const MinimalLayout = (props: CoreLayoutProps) => {
    return (
        <div style={styles.mainContainer}>
            <Link aria-label="top" to={`/top`}>
                Go to Top List
            </Link>{' '}
            <Link aria-label="flop" to={`/flop`}>
                Go to Flop List
            </Link>
            <br />
            <br />
            {props.children}
        </div>
    );
};
const TopPosts = (
    <OrderedPostList storeKey="top" sort={{ field: 'votes', order: 'DESC' }} />
);
const FlopPosts = (
    <OrderedPostList storeKey="flop" sort={{ field: 'votes', order: 'ASC' }} />
);
const StorePosts = (
    <OrderedPostList storeKey="store" sort={{ field: 'votes', order: 'ASC' }} />
);
const NoStorePosts = (
    <OrderedPostList storeKey={false} sort={{ field: 'votes', order: 'ASC' }} />
);

export const ListsUsingSameResource = () => {
    return (
        <CoreAdminContext
            store={localStorageStore()}
            dataProvider={dataProvider}
        >
            <CoreAdminUI layout={MinimalLayout}>
                <CustomRoutes>
                    <Route path="/top" element={TopPosts} />
                </CustomRoutes>
                <CustomRoutes>
                    <Route path="/flop" element={FlopPosts} />
                </CustomRoutes>
                <Resource name="posts" />
            </CoreAdminUI>
        </CoreAdminContext>
    );
};

const NoStoreLayout = (props: CoreLayoutProps) => {
    return (
        <div style={styles.mainContainer}>
            <Link aria-label="store" to={`/store`}>
                Go to Store List
            </Link>{' '}
            <Link aria-label="nostore" to={`/nostore`}>
                Go to No Store List
            </Link>
            <br />
            <br />
            {props.children}
        </div>
    );
};
export const ListsWithoutStore = () => {
    return (
        <CoreAdminContext
            store={localStorageStore()}
            dataProvider={dataProvider}
        >
            <CoreAdminUI layout={NoStoreLayout}>
                <CustomRoutes>
                    <Route path="/store" element={StorePosts} />
                </CustomRoutes>
                <CustomRoutes>
                    <Route path="/nostore" element={NoStorePosts} />
                </CustomRoutes>
                <Resource name="posts" />
            </CoreAdminUI>
        </CoreAdminContext>
    );
};
