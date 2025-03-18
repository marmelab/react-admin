import * as React from 'react';
import { ResourceContextProvider, CoreAdminContext, CanAccess } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NumberField } from '../../field';

import { List } from '../List';

import { DataTable } from './DataTable';
import { ColumnsButton } from './ColumnsButton';
import { TopToolbar } from '../../layout';
import { EditButton } from '../../button';

export default { title: 'ra-ui-materialui/list/DataTable' };

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

const booksDataProvider = fakeRestDataProvider(data);

const theme = createTheme();

const Wrapper = ({
    children,
    dataProvider = booksDataProvider,
    resource = 'books',
    actions = (
        <TopToolbar>
            <ColumnsButton />
        </TopToolbar>
    ),
    aside = null,
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ThemeProvider theme={theme}>
            <ResourceContextProvider value={resource}>
                <List
                    perPage={5}
                    sx={{ px: 4 }}
                    actions={actions}
                    aside={aside}
                >
                    {children}
                </List>
            </ResourceContextProvider>
        </ThemeProvider>
    </CoreAdminContext>
);

export const Basic = () => (
    <Wrapper>
        <DataTable
            rowSx={record => (record.id === 6 ? { bgcolor: 'lightgray' } : {})}
        >
            <DataTable.Col source="id" label="Id" />
            <DataTable.Col
                source="title"
                render={record => record.title.toUpperCase()}
            />
            <DataTable.Col
                source="author"
                sx={{
                    color: 'darkgray',
                    '&.MuiTableCell-body': { fontStyle: 'italic' },
                    '&.MuiTableCell-head': { fontWeight: 'normal' },
                }}
                sortable={false}
            />
            <CanAccess action="read" resource="books.year">
                <DataTable.Col
                    source="year"
                    field={NumberField}
                    align="right"
                />
            </CanAccess>
            <DataTable.Col sx={{ py: 0 }}>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </Wrapper>
);

const HideMe = (_props: { children?: React.ReactNode }) => null;

export const ColumnsSelector = () => (
    <Wrapper
        dataProvider={fakeRestDataProvider({
            test: [
                {
                    col0: 'a',
                    col1: 'b',
                    col2: 'c',
                    col3: 'd',
                    col4: 'e',
                    col5: 'f',
                    col6: 'g',
                    col7: 'h',
                },
            ],
        })}
        resource="test"
        actions={null}
        aside={<ColumnsButton />}
    >
        <DataTable bulkActionButtons={false} hiddenColumns={['col7']}>
            <DataTable.Col source="col0" label="c_0" />
            <DataTable.Col source="col1" label="c_1" />
            <DataTable.Col source="col2" label="c_2" />
            <DataTable.Col source="col3" label="c_3" />
            <DataTable.Col source="col4" label="c_4" />
            <DataTable.Col source="col5" label="c_5" />
            <HideMe>
                <DataTable.Col source="col6" label="c_6" />
            </HideMe>
            <DataTable.Col source="col7" label="c_7" />
        </DataTable>
    </Wrapper>
);
