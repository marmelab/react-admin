import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { CoreAdminContext } from './CoreAdminContext';
import { Resource } from './Resource';
import { Route } from 'react-router';

const PostList = () => <div>PostList</div>;
const PostEdit = () => <div>PostEdit</div>;
const PostCreate = () => <div>PostCreate</div>;
const PostShow = () => <div>PostShow</div>;
const PostIcon = () => <div>PostIcon</div>;

const PostCustomRoute = () => <div>PostCustomRoute</div>;

const resource = {
    name: 'posts',
    options: { foo: 'bar' },
    list: PostList,
    edit: PostEdit,
    create: PostCreate,
    show: PostShow,
    icon: PostIcon,
    children: <Route path="customroute" element={<PostCustomRoute />} />,
};

describe('<Resource>', () => {
    it('renders resource routes by default', () => {
        const history = createMemoryHistory();
        render(
            <CoreAdminContext history={history}>
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
        history.push('/customroute');
        expect(screen.getByText('PostCustomRoute')).not.toBeNull();
    });
});
