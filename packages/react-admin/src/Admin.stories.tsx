import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import { Admin } from './Admin';
import { Resource, testDataProvider, TestMemoryRouter } from 'ra-core';

export default {
    title: 'react-admin/Admin',
};

const PostList = () => <h1>Post List</h1>;
const CommentList = () => <h1>Comment List</h1>;

export const Basic = () => (
    <Admin dataProvider={testDataProvider()}>
        <Resource name="posts" list={PostList} />
        <Resource name="comments" list={CommentList} />
    </Admin>
);

export const InsideRouter = () => (
    <TestMemoryRouter>
        <Admin dataProvider={testDataProvider()}>
            <Resource name="posts" list={PostList} />
            <Resource name="comments" list={CommentList} />
        </Admin>
    </TestMemoryRouter>
);

export const SubPath = () => (
    <TestMemoryRouter>
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
                    <Admin dataProvider={testDataProvider()} basename="/admin">
                        <Resource name="posts" list={PostList} />
                        <Resource name="comments" list={CommentList} />
                    </Admin>
                }
            />
        </Routes>
    </TestMemoryRouter>
);
