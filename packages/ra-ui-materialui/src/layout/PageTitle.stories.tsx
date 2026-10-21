import * as React from 'react';
import {
    DefaultTitleContextProvider,
    memoryStore,
    PreferencesEditorContextProvider,
    StoreContextProvider,
    TestMemoryRouter,
} from 'ra-core';
import { Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { PageTitle } from './PageTitle';
import { PageTitleConfigurable } from './PageTitleConfigurable';

export default {
    title: 'ra-ui-materialui/layout/PageTitle',
};

// With React 19, string titles also set the browser tab title
const Wrapper = ({
    appTitle,
    children,
}: {
    appTitle: string;
    children: React.ReactNode;
}) => (
    <DefaultTitleContextProvider value={appTitle}>
        <Typography variant="h6">{children}</Typography>
    </DefaultTitleContextProvider>
);

export const Basic = ({
    title = 'Books',
    appTitle = 'Book Store',
}: {
    title?: string;
    appTitle?: string;
}) => (
    <Wrapper appTitle={appTitle}>
        <PageTitle title={title} />
    </Wrapper>
);

export const DefaultTitle = ({
    defaultTitle = 'Books',
    appTitle = 'Book Store',
}: {
    defaultTitle?: string;
    appTitle?: string;
}) => (
    <Wrapper appTitle={appTitle}>
        <PageTitle defaultTitle={defaultTitle} />
    </Wrapper>
);

export const ElementTitle = ({
    defaultTitle = 'Books',
    appTitle = 'Book Store',
}: {
    defaultTitle?: string;
    appTitle?: string;
}) => (
    <Wrapper appTitle={appTitle}>
        <PageTitle
            title={
                <>
                    <MenuBookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Books
                </>
            }
            defaultTitle={defaultTitle}
        />
    </Wrapper>
);

export const TitleFromPreferences = ({
    preference = 'My Books',
    appTitle = 'Book Store',
}: {
    preference?: string;
    appTitle?: string;
}) => (
    <TestMemoryRouter>
        <StoreContextProvider
            value={memoryStore({ 'preferences.books.title': preference })}
        >
            <PreferencesEditorContextProvider>
                <Wrapper appTitle={appTitle}>
                    <PageTitleConfigurable
                        title="Books"
                        preferenceKey="books.title"
                    />
                </Wrapper>
            </PreferencesEditorContextProvider>
        </StoreContextProvider>
    </TestMemoryRouter>
);
