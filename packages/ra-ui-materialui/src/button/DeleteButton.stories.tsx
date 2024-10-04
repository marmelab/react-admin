import * as React from 'react';
import { colors, createTheme, Alert } from '@mui/material';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { QueryClient } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    AuthProvider,
    Resource,
    ResourceContextProvider,
    TestMemoryRouter,
} from 'ra-core';
import { AdminContext } from '../AdminContext';
import { DeleteButton } from './DeleteButton';
import { List } from '../list/List';
import { Datagrid } from '../list/datagrid/Datagrid';
import { TextField } from '../field/TextField';
import { AdminUI } from '../AdminUI';
import { Notification } from '../layout';

const theme = createTheme({
    palette: {
        primary: {
            light: colors.orange[100],
            main: colors.orange[500],
            contrastText: colors.grey[50],
        },
        error: {
            main: colors.orange[500],
        },
    },
});

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en'
);

export default { title: 'ra-ui-materialui/button/DeleteButton' };

export const Basic = () => (
    <AdminContext>
        <ResourceContextProvider value="posts">
            <DeleteButton label="Delete" record={{ id: 1 }} />
        </ResourceContextProvider>
    </AdminContext>
);

export const Pessimistic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <DeleteButton
                mutationMode="pessimistic"
                record={{ id: 1 }}
                label="Delete"
            />
        </ResourceContextProvider>
    </AdminContext>
);

export const PessimisticWithCustomDialogContent = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <ResourceContextProvider value="posts">
            <DeleteButton
                mutationMode="pessimistic"
                record={{ id: 1 }}
                label="Delete"
                confirmTitle={
                    <>
                        Delete <strong>Full Name</strong>
                    </>
                }
                confirmContent={
                    <Alert severity="warning">
                        Are you sure you want to delete this user?
                    </Alert>
                }
            />
        </ResourceContextProvider>
    </AdminContext>
);

export const WithUserDefinedPalette = () => (
    <AdminContext theme={theme}>
        <ResourceContextProvider value="posts">
            <DeleteButton label="Delete" record={{ id: 1 }} />
        </ResourceContextProvider>
    </AdminContext>
);

export const ContainedWithUserDefinedPalette = () => (
    <AdminContext theme={theme}>
        <ResourceContextProvider value="posts">
            <DeleteButton
                variant="contained"
                color="primary"
                label="Delete"
                record={{ id: 1 }}
            />
        </ResourceContextProvider>
    </AdminContext>
);

export const FullApp = () => {
    const queryClient = new QueryClient();

    return (
        <TestMemoryRouter>
            <FullAppAdmin queryClient={queryClient} />
        </TestMemoryRouter>
    );
};

const FullAppAdmin = ({ queryClient }: { queryClient: QueryClient }) => {
    const [resourcesAccesses, setResourcesAccesses] = React.useState({
        'books.list': true,
        'books.create': true,
        'books.edit': false,
        'books.delete': false,
        'books.delete.1': false,
    });

    const authProvider: AuthProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkError: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        canAccess: ({ resource, action, record }) =>
            new Promise(resolve =>
                setTimeout(
                    resolve,
                    300,
                    resourcesAccesses[
                        `${resource}.${action}${record && record.id === 1 ? `.${record.id}` : ''}`
                    ]
                )
            ),
        getPermissions: () => Promise.resolve(undefined),
    };

    return (
        <AdminContext
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={polyglotI18nProvider(locale =>
                locale === 'fr' ? frenchMessages : englishMessages
            )}
            queryClient={queryClient}
        >
            <AdminUI
                layout={({ children }) => (
                    <AccessControlLayout
                        resourcesAccesses={resourcesAccesses}
                        setResourcesAccesses={setResourcesAccesses}
                        queryClient={queryClient}
                    >
                        {children}
                    </AccessControlLayout>
                )}
            >
                <Resource name="books" list={BookList} />
            </AdminUI>
        </AdminContext>
    );
};

export const NotificationDefault = () => {
    const dataProvider = {
        delete: () => Promise.resolve({ data: { id: 1 } }),
    } as any;
    return (
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <DeleteButton record={{ id: 1 }} resource="books" />
            <Notification />
        </AdminContext>
    );
};

const AccessControlLayout = ({
    children,
    resourcesAccesses,
    setResourcesAccesses,
    queryClient,
}: {
    children: React.ReactNode;
    resourcesAccesses: {
        'books.list': boolean;
        'books.create': boolean;
        'books.edit': boolean;
        'books.delete': boolean;
        'books.delete.1': boolean;
    };
    setResourcesAccesses: (resourcesAccesses: any) => void;
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>{children}</div>
            <hr />
            <label>
                <input
                    type="checkbox"
                    checked={resourcesAccesses['books.delete']}
                    onChange={e => {
                        setResourcesAccesses({
                            ...resourcesAccesses,
                            'books.delete': e.target.checked,
                        });
                        queryClient.clear();
                    }}
                />
                Allow deleting books
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={resourcesAccesses['books.delete.1']}
                    onChange={e => {
                        setResourcesAccesses({
                            ...resourcesAccesses,
                            'books.delete.1': e.target.checked,
                        });
                        queryClient.clear();
                    }}
                />
                Allow deleting War and Peace
            </label>
        </div>
    );
};

const BookList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
                <DeleteButton />
            </Datagrid>
        </List>
    );
};

const dataProvider = fakeRestDataProvider(
    {
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
    },
    process.env.NODE_ENV === 'development'
);

export const NotificationTranslated = () => {
    const dataProvider = {
        delete: () => Promise.resolve({ data: { id: 1 } }),
    } as any;
    return (
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={polyglotI18nProvider(
                () => ({
                    ...englishMessages,
                    resources: {
                        books: { notifications: { deleted: 'Book deleted' } },
                    },
                }),
                'en'
            )}
        >
            <DeleteButton record={{ id: 1 }} resource="books" />
            <Notification />
        </AdminContext>
    );
};

export const SuccessMessage = () => {
    const dataProvider = {
        delete: () => Promise.resolve({ data: { id: 1 } }),
    } as any;
    return (
        <AdminContext dataProvider={dataProvider}>
            <DeleteButton
                record={{ id: 1 }}
                resource="post"
                successMessage="Post deleted!"
            />
            <Notification />
        </AdminContext>
    );
};
