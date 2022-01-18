import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { AtRoot, SubPath } from './useCreateInternalLink.stories';

describe('useCreateInternalLink', () => {
    beforeEach(() => {
        window.history.replaceState({}, '', '/');
    });

    it('creates valid links when used without a basename', async () => {
        render(<AtRoot />);
        await screen.findByText('Home');
        screen.getByText('Post list').click();
        await screen.findByText('Posts');
        screen.getByText('Home').click();
        screen.getByText('Post detail').click();
        await screen.findByText('Post 123');
    });

    it('creates valid links when used with a basename', async () => {
        render(<SubPath />);
        await screen.findByText('Main');
        screen.getByText('Go to admin').click();
        await screen.findByText('Home');
        screen.getByText('Post list').click();
        await screen.findByText('Posts');
        screen.getByText('Home').click();
        screen.getByText('Post detail').click();
        await screen.findByText('Post 123');
    });
});
