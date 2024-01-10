import { Typography } from '@mui/material';
import * as React from 'react';
import { AdminContext } from '../AdminContext';
import { Logout } from './Logout';

export default { title: 'ra-ui-materialui/auth/Logout' };

const MinimalAdmin = (props: { authenticated: boolean }) => {
    const authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () =>
            props.authenticated ? Promise.resolve() : Promise.reject(),
        checkError: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
    };
    return (
        <AdminContext authProvider={authProvider}>
            <Typography variant="h6">
                Should {props.authenticated ? '' : 'not '}display logout button
            </Typography>
            <Logout />
        </AdminContext>
    );
};

export const UserAuthenticated = () => <MinimalAdmin authenticated={true} />;

export const UserUnauthenticated = () => <MinimalAdmin authenticated={false} />;
