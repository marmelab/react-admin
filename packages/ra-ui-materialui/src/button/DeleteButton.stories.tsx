import * as React from 'react';
import { createTheme } from '@mui/material';
import { DeleteButton } from './DeleteButton';
import { AdminContext } from '../AdminContext';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

const theme = createTheme({
    palette: {
        error: {
            main: '#07BA8F',
        },
    },
});

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en'
);

export default { title: 'ra-ui-materialui/button/DeleteButton' };

export const Basic = () => (
    <AdminContext>
        <DeleteButton label="Delete" record={{ id: 1 }} />
    </AdminContext>
);

export const Pessimistic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <DeleteButton
            mutationMode="pessimistic"
            record={{ id: 1 }}
            label="Delete"
            resource="post"
        />
    </AdminContext>
);

export const WithUserDefinedPalette = () => (
    <AdminContext theme={theme}>
        <DeleteButton label="Delete" record={{ id: 1 }} />
    </AdminContext>
);
