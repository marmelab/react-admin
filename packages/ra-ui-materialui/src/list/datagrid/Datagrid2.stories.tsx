import * as React from 'react';
import { ResourceContextProvider, CoreAdminContext, CanAccess } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NumberField } from '../../field';

import { List } from '../List';

import { Datagrid2 } from './Datagrid2';
import { EditButton } from '../../button';

export default { title: 'ra-ui-materialui/list/Datagrid2' };

const data = {
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
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            year: 1988,
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            year: 1857,
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            year: 1954,
        },
    ],
};

const dataProvider = fakeRestDataProvider(data);

const theme = createTheme();

const Wrapper = ({ children }) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ThemeProvider theme={theme}>
            <ResourceContextProvider value="books">
                <List perPage={5} sx={{ px: 4 }}>
                    {children}
                </List>
            </ResourceContextProvider>
        </ThemeProvider>
    </CoreAdminContext>
);

export const Basic = () => (
    <Wrapper>
        <Datagrid2
            rowSx={record => (record.id === 6 ? { bgcolor: 'lightgray' } : {})}
        >
            <Datagrid2.Col source="id" align="right" label="Id" />
            <Datagrid2.Col
                source="title"
                render={record => record.title.toUpperCase()}
            />
            <Datagrid2.Col
                source="author"
                sx={{
                    color: 'darkgray',
                    '&.MuiTableCell-body': { fontStyle: 'italic' },
                    '&.MuiTableCell-head': { fontWeight: 'normal' },
                }}
                sortable={false}
            />
            <CanAccess action="read" resource="books.year">
                <Datagrid2.Col
                    source="year"
                    component={NumberField}
                    align="right"
                />
            </CanAccess>
            <Datagrid2.Col sx={{ py: 0 }}>
                <EditButton />
            </Datagrid2.Col>
        </Datagrid2>
    </Wrapper>
);
