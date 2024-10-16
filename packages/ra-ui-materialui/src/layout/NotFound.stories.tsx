import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { NotFound } from './NotFound';

export default {
    title: 'ra-ui-materialui/layout/NotFound',
};

export const Basic = () => (
    <AdminContext>
        <NotFound />
    </AdminContext>
);

export const English = () => (
    <AdminContext
        i18nProvider={polyglotI18nProvider(() => englishMessages, 'en')}
    >
        <NotFound />
    </AdminContext>
);

export const Anonymous = () => {
    const [loggedOut, setLoggedOut] = React.useState(false);
    if (loggedOut) {
        return <p>Logged Out</p>;
    }
    return (
        <AdminContext
            authProvider={
                {
                    checkAuth: () => Promise.reject(),
                    logout: () => {
                        setLoggedOut(true);
                        return Promise.resolve();
                    },
                } as any
            }
        >
            <NotFound />
        </AdminContext>
    );
};
