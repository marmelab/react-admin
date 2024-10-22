import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Basic } from './Resource.stories';

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
});
