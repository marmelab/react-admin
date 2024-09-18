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

    it('renders not render the resource routes if the authProvider.canAccess function returns false this route matching action', async () => {
        render(<AccessControl />);
        await screen.findByText('PostList');
        await fireEvent.click(screen.getByText('create'));
        await screen.findByText('Unauthorized');
        await fireEvent.click(screen.getByText('list'));
        await fireEvent.click(screen.getByLabelText('posts.create access'));
        await fireEvent.click(await screen.findByText('create'));
        await screen.findByText('PostCreate');
        await fireEvent.click(screen.getByText('list'));
        await fireEvent.click(screen.getByText('edit'));
        await screen.findByText('Unauthorized');
        await fireEvent.click(screen.getByText('list'));
        await fireEvent.click(screen.getByLabelText('posts.edit access'));
        await fireEvent.click(await screen.findByText('edit'));
        await screen.findByText('PostEdit');
        await fireEvent.click(screen.getByText('list'));
        await fireEvent.click(screen.getByText('show'));
        await screen.findByText('PostShow');
        await fireEvent.click(screen.getByText('list'));
        await fireEvent.click(screen.getByLabelText('posts.show access'));
        await fireEvent.click(await screen.findByText('show'));
        await screen.findByText('Unauthorized');
        await fireEvent.click(screen.getByText('list'));
        await fireEvent.click(screen.getByText('custom'));
        await screen.findByText('PostCustomRoute');
        await fireEvent.click(screen.getByText('list'));
        await fireEvent.click(screen.getByLabelText('posts.list access'));
        await screen.findByText('Unauthorized');
    });
});
