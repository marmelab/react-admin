import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { LoginWithEmail } from './LoginWithEmail';

export default { title: 'ra-ui-materialui/auth/LoginWithEmail' };

export const Basic = () => (
    <Wrapper>
        <LoginWithEmail />
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
