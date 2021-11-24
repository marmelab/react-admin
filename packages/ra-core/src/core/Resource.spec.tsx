import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import CoreAdminContext from './CoreAdminContext';
import { Resource } from './Resource';

const PostList = () => <div>PostList</div>;
const PostEdit = () => <div>PostEdit</div>;
const PostCreate = () => <div>PostCreate</div>;
const PostShow = () => <div>PostShow</div>;
const PostIcon = () => <div>PostIcon</div>;

const resource = {
    name: 'posts',
    options: { foo: 'bar' },
    list: PostList,
    edit: PostEdit,
    create: PostCreate,
    show: PostShow,
    icon: PostIcon,
};

describe('<Resource>', () => {
    it('renders resource routes by default', () => {
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                history={history}
                dataProvider={() => Promise.resolve()}
                initialState={{ admin: { resources: { posts: {} } } }}
            >
                <Routes>
                    <Route
                        path="posts/*"
                        element={<Resource {...resource} />}
                    />
                </Routes>
            </CoreAdminContext>
        );
        history.push('/posts');
        expect(screen.getByText('PostList')).not.toBeNull();
        history.push('/posts/123');
        expect(screen.getByText('PostEdit')).not.toBeNull();
        history.push('/posts/123/show');
        expect(screen.getByText('PostShow')).not.toBeNull();
        history.push('/posts/create');
        expect(screen.getByText('PostCreate')).not.toBeNull();
    });
    it('injects permissions to the resource routes', async () => {
        const history = createMemoryHistory();
        const authProvider = {
            login: jest.fn().mockResolvedValue(''),
            logout: jest.fn().mockResolvedValue(''),
            checkAuth: jest.fn().mockResolvedValue(''),
            checkError: jest.fn().mockResolvedValue(''),
            getPermissions: jest.fn().mockResolvedValue('admin'),
        };

        const { getByText } = render(
            <CoreAdminContext
                authProvider={authProvider}
                dataProvider={() => Promise.resolve()}
                history={history}
                initialState={{ admin: { resources: { posts: {} } } }}
            >
                <Resource
                    name="posts"
                    list={({ permissions }) => (
                        <span>Permissions: {permissions}</span>
                    )}
                />
            </CoreAdminContext>
        );
        history.push('/posts');
        await waitFor(() => {
            expect(getByText('Permissions: admin')).not.toBeNull();
        });
    });
});
