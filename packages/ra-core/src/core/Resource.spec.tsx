import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
    Basic,
    OnlyList,
    WithAllDialogs,
    WithCreateDialog,
    WithShowDialog,
} from './Resource.stories';

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

    it('always renders the list if only a list view is present', async () => {
        let navigate;
        render(
            <OnlyList
                navigateCallback={n => {
                    navigate = n;
                }}
            />
        );
        navigate('/posts');
        await screen.findByText('PostList');
        navigate('/posts/123');
        await screen.findByText('PostList');
        navigate('/posts/123/show');
        await screen.findByText('PostList');
        navigate('/posts/create');
        await screen.findByText('PostList');
        navigate('/posts/customroute');
        await screen.findByText('PostList');
    });

    it('allows to render all dialogs views declared in the list view', async () => {
        let navigate;
        render(
            <WithAllDialogs
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
    });

    it('allows to render a create dialog declared in the list even if there is an edit view', async () => {
        let navigate;
        render(
            <WithCreateDialog
                navigateCallback={n => {
                    navigate = n;
                }}
            />
        );
        navigate('/posts');
        await screen.findByText('PostList');
        navigate('/posts/123');
        await screen.findByText('PostEdit');
        navigate('/posts/create');
        await screen.findByText('PostCreate');
    });

    it('allows to render a show dialog declared in the list even if there is an edit view', async () => {
        let navigate;
        render(
            <WithShowDialog
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
    });
});
