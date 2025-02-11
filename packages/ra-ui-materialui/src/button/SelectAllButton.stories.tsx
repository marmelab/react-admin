import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Resource, TestMemoryRouter } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';

import { SelectAllButton } from './SelectAllButton';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { List, Datagrid, BulkActionsToolbar } from '../list';
import { TextField, NumberField } from '../field';
import { BulkDeleteButton } from './BulkDeleteButton';

export default { title: 'ra-ui-materialui/button/SelectAllButton' };

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
        {
            id: 12,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            reads: 123,
        },
        {
            id: 13,
            title: 'A Journey To The Centre Of The Earth',
            author: 'Jules Verne',
            reads: 98,
        },
        {
            id: 14,
            title: 'The Adventures of Sherlock Holmes',
            author: 'Arthur Conan Doyle',
            reads: 123,
        },
        {
            id: 15,
            title: 'The Odyssey',
            author: 'Homer',
            reads: 23,
        },
        {
            id: 16,
            title: 'The Brothers Karamazov',
            author: 'Fyodor Dostoevsky',
            reads: 12,
        },
        {
            id: 17,
            title: 'The Divine Comedy',
            author: 'Dante Alighieri',
            reads: 123,
        },
    ],
    authors: [],
});

const Wrapper = ({ children }) => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="books"
                    list={() => (
                        <List>
                            <Datagrid
                                bulkActionsToolbar={
                                    <BulkActionsToolbar
                                        selectAllButton={children}
                                    >
                                        <BulkDeleteButton />
                                    </BulkActionsToolbar>
                                }
                            >
                                <TextField source="id" />
                                <TextField source="title" />
                                <TextField source="author" />
                                <NumberField source="reads" />
                            </Datagrid>
                        </List>
                    )}
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <SelectAllButton />
    </Wrapper>
);

export const Label = () => (
    <Wrapper>
        <SelectAllButton label="Select all books" />
    </Wrapper>
);

export const Limit = () => (
    <Wrapper>
        <SelectAllButton label="Select all books (max 15)" limit={15} />
    </Wrapper>
);
