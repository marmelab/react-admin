import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { useTranslate, Resource, TestMemoryRouter } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { LocalesMenuButton } from './LocalesMenuButton';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { List, DataTable } from '../list';
import { AppBar, Layout, TitlePortal } from '../layout';

export default { title: 'ra-ui-materialui/button/LocalesMenuButton' };

const i18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? {
                  ...frenchMessages,
                  resources: {
                      books: {
                          name: 'Livre |||| Livres',
                          fields: {
                              id: 'Id',
                              title: 'Titre',
                              author: 'Auteur',
                              year: 'Année',
                          },
                      },
                  },
              }
            : englishMessages,
    'en' // Default locale
);

const Component = () => {
    const translate = useTranslate();

    return <Typography>{translate('ra.page.dashboard')}</Typography>;
};

export const Basic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <LocalesMenuButton
            languages={[
                { locale: 'en', name: 'English' },
                { locale: 'fr', name: 'Français' },
            ]}
        />
        <Component />
    </AdminContext>
);

export const CustomIcon = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <LocalesMenuButton
            languages={[
                { locale: 'en', name: 'English' },
                { locale: 'fr', name: 'Français' },
            ]}
            icon={<LanguageIcon />}
        />
        <Component />
    </AdminContext>
);

const dataProvider = fakeRestDataProvider({
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            year: 1869,
        },
        {
            id: 2,
            title: 'Pride and Predjudice',
            author: 'Jane Austen',
            year: 1813,
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
            year: 1890,
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
            year: 1943,
        },
        {
            id: 5,
            title: "Alice's Adventures in Wonderland",
            author: 'Lewis Carroll',
            year: 1865,
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            year: 1856,
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            year: 1954,
        },
        {
            id: 8,
            title: "Harry Potter and the Philosopher's Stone",
            author: 'J. K. Rowling',
            year: 1997,
        },
        {
            id: 9,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            year: 1988,
        },
        {
            id: 10,
            title: 'A Catcher in the Rye',
            author: 'J. D. Salinger',
            year: 1951,
        },
        {
            id: 11,
            title: 'Ulysses',
            author: 'James Joyce',
            year: 1922,
        },
    ],
    authors: [],
});

const BookList = () => {
    return (
        <List>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author" />
                <DataTable.Col source="year" />
            </DataTable>
        </List>
    );
};

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <LocalesMenuButton
            languages={[
                { locale: 'en', name: 'English' },
                { locale: 'fr', name: 'Français' },
            ]}
        />
    </AppBar>
);
const MyLayout = ({ children }) => (
    <Layout appBar={MyAppBar}>{children}</Layout>
);

export const FullApp = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI layout={MyLayout}>
                <Resource name="books" list={BookList} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);
