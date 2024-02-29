import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { CoreAdminContext } from './CoreAdminContext';

import { Resource } from './Resource';
import { Route } from 'react-router';
import { TestMemoryRouter } from '../routing';

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
    it('renders resource routes by default', async () => {
        let navigate;
        render(
            <TestMemoryRouter
                navigateCallback={n => {
                    navigate = n;
                }}
            >
                <CoreAdminContext>
                    <Resource {...resource} />
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        // Resource does not declare a route matching its name, it only renders its child routes
        // so we don't need to navigate to a path matching its name
        navigate('/');
        await screen.findByText('PostList');
        navigate('/123');
        await screen.findByText('PostEdit');
        navigate('/123/show');
        await screen.findByText('PostShow');
        navigate('/create');
        await screen.findByText('PostCreate');
        navigate('/customroute');
        await screen.findByText('PostCustomRoute');
    });
});
