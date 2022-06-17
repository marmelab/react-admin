import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AdminContext } from '../AdminContext';
import { Logout } from './Logout';
import { UserAuthenticated, UserUnauthenticated } from './Logout.stories';

export default { title: 'ra-ui-materialui/input/AutocompleteArrayInput' };

const MinimalAdmin = authProvider => {
    return (
        <AdminContext authProvider={authProvider}>
            <Logout />
        </AdminContext>
    );
};

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
