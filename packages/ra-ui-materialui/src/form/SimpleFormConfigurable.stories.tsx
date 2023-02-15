import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PreferencesEditorContextProvider, I18nContextProvider } from 'ra-core';
import { ThemeProvider, createTheme, Box, Paper } from '@mui/material';
import { QueryClientProvider, QueryClient } from 'react-query';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';

import { Inspector, InspectorButton } from '../preferences';
import { NumberInput, TextInput } from '../input';
import { SimpleFormConfigurable } from './SimpleFormConfigurable';
import { defaultTheme } from '../defaultTheme';

export default { title: 'ra-ui-materialui/forms/SimpleFormConfigurable' };

const data = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    year: 1869,
};

const Wrapper = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider theme={createTheme(defaultTheme)}>
            <PreferencesEditorContextProvider>
                <MemoryRouter>
                    <Inspector />
                    <Box display="flex" justifyContent="flex-end">
                        <InspectorButton />
                    </Box>
                    <Paper sx={{ width: 600, m: 2 }}>{children}</Paper>
                </MemoryRouter>
            </PreferencesEditorContextProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export const Basic = () => (
    <Wrapper>
        <SimpleFormConfigurable record={data} resource="books">
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleFormConfigurable>
    </Wrapper>
);

export const Omit = () => (
    <Wrapper>
        <SimpleFormConfigurable
            record={data}
            resource="books2"
            omit={['author']}
        >
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleFormConfigurable>
    </Wrapper>
);

export const PreferenceKey = () => (
    <Wrapper>
        <SimpleFormConfigurable
            record={data}
            resource="books3"
            preferenceKey="pref1"
        >
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleFormConfigurable>
        <SimpleFormConfigurable
            record={data}
            resource="books3"
            preferenceKey="pref2"
        >
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleFormConfigurable>
    </Wrapper>
);

const translations = { en };
const i18nProvider = polyglotI18nProvider(locale => translations[locale], 'en');

export const I18N = () => (
    <I18nContextProvider value={i18nProvider}>
        <Wrapper>
            <SimpleFormConfigurable record={data} resource="books">
                <TextInput source="title" fullWidth />
                <TextInput source="author" />
                <NumberInput source="year" />
            </SimpleFormConfigurable>
        </Wrapper>
    </I18nContextProvider>
);
