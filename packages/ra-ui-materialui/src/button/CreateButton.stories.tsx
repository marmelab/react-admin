import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import {
    AuthProvider,
    Resource,
    ResourceContextProvider,
    TestMemoryRouter,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { QueryClient } from '@tanstack/react-query';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { List } from '../list/List';
import { Datagrid } from '../list/datagrid/Datagrid';
import { TextField } from '../field/TextField';
import { Create } from '../detail/Create';
import { SimpleForm } from '../form/SimpleForm';
import { TextInput } from '../input/TextInput';
import CreateButton from './CreateButton';

export default { title: 'ra-ui-materialui/button/CreateButton' };

export const Basic = ({ buttonProps }: { buttonProps?: any }) => (
    <TestMemoryRouter>
        <AdminContext
            i18nProvider={polyglotI18nProvider(locale =>
                locale === 'fr' ? frenchMessages : englishMessages
            )}
        >
            <ResourceContextProvider value="books">
                <CreateButton {...buttonProps} />
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

export const AccessControl = () => {
    const queryClient = new QueryClient();

    return (
        <TestMemoryRouter>
            <AccessControlAdmin queryClient={queryClient} />
        </TestMemoryRouter>
    );
};

const AccessControlAdmin = ({ queryClient }: { queryClient: QueryClient }) => {
    const [resourcesAccesses, setResourcesAccesses] = React.useState({
        'books.list': true,
        'books.create': false,
    });

    const authProvider: AuthProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkError: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        canAccess: ({ resource, action }) =>
            new Promise(resolve =>
                setTimeout(
                    resolve,
                    300,
                    resourcesAccesses[`${resource}.${action}`]
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
                <Resource name="books" list={BookList} create={BookCreate} />
            </AdminUI>
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
                    checked={resourcesAccesses['books.create']}
                    onChange={e => {
                        setResourcesAccesses({
                            ...resourcesAccesses,
                            'books.create': e.target.checked,
                        });
                        queryClient.clear();
                    }}
                />
                Allow creating books
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
            </Datagrid>
        </List>
    );
};

const BookCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="year" />
        </SimpleForm>
    </Create>
);

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
