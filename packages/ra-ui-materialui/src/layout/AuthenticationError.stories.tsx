import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { AdminContext } from '../AdminContext';
import { Layout } from './Layout';
import { AuthenticationError } from './AuthenticationError';

export default {
    title: 'ra-ui-materialui/layout/AuthenticationError',
};

export const Basic = () => (
    <AdminContext i18nProvider={polyglotI18nProvider(() => englishMessages)}>
        <AuthenticationError />
    </AdminContext>
);

export const InApp = () => (
    <AdminContext i18nProvider={polyglotI18nProvider(() => englishMessages)}>
        <Layout>
            <AuthenticationError />
        </Layout>
    </AdminContext>
);
