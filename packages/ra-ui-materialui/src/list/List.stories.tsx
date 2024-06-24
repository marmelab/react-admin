import * as React from 'react';
import { Admin, AutocompleteInput } from 'react-admin';
import {
    CustomRoutes,
    Resource,
    useListContext,
    TestMemoryRouter,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Box, Card, Stack, Typography, Button } from '@mui/material';

import { List } from './List';
import { ListActions } from './ListActions';
import { Datagrid } from './datagrid';
import { TextField } from '../field';
import { SearchInput, TextInput } from '../input';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

export default { title: 'ra-ui-materialui/list/List' };

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
        {
            id: 12,
            title: 'One Hundred Years of Solitude',
            author: 'Gabriel García Márquez',
            year: 1967,
        },
        {
            id: 13,
            title: 'Snow Country',
            author: 'Yasunari Kawabata',
            year: 1956,
        },
    ],
    authors: [],
};
const dataProvider = fakeRestDataProvider(data);

const BookList = () => {
    const { data, error, isPending } = useListContext();
    if (isPending) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
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
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListBasic} />
        </Admin>
    </TestMemoryRouter>
);

const BookListBasicWithCustomActions = () => (
    <List actions={<Box sx={{ backgroundColor: 'info.main' }}>Actions</Box>}>
        <BookList />
    </List>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListBasicWithCustomActions} />
        </Admin>
    </TestMemoryRouter>
);

const BookListWithFilters = () => (
    <List
        filters={[
            <SearchInput source="q" alwaysOn />,
            <AutocompleteInput
                source="title"
                optionValue="title"
                optionText="title"
                choices={data.books}
            />,
            <AutocompleteInput
                source="author"
                optionValue="author"
                optionText="author"
                choices={data.books}
            />,
            <TextInput source="year" />,
        ]}
    >
        <BookList />
    </List>
);

export const Filters = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListWithFilters} />
        </Admin>
    </TestMemoryRouter>
);

const BookListWithPermanentFilter = () => (
    <List filter={{ id: 2 }}>
        <BookList />
    </List>
);

export const Filter = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListWithPermanentFilter} />
        </Admin>
    </TestMemoryRouter>
);

const BookListWithCustomTitle = () => (
    <List title="Custom list title">
        <BookList />
    </List>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListWithCustomTitle} />
        </Admin>
    </TestMemoryRouter>
);

export const HasCreate = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List actions={<ListActions hasCreate />}>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

const BookListWithAside = () => (
    <List aside={<AsideComponent />}>
        <BookList />
    </List>
);

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListWithAside} />
        </Admin>
    </TestMemoryRouter>
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
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListWithCustomComponent} />
        </Admin>
    </TestMemoryRouter>
);

const EmptyAuthorList = () => (
    <List>
        <span />
    </List>
);
const CreateAuthor = () => <span />;

export const Empty = () => (
    <TestMemoryRouter initialEntries={['/authors']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="authors"
                list={EmptyAuthorList}
                create={CreateAuthor}
            />
        </Admin>
    </TestMemoryRouter>
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
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListWithStyles} />
        </Admin>
    </TestMemoryRouter>
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
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProviderWithLog}>
            <Resource name="books" list={BookListWithMeta} />
        </Admin>
    </TestMemoryRouter>
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
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" list={BookListWithDatagrid} />
        </Admin>
    </TestMemoryRouter>
);

const NewerBooks = () => (
    <List
        resource="books"
        storeKey="newerBooks"
        sort={{ field: 'year', order: 'DESC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const OlderBooks = () => (
    <List
        resource="books"
        storeKey="olderBooks"
        sort={{ field: 'year', order: 'ASC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const StoreKeyDashboard = () => (
    <>
        <Box>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/newerBooks"
                variant="contained"
            >
                See newer books
            </Button>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/olderBooks"
                variant="contained"
            >
                See older books
            </Button>
        </Box>
    </>
);

export const StoreKey = () => {
    return (
        <TestMemoryRouter initialEntries={['/']}>
            <Admin dataProvider={dataProvider} dashboard={StoreKeyDashboard}>
                <CustomRoutes>
                    <Route path="/newerBooks" element={<NewerBooks />} />
                    <Route path="/olderBooks" element={<OlderBooks />} />
                </CustomRoutes>
                <Resource name="books" />
            </Admin>
        </TestMemoryRouter>
    );
};

const BooksWithStoreEnabled = () => (
    <List
        resource="books"
        storeKey="booksStore"
        sort={{ field: 'year', order: 'DESC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const BooksWithStoreDisabled = () => (
    <List
        resource="books"
        storeKey={false}
        sort={{ field: 'year', order: 'ASC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const DisabledStoreDashboard = () => (
    <>
        <Box>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/store"
                variant="contained"
            >
                See books with store enabled
            </Button>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/nostore"
                variant="contained"
            >
                See books with store disabled
            </Button>
        </Box>
    </>
);

export const StoreDisabled = () => {
    return (
        <TestMemoryRouter initialEntries={['/']}>
            <Admin
                dataProvider={dataProvider}
                dashboard={DisabledStoreDashboard}
            >
                <CustomRoutes>
                    <Route path="/store" element={<BooksWithStoreEnabled />} />
                    <Route
                        path="/nostore"
                        element={<BooksWithStoreDisabled />}
                    />
                </CustomRoutes>
                <Resource name="books" />
            </Admin>
        </TestMemoryRouter>
    );
};

export const ErrorInFetch = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin
            dataProvider={
                {
                    getList: () =>
                        Promise.reject(new Error('Error in dataProvider')),
                } as any
            }
        >
            <Resource name="books" list={BookListBasic} />
        </Admin>
    </TestMemoryRouter>
);

export const LabelElements = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={
                    <List>
                        <Datagrid>
                            <TextField source="id" label={<span>ID</span>} />
                            <TextField
                                source="title"
                                label={<span>TITLE</span>}
                            />
                            <TextField
                                source="author"
                                label={<span>AUTHOR</span>}
                            />
                            <TextField
                                source="year"
                                label={<span>YEAR</span>}
                            />
                        </Datagrid>
                    </List>
                }
            />
        </Admin>
    </TestMemoryRouter>
);
