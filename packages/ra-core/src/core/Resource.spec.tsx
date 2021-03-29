import * as React from 'react';
import expect from 'expect';
import { waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Resource from './Resource';
import { registerResource, unregisterResource } from '../actions';
import { renderWithRedux } from 'ra-test';
import AuthContext from '../auth/AuthContext';

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
    it(`registers its resource in redux on mount when context is 'registration'`, () => {
        const { dispatch } = renderWithRedux(
            <Resource {...resource} intent="registration" />
        );
        expect(dispatch).toHaveBeenCalledWith(
            registerResource({
                name: 'posts',
                options: { foo: 'bar' },
                hasList: true,
                hasEdit: true,
                hasShow: true,
                hasCreate: true,
                icon: PostIcon,
            })
        );
    });
    it(`unregister its resource from redux on unmount when context is 'registration'`, async () => {
        const { unmount, dispatch } = renderWithRedux(
            <Resource {...resource} intent="registration" />
        );
        unmount();
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch.mock.calls[1][0]).toEqual(
                unregisterResource('posts')
            );
        });
    });
    it('renders resource routes by default', () => {
        const history = createMemoryHistory();
        const { getByText } = renderWithRedux(
            <Router history={history}>
                <Resource
                    {...resource}
                    match={{
                        url: '/posts',
                        params: {},
                        isExact: true,
                        path: '/posts',
                    }}
                />
            </Router>,
            { admin: { resources: { posts: {} } } }
        );
        history.push('/posts');
        expect(getByText('PostList')).not.toBeNull();
        history.push('/posts/123');
        expect(getByText('PostEdit')).not.toBeNull();
        history.push('/posts/123/show');
        expect(getByText('PostShow')).not.toBeNull();
        history.push('/posts/create');
        expect(getByText('PostCreate')).not.toBeNull();
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

        const { getByText } = renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <Router history={history}>
                    <Resource
                        name="posts"
                        list={({ permissions }) => (
                            <span>Permissions: {permissions}</span>
                        )}
                        match={{
                            url: '/posts',
                            params: {},
                            isExact: true,
                            path: '/',
                        }}
                    />
                </Router>
            </AuthContext.Provider>,
            { admin: { resources: { posts: {} } } }
        );
        history.push('/posts');
        await waitFor(() => {
            expect(getByText('Permissions: admin')).not.toBeNull();
        });
    });
});
