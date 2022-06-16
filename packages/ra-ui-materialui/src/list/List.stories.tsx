import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, useListContext } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { createMemoryHistory } from 'history';
import { Box, Card, Stack, Typography } from '@mui/material';

import { List } from './List';
import { Datagrid } from './datagrid';
import { TextField } from '../field';
import { SearchInput, TextInput } from '../input';

export default { title: 'ra-ui-materialui/list/List' };

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

const history = createMemoryHistory({ initialEntries: ['/books'] });

const BookList = () => {
    const { data, isLoading } = useListContext();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <Stack spacing={2} sx={{ padding: 2 }}>
            {data.map(book => (
                <Typography key={book.id}>
                    <i>{book.title}</i>, by {book.author} ({book.year})
                </Typography>
            ))}
        </Stack>
    );
};

const BookListBasic = () => (
    <List>
        <BookList />
    </List>
);

export const Basic = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListBasic} />
    </Admin>
);

const BookListBasicWithCustomActions = () => (
    <List actions={<Box sx={{ backgroundColor: 'info.main' }}>Actions</Box>}>
        <BookList />
    </List>
);

export const Actions = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListBasicWithCustomActions} />
    </Admin>
);

const BookListWithFilters = () => (
    <List
        filters={[
            <SearchInput source="q" alwaysOn />,
            <TextInput source="title" />,
        ]}
    >
        <BookList />
    </List>
);

export const Filters = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithFilters} />
    </Admin>
);

const BookListWithPermanentFilter = () => (
    <List filter={{ id: 2 }}>
        <BookList />
    </List>
);

export const Filter = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithPermanentFilter} />
    </Admin>
);

const BookListWithCustomTitle = () => (
    <List title="Custom list title">
        <BookList />
    </List>
);

export const Title = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithCustomTitle} />
    </Admin>
);

const BookListWithCreate = () => (
    <List hasCreate={true}>
        <BookList />
    </List>
);

export const HasCreate = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithCreate} />
    </Admin>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

const BookListWithAside = () => (
    <List aside={<AsideComponent />}>
        <BookList />
    </List>
);

export const Aside = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithAside} />
    </Admin>
);

const CustomWrapper = ({ children }) => (
    <Box
        sx={{ padding: 2, width: 200, border: 'solid 1px black' }}
        data-testid="custom-component"
    >
        {children}
    </Box>
);

const BookListWithCustomComponent = () => (
    <List component={CustomWrapper}>
        <BookList />
    </List>
);

export const Component = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithCustomComponent} />
    </Admin>
);

const EmptyAuthorList = () => (
    <List>
        <span />
    </List>
);
const CreateAuthor = () => <span />;

const historyAuthors = createMemoryHistory({ initialEntries: ['/authors'] });

export const Empty = () => (
    <Admin dataProvider={dataProvider} history={historyAuthors}>
        <Resource name="authors" list={EmptyAuthorList} create={CreateAuthor} />
    </Admin>
);

const BookListWithStyles = () => (
    <List
        sx={{
            backgroundColor: 'yellow',
            '& .RaList-content': {
                backgroundColor: 'red',
            },
        }}
    >
        <BookList />
    </List>
);

export const SX = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithStyles} />
    </Admin>
);

const dataProviderWithLog = {
    ...dataProvider,
    getList: (resource, params) => {
        console.log('getList', resource, params);
        return dataProvider.getList(resource, params);
    },
} as any;

const BookListWithMeta = () => (
    <List queryOptions={{ meta: { foo: 'bar' } }}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

export const Meta = () => (
    <Admin dataProvider={dataProviderWithLog} history={history}>
        <Resource name="books" list={BookListWithMeta} />
    </Admin>
);

const BookListWithDatagrid = () => (
    <List filters={[<SearchInput source="q" alwaysOn />]}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

export const Default = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListWithDatagrid} />
    </Admin>
);
