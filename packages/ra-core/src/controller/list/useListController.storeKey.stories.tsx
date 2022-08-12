import * as React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import fakeDataProvider from 'ra-data-fakerest';

import { CoreAdmin, CustomRoutes, Resource } from '../../core';
import { localStorageStore } from '../../store';
import { FakeBrowserDecorator } from '../../storybook/FakeBrowser';
import { CoreLayoutProps, SortPayload } from '../../types';
import { ListController } from './ListController';
import { ListControllerResult } from './useListController';

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

const listControllerComponent = (storeKey: string, sort?: SortPayload) => {
    return (
        <ListController
            resource="posts"
            debounce={200}
            perPage={3}
            sort={sort}
            storeKey={storeKey}
            children={(params: ListControllerResult) => (
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
                        disabled={params.perPage > params.data?.length ?? 0}
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
                        {!params.isLoading &&
                            params.data.map(post => (
                                <li key={`post_${post.id}`}>
                                    {post.title} - {post.votes} votes
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        />
    );
};

const MinimalLayout = (props: CoreLayoutProps) => {
    return (
        <div style={styles.mainContainer}>
            <Link aria-label="top" to={`/top`}>
                Go to Top
            </Link>{' '}
            <Link aria-label="flop" to={`/flop`}>
                Go to Flop
            </Link>
            <br />
            <br />
            {props.children}
        </div>
    );
};
const TopList = () =>
    listControllerComponent('top', { field: 'votes', order: 'DESC' });
const FlopList = () =>
    listControllerComponent('flop', { field: 'votes', order: 'ASC' });

export const ListsUsingSameResource = (argsOrProps, context) => {
    const history = context?.history || argsOrProps.history;
    return (
        <CoreAdmin
            history={history}
            layout={MinimalLayout}
            store={localStorageStore()}
            dataProvider={dataProvider}
        >
            <CustomRoutes>
                <Route path="/top" element={<TopList />} />
            </CustomRoutes>
            <CustomRoutes>
                <Route path="/flop" element={<FlopList />} />
            </CustomRoutes>
            <Resource name="posts" />
        </CoreAdmin>
    );
};
