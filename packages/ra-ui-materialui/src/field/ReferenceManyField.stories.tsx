import * as React from 'react';

import {
    CoreAdminContext,
    RecordContextProvider,
    ResourceContextProvider,
    TestMemoryRouter,
} from 'ra-core';
import { Admin, ListGuesser, Resource } from 'react-admin';
import type { AdminProps } from 'react-admin';
import { ThemeProvider, Box, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import fakeDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { TextField } from '../field';
import { ReferenceManyField } from './ReferenceManyField';
import { Datagrid } from '../list/datagrid/Datagrid';
import {
    BulkActionsToolbar,
    FilterButton,
    Pagination,
    SingleFieldList,
} from '../list';
import { Notification } from '../layout/Notification';
import { FilterForm } from '../list';
import { TextInput } from '../input';
import { Edit } from '../detail';
import { SimpleForm } from '../form';
import { SelectAllButton, BulkDeleteButton } from '../button';

export default { title: 'ra-ui-materialui/fields/ReferenceManyField' };

const author = { id: 1, name: 'Leo Tolstoi' };
const authors = [
    author,
    { id: 2, name: 'Victor Hugo' },
    { id: 3, name: 'Alexandre Dumas' },
    { id: 4, name: 'J.K. Rowling' },
];
let books = [
    { id: 1, title: 'War and Peace', author_id: 1 },
    { id: 2, title: 'Les Misérables', author_id: 2 },
    { id: 3, title: 'Anna Karenina', author_id: 1 },
    { id: 4, title: 'The Count of Monte Cristo', author_id: 3 },
    { id: 5, title: 'Resurrection', author_id: 1 },
    { id: 6, title: 'The Three Musketeers', author_id: 3 },
    { id: 7, title: 'The Idiot', author_id: 1 },
    { id: 8, title: 'The Last Day of a Condemned', author_id: 1 },
    { id: 9, title: 'The Queen Margot', author_id: 3 },
    { id: 10, title: "Harry Potter and the Philosopher's Stone", author_id: 4 },
    { id: 11, title: 'Harry Potter and the Chamber of Secrets', author_id: 4 },
    { id: 12, title: 'Harry Potter and the Prisoner of Azkaban', author_id: 4 },
    { id: 13, title: 'Harry Potter and the Goblet of Fire', author_id: 4 },
    {
        id: 14,
        title: 'Harry Potter and the Order of the Phoenix',
        author_id: 4,
    },
    { id: 15, title: 'Harry Potter and the Half-Blood Prince', author_id: 4 },
    { id: 16, title: 'Harry Potter and the Deathly Hallows', author_id: 4 },
];

const fullDataProvider = fakeDataProvider(
    { books, authors },
    process.env.NODE_ENV === 'development'
);

const defaultDataProvider = {
    getManyReference: (resource, params) => {
        const result = books
            .filter(book => book.author_id === params.id)
            .filter(book =>
                params?.filter?.q
                    ? book.title
                          .toLowerCase()
                          .includes(params.filter.q.toLowerCase())
                    : true
            );
        return Promise.resolve({
            data: result,
            total: result.length,
        });
    },
    deleteMany: (resource, params) => {
        const ids = params.ids;
        books = books.filter(book => !ids.includes(book.id));
        return Promise.resolve({ data: ids });
    },
} as any;

const Wrapper = ({
    children,
    i18nProvider,
    dataProvider = defaultDataProvider,
    record = author,
}: any) => (
    <ThemeProvider theme={createTheme()}>
        <CoreAdminContext
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
        >
            <ResourceContextProvider value="authors">
                <RecordContextProvider value={record}>
                    <Box mx={2} mt={7}>
                        {children}
                    </Box>
                </RecordContextProvider>
            </ResourceContextProvider>
            <Notification />
        </CoreAdminContext>
    </ThemeProvider>
);

export const Basic = () => (
    <Wrapper>
        <ReferenceManyField reference="books" target="author_id">
            <Datagrid>
                <TextField source="title" />
            </Datagrid>
        </ReferenceManyField>
    </Wrapper>
);

export const WithSingleFieldList = () => (
    <Wrapper>
        <ReferenceManyField reference="books" target="author_id">
            <SingleFieldList sx={{ gap: 1 }}>
                <TextField source="title" />
            </SingleFieldList>
        </ReferenceManyField>
    </Wrapper>
);

const filters = [<TextInput source="q" label="Search" />];

export const WithFilter = () => (
    <Wrapper>
        <ReferenceManyField reference="books" target="author_id">
            <FilterButton filters={filters} />
            <FilterForm filters={filters} />
            <Datagrid bulkActionButtons={false}>
                <TextField source="title" />
            </Datagrid>
        </ReferenceManyField>
    </Wrapper>
);

export const WithMeta = () => (
    <Wrapper>
        <ReferenceManyField
            reference="books"
            target="author_id"
            queryOptions={{
                meta: { foo: 'bar' },
            }}
        >
            <Datagrid>
                <TextField source="title" />
            </Datagrid>
        </ReferenceManyField>
    </Wrapper>
);

export const StoreKey = () => (
    <Wrapper>
        <Stack direction="row" spacing={2}>
            <ReferenceManyField
                reference="books"
                target="author_id"
                queryOptions={{
                    meta: { foo: 'bar' },
                }}
            >
                <Datagrid>
                    <TextField source="title" />
                </Datagrid>
            </ReferenceManyField>
            <ReferenceManyField
                reference="books"
                target="author_id"
                queryOptions={{
                    meta: { foo: 'bar' },
                }}
                storeKey="custom"
            >
                <Datagrid>
                    <TextField source="title" />
                </Datagrid>
            </ReferenceManyField>
        </Stack>
    </Wrapper>
);

export const WithPagination = ({
    dataProvider = fullDataProvider,
    selectAllButton,
}: {
    dataProvider?: AdminProps['dataProvider'];
    selectAllButton?: React.ReactElement;
}) => (
    <Wrapper
        i18nProvider={polyglotI18nProvider(() => englishMessages)}
        dataProvider={dataProvider}
        record={authors[3]}
    >
        <ReferenceManyField
            reference="books"
            target="author_id"
            pagination={<Pagination />}
            perPage={5}
        >
            <Datagrid
                bulkActionsToolbar={
                    <BulkActionsToolbar selectAllButton={selectAllButton}>
                        <BulkDeleteButton />
                    </BulkActionsToolbar>
                }
            >
                <TextField source="title" />
            </Datagrid>
        </ReferenceManyField>
    </Wrapper>
);

export const WithPaginationAndSelectAllLimit = ({
    dataProvider,
    limit = 6,
}: {
    dataProvider?: AdminProps['dataProvider'];
    limit?: number;
}) => (
    <WithPagination
        selectAllButton={<SelectAllButton limit={limit} />}
        dataProvider={dataProvider}
    />
);

const AuthorEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" />
            <TextInput source="name" />
            <ReferenceManyField
                reference="books"
                target="author_id"
                pagination={<Pagination />}
                perPage={5}
            >
                <Datagrid>
                    <TextField source="title" />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);

export const FullApp = () => (
    <TestMemoryRouter initialEntries={['/authors/4']}>
        <Admin
            dataProvider={fullDataProvider}
            i18nProvider={polyglotI18nProvider(() => englishMessages)}
        >
            <Resource name="authors" list={ListGuesser} edit={AuthorEdit} />
            <Resource name="books" list={ListGuesser} />
        </Admin>
    </TestMemoryRouter>
);
