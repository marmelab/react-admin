import * as React from 'react';

import {
    AuthProvider,
    CoreAdminContext,
    RecordContextProvider,
    ResourceContextProvider,
} from 'ra-core';
import { ThemeProvider, Box, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { TextField } from '../field';
import { ReferenceManyField } from './ReferenceManyField';
import { Datagrid } from '../list/datagrid/Datagrid';
import { SingleFieldList } from '../list';
import { Notification } from '../layout/Notification';
import { FilterForm } from '../list';
import { TextInput } from '../input';
import { QueryClient } from '@tanstack/react-query';

export default { title: 'ra-ui-materialui/fields/ReferenceManyField' };

const author = { id: 1, name: 'Leo Tolstoi' };
let books = [
    { id: 1, title: 'War and Peace', author_id: 1 },
    { id: 2, title: 'Les Misérables', author_id: 2 },
    { id: 3, title: 'Anna Karenina', author_id: 1 },
    { id: 4, title: 'The Count of Monte Cristo', author_id: 3 },
    { id: 5, title: 'Resurrection', author_id: 1 },
];

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
    authProvider = undefined,
    dataProvider = defaultDataProvider,
    queryClient = new QueryClient(),
    record = author,
}: any) => (
    <ThemeProvider theme={createTheme()}>
        <CoreAdminContext
            dataProvider={dataProvider}
            authProvider={authProvider}
            queryClient={queryClient}
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

export const WithFilter = () => (
    <Wrapper>
        <ReferenceManyField reference="books" target="author_id">
            <FilterForm
                filters={[<TextInput source="q" label="Search" alwaysOn />]}
            />
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

export const AccessControl = ({
    initialAuthorizedResources = {
        books: true,
        'books.title': true,
    },
}: {
    initialAuthorizedResources?: {
        books: boolean;
        'books.title': boolean;
    };
}) => {
    const queryClient = new QueryClient();
    return (
        <AdminWithAccessControl
            initialAuthorizedResources={initialAuthorizedResources}
            queryClient={queryClient}
        />
    );
};

const AdminWithAccessControl = ({
    initialAuthorizedResources,
    queryClient,
}: {
    initialAuthorizedResources: { books: boolean; 'books.title': boolean };
    queryClient: QueryClient;
}) => {
    const [authorizedResources, setAuthorizedResources] = React.useState(
        initialAuthorizedResources
    );

    const authProvider: AuthProvider = {
        canAccess: async ({ resource }) => {
            return new Promise(resolve =>
                setTimeout(resolve, 100, authorizedResources[resource])
            );
        },
        logout: () => Promise.reject(new Error('Not implemented')),
        checkError: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
        login: () => Promise.reject(new Error('Not implemented')),
    };

    return (
        <Wrapper queryClient={queryClient} authProvider={authProvider}>
            <AccessControlUI
                authorizedResources={authorizedResources}
                setAuthorizedResources={setAuthorizedResources}
                queryClient={queryClient}
            >
                <ReferenceManyField reference="books" target="author_id">
                    <Datagrid>
                        <TextField source="title" />
                    </Datagrid>
                </ReferenceManyField>
            </AccessControlUI>
        </Wrapper>
    );
};

const AccessControlUI = ({
    children,
    setAuthorizedResources,
    authorizedResources,
    queryClient,
}: {
    children: React.ReactNode;
    setAuthorizedResources: Function;
    authorizedResources: {
        books: boolean;
        'books.title': boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['books']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                books: !authorizedResources['books'],
                                'books.title':
                                    !authorizedResources['books.title'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    books access
                </label>
            </div>
            <div>{children}</div>
        </div>
    );
};

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
