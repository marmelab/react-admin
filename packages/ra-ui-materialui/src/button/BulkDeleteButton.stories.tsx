import React from 'react';
import { ThemeOptions } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { Resource } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import { AdminContext } from '../AdminContext';
import { BulkDeleteButton } from './BulkDeleteButton';
import { defaultLightTheme } from '../theme';
import { DataTable, List } from '../list';
import { AdminUI } from '../AdminUI';

export default { title: 'ra-ui-materialui/button/BulkDeleteButton' };

const i18nProvider = polyglotI18nProvider(
    () => englishMessages,
    'en' // Default locale
);

const dataProvider = fakeRestDataProvider({
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            reads: 23,
        },
        {
            id: 2,
            title: 'Pride and Predjudice',
            author: 'Jane Austen',
            reads: 854,
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
            reads: 126,
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
            reads: 86,
        },
        {
            id: 5,
            title: "Alice's Adventures in Wonderland",
            author: 'Lewis Carroll',
            reads: 125,
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            reads: 452,
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            reads: 267,
        },
        {
            id: 8,
            title: "Harry Potter and the Philosopher's Stone",
            author: 'J. K. Rowling',
            reads: 1294,
        },
        {
            id: 9,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            reads: 23,
        },
        {
            id: 10,
            title: 'A Catcher in the Rye',
            author: 'J. D. Salinger',
            reads: 209,
        },
        {
            id: 11,
            title: 'Ulysses',
            author: 'James Joyce',
            reads: 12,
        },
    ],
    authors: [],
});

const Wrapper = ({ children, ...props }) => {
    return (
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            {...props}
        >
            <AdminUI>
                <Resource
                    name="books"
                    list={() => (
                        <List>
                            <DataTable bulkActionButtons={children}>
                                <DataTable.Col source="id" />
                                <DataTable.Col source="title" />
                                <DataTable.Col source="author" />
                                <DataTable.NumberCol source="reads" />
                            </DataTable>
                        </List>
                    )}
                />
            </AdminUI>
        </AdminContext>
    );
};

export const Basic = () => {
    return (
        <Wrapper>
            <BulkDeleteButton />
        </Wrapper>
    );
};

export const Themed = () => {
    return (
        <Wrapper
            theme={deepmerge(defaultLightTheme, {
                components: {
                    RaBulkDeleteButton: {
                        defaultProps: {
                            label: 'Bulk Delete',
                            mutationMode: 'optimistic',
                            className: 'custom-class',
                            'data-testid': 'themed',
                        },
                    },
                },
            } as ThemeOptions)}
        >
            <BulkDeleteButton />
        </Wrapper>
    );
};
