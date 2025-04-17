import * as React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Typography, Link } from '@mui/material';
import { required } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Login } from './Login';
import { LoginForm } from './LoginForm';
import { TextInput, PasswordInput } from '../input';

export default { title: 'ra-ui-materialui/auth/Login' };

export const DefaultLogin = () => (
    <Wrapper>
        <Login />
    </Wrapper>
);

export const AvatarIcon = () => (
    <Wrapper>
        <Login avatarIcon={<AccountBoxIcon />} />
    </Wrapper>
);

export const BackgroundImage = () => (
    <Wrapper>
        <Login backgroundImage="https://upload.wikimedia.org/wikipedia/commons/a/a5/Red_Kitten_01.jpg" />
    </Wrapper>
);

export const CustomForm = () => (
    <Wrapper>
        <Login>
            <LoginForm>
                <TextInput
                    autoFocus
                    source="email"
                    label="Email"
                    autoComplete="email"
                    type="email"
                    validate={required()}
                />
                <PasswordInput
                    source="password"
                    label="Password"
                    autoComplete="current-password"
                    validate={required()}
                />
            </LoginForm>
        </Login>
    </Wrapper>
);

export const AdditionalContent = () => (
    <Wrapper>
        <Login>
            <LoginForm />
            <Typography variant="body2" textAlign="center" mb={1}>
                <Link href="/forgot-password">Forgot password?</Link>
            </Typography>
        </Login>
    </Wrapper>
);

const Wrapper = ({ children }) => {
    const authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => Promise.reject(),
        checkError: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
    };
    return (
        <AdminContext
            authProvider={authProvider}
            i18nProvider={polyglotI18nProvider(() => englishMessages)}
        >
            {children}
        </AdminContext>
    );
};
