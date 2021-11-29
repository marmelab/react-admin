import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import CoreAdminContext from './CoreAdminContext';
import { Resource } from './Resource';
import { testDataProvider } from '../dataProvider';

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
                dataProvider={testDataProvider()}
                initialState={{ admin: { resources: { posts: {} } } }}
            >
                <Resource {...resource} />
            </CoreAdminContext>
        );
        // Resource does not declare a route matching its name, it only renders its child routes
        // so we don't need to navigate to a path matching its name
        history.push('/');
        expect(screen.getByText('PostList')).not.toBeNull();
        history.push('/123');
        expect(screen.getByText('PostEdit')).not.toBeNull();
        history.push('/123/show');
        expect(screen.getByText('PostShow')).not.toBeNull();
        history.push('/create');
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
                dataProvider={testDataProvider()}
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
        // Resource does not declare a route matching its name, it only renders its child routes
        // so we don't need to navigate to a path matching its name
        history.push('/');
        await waitFor(() => {
            expect(getByText('Permissions: admin')).not.toBeNull();
        });
    });
});
