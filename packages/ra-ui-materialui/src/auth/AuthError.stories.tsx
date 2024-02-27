import * as React from 'react';
import { I18nContextProvider, TestMemoryRouter } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { AuthError } from './AuthError';
import { defaultTheme } from '../theme/defaultTheme';
import { createTheme, ThemeProvider } from '@mui/material';

export default { title: 'ra-ui-materialui/auth/AuthError' };

const Wrapper = ({ children }) => (
    <TestMemoryRouter>
        <ThemeProvider theme={createTheme(defaultTheme)}>
            <I18nContextProvider
                value={polyglotI18nProvider(() => englishMessages)}
            >
                {children}
            </I18nContextProvider>
        </ThemeProvider>
    </TestMemoryRouter>
);

export const Default = () => (
    <Wrapper>
        <AuthError />
    </Wrapper>
);

export const CustomError = () => (
    <Wrapper>
        <AuthError message="Custom error message" />
    </Wrapper>
);

export const CustomTitle = () => (
    <Wrapper>
        <AuthError title="Custom page title" />
    </Wrapper>
);
