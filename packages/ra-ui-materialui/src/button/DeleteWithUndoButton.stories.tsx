import { Resource, TestMemoryRouter } from 'ra-core';
import { AdminContext } from '../AdminContext';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeOptions } from '@mui/material';
import { AdminUI } from '../AdminUI';
import { DeleteWithUndoButton } from './DeleteWithUndoButton';
import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import { DataTable, List } from '../list';

export default { title: 'ra-ui-materialui/button/DeleteWithUndoButton' };

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
                          message: {
                              delete_title:
                                  'Supprimer le livre "%{recordRepresentation}" ?',
                              delete_content:
                                  'Souhaitez-vous vraiment supprimer le livre "%{recordRepresentation}" ?',
                          },
                      },
                  },
              }
            : {
                  ...englishMessages,
                  resources: {
                      books: {
                          message: {
                              delete_title:
                                  'Delete the book "%{recordRepresentation}"?',
                              delete_content:
                                  'Do you really want to delete the book "%{recordRepresentation}"?',
                          },
                      },
                  },
              },
    // Default locale
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]
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
    authors: [
        { id: 1, fullName: 'Leo Tolstoy' },
        { id: 2, fullName: 'Jane Austen' },
        { id: 3, fullName: 'Oscar Wilde' },
        { id: 4, fullName: 'Antoine de Saint-Exupéry' },
        { id: 5, fullName: 'Lewis Carroll' },
        { id: 6, fullName: 'Gustave Flaubert' },
        { id: 7, fullName: 'J. R. R. Tolkien' },
        { id: 8, fullName: 'J. K. Rowling' },
        { id: 9, fullName: 'Paulo Coelho' },
        { id: 10, fullName: 'J. D. Salinger' },
        { id: 11, fullName: 'James Joyce' },
    ],
});

const BookList = ({ children }) => {
    return (
        <List>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author" />
                <DataTable.Col source="year" />
                <DataTable.Col>{children}</DataTable.Col>
            </DataTable>
        </List>
    );
};

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="books"
                    list={
                        <BookList>
                            <DeleteWithUndoButton />
                        </BookList>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const Themed = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            theme={deepmerge(createTheme(), {
                components: {
                    RaDeleteWithUndoButton: {
                        defaultProps: {
                            variant: 'outlined',
                            'data-testid': 'themed',
                        },
                        styleOverrides: {
                            root: {
                                color: 'hotpink',
                            },
                        },
                    },
                },
            } as ThemeOptions)}
        >
            <AdminUI>
                <Resource
                    name="books"
                    list={
                        <BookList>
                            <DeleteWithUndoButton />
                        </BookList>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);
