import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { Resource, TestMemoryRouter } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Alert } from '@mui/material';

import { UpdateWithConfirmButton } from './UpdateWithConfirmButton';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { List, Datagrid } from '../list';
import { TextField } from '../field';

export default { title: 'ra-ui-materialui/button/UpdateWithConfirmButton' };

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
                              bulk_update_title:
                                  'Mettre à jour le livre "%{recordRepresentation}" ?',
                              bulk_update_content:
                                  'Souhaitez-vous vraiment mettre à jour le livre "%{recordRepresentation}" ?',
                          },
                      },
                  },
              }
            : {
                  ...englishMessages,
                  resources: {
                      books: {
                          message: {
                              bulk_update_title:
                                  'Update the book "%{recordRepresentation}"?',
                              bulk_update_content:
                                  'Do you really want to update the book "%{recordRepresentation}"?',
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

const i18nProviderDefault = polyglotI18nProvider(
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
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
                {children}
            </Datagrid>
        </List>
    );
};

const AuthorList = ({ children }) => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="fullName" />
                {children}
            </Datagrid>
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
                            <UpdateWithConfirmButton
                                data={{ title: 'modified' }}
                            />
                        </BookList>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithCustomTitleAndContent = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={i18nProviderDefault}
        >
            <AdminUI>
                <Resource
                    name="books"
                    list={
                        <BookList>
                            <UpdateWithConfirmButton
                                data={{ title: 'modified' }}
                                confirmTitle="Update me?"
                                confirmContent="Please confirm the update"
                            />
                        </BookList>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithDefaultTranslation = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={i18nProviderDefault}
        >
            <AdminUI>
                <Resource
                    name="books"
                    list={
                        <BookList>
                            <UpdateWithConfirmButton
                                data={{ title: 'modified' }}
                            />
                        </BookList>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const NoRecordRepresentation = () => (
    <TestMemoryRouter initialEntries={['/authors']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="authors"
                    list={
                        <AuthorList>
                            <UpdateWithConfirmButton
                                data={{ fullName: 'modified' }}
                            />
                        </AuthorList>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithCustomDialogContent = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="books"
                    list={
                        <BookList>
                            <UpdateWithConfirmButton
                                data={{ title: 'modified' }}
                                confirmTitle={
                                    <>
                                        Set <strong>title</strong>
                                    </>
                                }
                                confirmContent={
                                    <Alert severity="warning">
                                        Are you sure you want to update this
                                        book?
                                    </Alert>
                                }
                            />
                        </BookList>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);
