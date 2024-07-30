import * as React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { AdminContext } from '../AdminContext';
import { Login } from './Login';

export default { title: 'ra-ui-materialui/auth/Login' };

export const DefaultLogin = () => {
    return (
        <Wrapper>
            <Login />
        </Wrapper>
    );
};

export const CustomIcon = () => {
    return (
        <Wrapper>
            <Login avatarIcon={<AccountBoxIcon />} />
        </Wrapper>
    );
};

const Wrapper = ({ children }) => {
    const authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => Promise.reject(),
        checkError: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
    };
    return <AdminContext authProvider={authProvider}>{children}</AdminContext>;
};
