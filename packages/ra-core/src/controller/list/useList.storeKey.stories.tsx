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
import { useList } from './useList';

export default {
    title: 'ra-core/controller/list/useList',
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
    const params = useList({
        resource: 'posts',
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
            <button
                aria-label="incrementPerPage"
                onClick={() => {
                    return params.setPerPage(++params.perPage);
                }}
            >
                Increment perPage
            </button>
            <ul style={styles.ul}>
                {params.data?.map(post => (
                    <li key={post.id}>
                        {post.title} - {post.votes} votes
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Layout = (props: CoreLayoutProps) => (
    <div style={styles.mainContainer}>
        <Link aria-label="top" to={`/top`}>
            Go to Top Posts
        </Link>
        <Link aria-label="flop" to={`/flop`}>
            Go to Flop Posts
        </Link>
        <Link aria-label="store" to={`/store`}>
            Go to Store List
        </Link>
        <Link aria-label="nostore" to={`/nostore`}>
            Go to No-Store List
        </Link>

        <br />
        {props.children}
    </div>
);

const TopPosts = (
    <OrderedPostList
        storeKey="topPostsKey"
        sort={{ field: 'votes', order: 'DESC' }}
    />
);
const FlopPosts = (
    <OrderedPostList
        storeKey="flopPostsKey"
        sort={{ field: 'votes', order: 'ASC' }}
    />
);
const StorePosts = (
    <OrderedPostList
        storeKey="storeListKey"
        sort={{ field: 'votes', order: 'ASC' }}
    />
);
const NoStorePosts = (
    <OrderedPostList storeKey={false} sort={{ field: 'votes', order: 'ASC' }} />
);

export const ListsWithStoreKeys = () => (
    <CoreAdminContext store={localStorageStore()} dataProvider={dataProvider}>
        <CoreAdminUI layout={Layout}>
            <CustomRoutes>
                <Route path="/top" element={TopPosts} />
                <Route path="/flop" element={FlopPosts} />
            </CustomRoutes>
            <Resource name="posts" />
        </CoreAdminUI>
    </CoreAdminContext>
);

export const ListsWithoutStoreKeys = () => (
    <CoreAdminContext store={localStorageStore()} dataProvider={dataProvider}>
        <CoreAdminUI layout={Layout}>
            <CustomRoutes>
                <Route path="/store" element={StorePosts} />
                <Route path="/nostore" element={NoStorePosts} />
            </CustomRoutes>
            <Resource name="posts" />
        </CoreAdminUI>
    </CoreAdminContext>
);
