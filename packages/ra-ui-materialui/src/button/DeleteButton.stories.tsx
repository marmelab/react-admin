import { colors, createTheme, Alert } from '@mui/material';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import * as React from 'react';
import { AdminContext } from '../AdminContext';
import { DeleteButton } from './DeleteButton';

const theme = createTheme({
    palette: {
        primary: {
            light: colors.orange[100],
            main: colors.orange[500],
            contrastText: colors.grey[50],
        },
        error: {
            main: colors.orange[500],
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

export const PessimisticWithCustomDialogContent = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <DeleteButton
            mutationMode="pessimistic"
            record={{ id: 1 }}
            label="Delete"
            resource="post"
            confirmTitle={
                <>
                    Delete <strong>Full Name</strong>
                </>
            }
            confirmContent={
                <Alert severity="warning">
                    Are you sure you want to delete this user?
                </Alert>
            }
        />
    </AdminContext>
);

export const WithUserDefinedPalette = () => (
    <AdminContext theme={theme}>
        <DeleteButton label="Delete" record={{ id: 1 }} />
    </AdminContext>
);

export const ContainedWithUserDefinedPalette = () => (
    <AdminContext theme={theme}>
        <DeleteButton
            variant="contained"
            color="primary"
            label="Delete"
            record={{ id: 1 }}
        />
    </AdminContext>
);
