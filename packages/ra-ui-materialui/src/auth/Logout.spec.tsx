import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { UserAuthenticated, UserUnauthenticated } from './Logout.stories';

it('should display logout button if the auth succeeds', async () => {
    render(<UserAuthenticated />);

    await waitFor(() => {
        const logoutButton = screen.queryByText(
            'ra.auth.logout'
        ) as HTMLInputElement;
        expect(logoutButton).not.toBeNull();
    });
});

it('should not display logout button if the auth fails', async () => {
    render(<UserUnauthenticated />);

    await waitFor(() => {
        const logoutButton = screen.queryByText(
            'ra.auth.logout'
        ) as HTMLInputElement;
        expect(logoutButton).toBeNull();
    });
});
