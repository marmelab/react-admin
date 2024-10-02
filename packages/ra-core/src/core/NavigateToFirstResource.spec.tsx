import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    AccessControl,
    NoAuthProvider,
} from './NavigateToFirstResource.stories';

describe('<NavigateToFirstResource>', () => {
    it('should render the first resource with a list when there is no AuthProvider', async () => {
        render(<NoAuthProvider />);
        await screen.findByText('Posts');
    });

    it('should render the first resource with a list users have access to', async () => {
        render(<AccessControl />);
        await screen.findByText('Posts');
        fireEvent.click(screen.getByLabelText('posts.list access'));
        fireEvent.click(screen.getByText('Go home'));
        await screen.findByText('Users');
    });
});
