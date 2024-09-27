import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AccessControl, Basic } from './Resource.stories';

describe('<Resource>', () => {
    it('renders resource routes by default', async () => {
        let navigate;
        render(
            <Basic
                navigateCallback={n => {
                    navigate = n;
                }}
            />
        );
        navigate('/posts');
        await screen.findByText('PostList');
        navigate('/posts/123');
        await screen.findByText('PostEdit');
        navigate('/posts/123/show');
        await screen.findByText('PostShow');
        navigate('/posts/create');
        await screen.findByText('PostCreate');
        navigate('/posts/customroute');
        await screen.findByText('PostCustomRoute');
    });

    it('only renders the resource list route if the authProvider.canAccess function returns true for the action=list', async () => {
        render(<AccessControl />);
        // Check that the list route is rendered when authorized
        await screen.findByText('PostList');
        // Check that the list route is not rendered when unauthorized
        await fireEvent.click(screen.getByLabelText('posts.list access'));
        await screen.findByText('Unauthorized');
    });
    it('only renders the resource create route if the authProvider.canAccess function returns true for the action=create', async () => {
        render(<AccessControl />);
        // Check that the create route is not rendered when unauthorized
        await fireEvent.click(await screen.findByText('create'));
        await screen.findByText('Unauthorized');
        await fireEvent.click(screen.getByText('list'));
        // Check that the create route is rendered when authorized
        await fireEvent.click(screen.getByLabelText('posts.create access'));
        await fireEvent.click(await screen.findByText('create'));
        await screen.findByText('PostCreate');
    });
    it('always render the resource custom routes', async () => {
        render(<AccessControl />);
        await fireEvent.click(await screen.findByText('custom'));
        await screen.findByText('PostCustomRoute');
    });
});
