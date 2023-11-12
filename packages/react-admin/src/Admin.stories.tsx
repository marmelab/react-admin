import * as React from 'react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';

import { Admin } from './Admin';
import { Resource, testDataProvider } from 'ra-core';
import { defaultDarkTheme } from 'ra-ui-materialui';

export default {
    title: 'react-admin/Admin',
};

const PostList = () => <h1>Post List</h1>;
const CommentList = () => <h1>Comment List</h1>;

export const Basic = () => (
    <Admin darkTheme={defaultDarkTheme} dataProvider={testDataProvider()}>
        <Resource name="posts" list={PostList} />
        <Resource name="comments" list={CommentList} />
    </Admin>
);

export const InsideRouter = () => (
    <MemoryRouter>
        <Admin darkTheme={defaultDarkTheme} dataProvider={testDataProvider()}>
            <Resource name="posts" list={PostList} />
            <Resource name="comments" list={CommentList} />
        </Admin>
    </MemoryRouter>
);

export const SubPath = () => (
    <MemoryRouter>
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <h1>Main</h1>
                        <div>
                            <Link to="/admin">Go to admin</Link>
                        </div>
                    </>
                }
            />
            <Route
                path="/admin/*"
                element={
                    <Admin
                        darkTheme={defaultDarkTheme}
                        dataProvider={testDataProvider()}
                        basename="/admin"
                    >
                        <Resource name="posts" list={PostList} />
                        <Resource name="comments" list={CommentList} />
                    </Admin>
                }
            />
        </Routes>
    </MemoryRouter>
);
