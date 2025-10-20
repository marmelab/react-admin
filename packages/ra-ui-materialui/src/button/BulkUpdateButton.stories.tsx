import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Resource, TestMemoryRouter, useNotify } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { BulkUpdateButton } from './BulkUpdateButton';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { List, DataTable } from '../list';
import { deepmerge } from '@mui/utils';
import { defaultLightTheme } from '../theme';
import { ThemeOptions } from '@mui/material';

export default { title: 'ra-ui-materialui/button/BulkUpdateButton' };

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

const Wrapper = ({ bulkActionButtons, theme = undefined }) => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            theme={theme}
        >
            <AdminUI>
                <Resource
                    name="books"
                    list={() => (
                        <List>
                            <DataTable bulkActionButtons={bulkActionButtons}>
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
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper bulkActionButtons={<BulkUpdateButton data={{ reads: 0 }} />} />
);

export const Data = () => (
    <Wrapper
        bulkActionButtons={
            <BulkUpdateButton
                data={{
                    reads: 666,
                    title: 'Devil in the White City',
                    author: 'Erik Larson',
                }}
            />
        }
    />
);

export const Label = () => (
    <Wrapper
        bulkActionButtons={
            <BulkUpdateButton data={{ reads: 0 }} label="Reset reads" />
        }
    />
);

export const MutationMode = () => (
    <Wrapper
        bulkActionButtons={
            <>
                <BulkUpdateButton
                    label="Update Undoable"
                    data={{ reads: 0 }}
                    mutationMode="undoable"
                />
                <BulkUpdateButton
                    label="Update Optimistic"
                    data={{ reads: 0 }}
                    mutationMode="optimistic"
                />
                <BulkUpdateButton
                    label="Update Pessimistic"
                    data={{ reads: 0 }}
                    mutationMode="pessimistic"
                />
            </>
        }
    />
);

const MutationOptionsButtons = () => {
    const notify = useNotify();
    return (
        <>
            <BulkUpdateButton
                label="Update Undoable"
                data={{ reads: 0 }}
                mutationMode="undoable"
                mutationOptions={{
                    onSuccess: () => {
                        notify('Updated successfully', { undoable: true });
                    },
                }}
            />
            <BulkUpdateButton
                label="Update Optimistic"
                data={{ reads: 0 }}
                mutationMode="optimistic"
                mutationOptions={{
                    onSuccess: () => {
                        notify('Updated successfully');
                    },
                }}
            />
            <BulkUpdateButton
                label="Update Pessimistic"
                data={{ reads: 0 }}
                mutationMode="pessimistic"
                mutationOptions={{
                    onSuccess: () => {
                        notify('Updated successfully');
                    },
                }}
            />
        </>
    );
};
export const MutationOptions = () => (
    <Wrapper bulkActionButtons={<MutationOptionsButtons />} />
);

export const Themed = () => (
    <Wrapper
        bulkActionButtons={<BulkUpdateButton data={{ reads: 0 }} />}
        theme={deepmerge(defaultLightTheme, {
            components: {
                RaBulkUpdateButton: {
                    defaultProps: {
                        label: 'Bulk Update',
                        mutationMode: 'optimistic',
                        className: 'custom-class',
                        'data-testid': 'themed-button',
                    },
                },
            },
        } as ThemeOptions)}
    />
);
