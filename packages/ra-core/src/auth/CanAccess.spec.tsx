import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
    Basic,
    CustomLoading,
    CustomUnauthorized,
    NoAuthProvider,
    Unauthorized,
} from './CanAccess.stories';

describe('CanAccess', () => {
    it('shows the default loading component while loading', async () => {
        render(<Basic />);
        await screen.findByText('Loading...');
    });
    it('shows the custom loading element while loading', async () => {
        render(<CustomLoading />);
        await screen.findByText('Please wait...');
    });
    it('shows the default unauthorized component when users are unauthorized', async () => {
        render(<Unauthorized />);
        await screen.findByText('Loading...');
    });
    it('shows the custom unauthorized element when users are unauthorized', async () => {
        render(<CustomUnauthorized />);
        await screen.findByText('Not allowed');
    });
    it('shows the protected content when users are authorized', async () => {
        render(<Basic />);
        await screen.findByText('protected content');
    });
    it('shows the protected content when no authProvider', () => {
        render(<NoAuthProvider />);
        screen.getByText('protected content');
    });
});
