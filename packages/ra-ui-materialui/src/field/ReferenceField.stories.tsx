import * as React from 'react';
import { useState } from 'react';

import {
    CoreAdminContext,
    RecordContextProvider,
    ResourceContextProvider,
    ResourceDefinitionContextProvider,
    ListContextProvider,
    useRecordContext,
    I18nContextProvider,
    Resource,
    TestMemoryRouter,
    AuthProvider,
} from 'ra-core';

import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { ThemeProvider, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { TextField } from '../field';
import { ReferenceField } from './ReferenceField';
import { ReferenceManyCount } from './ReferenceManyCount';
import { ReferenceInput } from '../input/ReferenceInput';
import { SimpleShowLayout } from '../detail/SimpleShowLayout';
import { Datagrid } from '../list/datagrid/Datagrid';
import { AdminUI, AdminContext } from '../';
import { List } from '../list';
import { EditGuesser, ShowGuesser } from '../detail';
import { QueryClient } from '@tanstack/react-query';

export default { title: 'ra-ui-materialui/fields/ReferenceField' };

const i18nProvider = polyglotI18nProvider(
    _locale => ({
        ...englishMessages,
        resources: {
            books: {
                name: 'Books',
                fields: {
                    id: 'Id',
                    title: 'Title',
                    author: 'Author',
                    year: 'Year',
                },
                not_found: 'Not found',
            },
        },
    }),
    'en'
);

const defaultDataProvider = {
    getMany: () =>
        Promise.resolve({
            data: [{ id: 1, ISBN: '9780393966473', genre: 'novel' }],
        }),
} as any;
const defaultRecord = { id: 1, title: 'War and Peace', detail_id: 1 };
const defaultResourceDefinitions = {
    book_details: {
        name: 'book_details',
        hasShow: true,
        hasEdit: true,
    },
};

const Wrapper = ({
    children,
    dataProvider = defaultDataProvider,
    record = defaultRecord,
    resourceDefinitions = defaultResourceDefinitions,
}: any) => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdminContext dataProvider={dataProvider}>
            <ResourceDefinitionContextProvider
                definitions={resourceDefinitions}
            >
                <ResourceContextProvider value="books">
                    <RecordContextProvider value={record}>
                        {children}
                    </RecordContextProvider>
                </ResourceContextProvider>
            </ResourceDefinitionContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

const slowDataProvider = {
    getMany: () =>
        new Promise(resolve => {
            setTimeout(
                () => resolve({ data: [{ id: 1, ISBN: '9780393966473' }] }),
                1500
            );
        }),
} as any;

export const Loading = () => (
    <Wrapper dataProvider={slowDataProvider}>
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const MissingReferenceId = () => (
    <Wrapper record={{ id: 1, title: 'War and Peace' }}>
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const MissingReferenceIdEmptyText = () => (
    <Wrapper record={{ id: 1, title: 'War and Peace' }}>
        <ReferenceField
            source="detail_id"
            reference="book_details"
            emptyText="no detail"
        >
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const MissingReferenceIdEmptyTextTranslation = () => (
    <Wrapper record={{ id: 1, title: 'War and Peace' }}>
        <I18nContextProvider value={i18nProvider}>
            <ReferenceField
                source="detail_id"
                reference="book_details"
                emptyText="resources.books.not_found"
            >
                <TextField source="ISBN" />
            </ReferenceField>
        </I18nContextProvider>
    </Wrapper>
);

const missingReferenceDataProvider = {
    getMany: () =>
        Promise.resolve({
            data: [],
        }),
} as any;

export const MissingReference = () => (
    <Wrapper dataProvider={missingReferenceDataProvider}>
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const MissingReferenceEmptyText = () => (
    <Wrapper dataProvider={missingReferenceDataProvider}>
        <ReferenceField
            source="detail_id"
            reference="book_details"
            emptyText="no detail"
        >
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const LinkShow = () => (
    <Wrapper>
        <ReferenceField source="detail_id" reference="book_details" link="show">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const LinkMissingView = () => (
    <Wrapper
        resourceDefinitions={{
            book_details: {
                name: 'book_details',
                hasShow: false,
            },
        }}
    >
        <ReferenceField source="detail_id" reference="book_details" link="show">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const LinkFalse = () => (
    <Wrapper>
        <ReferenceField
            source="detail_id"
            reference="book_details"
            link={false}
        >
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const LinkDefaultEditView = () => (
    <Wrapper
        resourceDefinitions={{
            book_details: {
                name: 'book_details',
                hasEdit: true,
            },
        }}
    >
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const LinkDefaultShowView = () => (
    <Wrapper
        resourceDefinitions={{
            book_details: {
                name: 'book_details',
                hasShow: true,
            },
        }}
    >
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const LinkDefaultNoDetailView = () => (
    <Wrapper
        resourceDefinitions={{
            book_details: {
                name: 'book_details',
                hasShow: false,
                hasEdit: false,
            },
        }}
    >
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const Children = () => (
    <Wrapper>
        <ReferenceField
            source="detail_id"
            reference="book_details"
            link={false}
        >
            <TextField source="ISBN" />
            <TextField source="genre" />
        </ReferenceField>
    </Wrapper>
);

export const Multiple = () => {
    const [calls, setCalls] = useState<any>([]);
    const dataProviderWithLogging = {
        getMany: (resource, params) => {
            setCalls(calls =>
                calls.concat({ type: 'getMany', resource, params })
            );
            return Promise.resolve({
                data: [
                    {
                        id: 1,
                        ISBN: '9780393966473',
                        genre: 'novel',
                    },
                    {
                        id: 2,
                        ISBN: '9780140430721',
                        genre: 'novel',
                    },
                ],
            });
        },
    } as any;
    return (
        <Wrapper dataProvider={dataProviderWithLogging}>
            <div style={{ display: 'flex', paddingLeft: '1em' }}>
                <div>
                    <h2>Book1</h2>
                    <RecordContextProvider
                        value={{ id: 1, title: 'War and Peace', detail_id: 1 }}
                    >
                        <p>
                            Title: <TextField source="title" />
                        </p>
                        <p>
                            ISBN:
                            <ReferenceField
                                source="detail_id"
                                reference="book_details"
                            >
                                <TextField source="ISBN" />
                            </ReferenceField>
                        </p>
                    </RecordContextProvider>
                    <h2>Book2</h2>
                    <h3>Title</h3>
                    <RecordContextProvider
                        value={{
                            id: 2,
                            title: 'Pride and Prejudice',
                            detail_id: 2,
                        }}
                    >
                        <p>
                            Title: <TextField source="title" />
                        </p>
                        <p>
                            ISBN:
                            <ReferenceField
                                source="detail_id"
                                reference="book_details"
                            >
                                <TextField source="ISBN" />
                            </ReferenceField>
                        </p>
                    </RecordContextProvider>
                </div>
                <div style={{ color: '#ccc', paddingLeft: '2em' }}>
                    <p>Number of calls: {calls.length}</p>
                    <pre>{JSON.stringify(calls, null, 2)}</pre>
                </div>
            </div>
        </Wrapper>
    );
};

export const InShowLayout = () => (
    <Wrapper>
        <SimpleShowLayout>
            <TextField source="title" />
            <ReferenceField
                label="ISBN"
                source="detail_id"
                reference="book_details"
            >
                <TextField source="ISBN" />
            </ReferenceField>
        </SimpleShowLayout>
    </Wrapper>
);

const ListWrapper = ({ children }) => (
    <ThemeProvider theme={createTheme()}>
        <Wrapper>
            <ListContextProvider
                value={
                    {
                        total: 1,
                        data: [{ id: 1, title: 'War and Peace', detail_id: 1 }],
                        sort: { field: 'title', order: 'ASC' },
                    } as any
                }
            >
                {children}
            </ListContextProvider>
        </Wrapper>
    </ThemeProvider>
);

export const InDatagrid = () => (
    <ListWrapper>
        <Datagrid>
            <TextField source="title" />
            <ReferenceField
                label="ISBN"
                source="detail_id"
                reference="book_details"
            >
                <TextField source="ISBN" />
            </ReferenceField>
        </Datagrid>
    </ListWrapper>
);

export const SXLink = () => (
    <Wrapper>
        <ReferenceField
            source="detail_id"
            reference="book_details"
            link="show"
            sx={{ bgcolor: 'red' }}
        >
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const SXNoLink = () => (
    <Wrapper>
        <ReferenceField
            source="detail_id"
            reference="book_details"
            link={false}
            sx={{ bgcolor: 'red' }}
        >
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

const BookDetailsRepresentation = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <>
            <strong>Genre</strong>: {record.genre}, <strong>ISBN</strong>:{' '}
            {record.ISBN}
        </>
    );
};
export const RecordRepresentation = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdminContext dataProvider={defaultDataProvider}>
            <ResourceContextProvider value="books">
                <RecordContextProvider value={defaultRecord}>
                    <Stack spacing={4} direction="row" sx={{ ml: 2 }}>
                        <div>
                            <h3>Default</h3>
                            <ReferenceField
                                source="detail_id"
                                reference="book_details"
                            />
                        </div>
                        <div>
                            <ResourceDefinitionContextProvider
                                definitions={{
                                    book_details: {
                                        name: 'book_details',
                                        recordRepresentation: 'ISBN',
                                        hasEdit: true,
                                    },
                                }}
                            >
                                <h3>String</h3>
                                <ReferenceField
                                    source="detail_id"
                                    reference="book_details"
                                />
                            </ResourceDefinitionContextProvider>
                        </div>
                        <div>
                            <ResourceDefinitionContextProvider
                                definitions={{
                                    book_details: {
                                        name: 'book_details',
                                        recordRepresentation: record =>
                                            `Genre: ${record.genre}, ISBN: ${record.ISBN}`,
                                        hasEdit: true,
                                    },
                                }}
                            >
                                <h3>Function</h3>
                                <ReferenceField
                                    source="detail_id"
                                    reference="book_details"
                                />
                            </ResourceDefinitionContextProvider>
                        </div>
                        <div>
                            <ResourceDefinitionContextProvider
                                definitions={{
                                    book_details: {
                                        name: 'book_details',
                                        recordRepresentation: (
                                            <BookDetailsRepresentation />
                                        ),
                                        hasEdit: true,
                                    },
                                }}
                            >
                                <h3>Element</h3>
                                <ReferenceField
                                    source="detail_id"
                                    reference="book_details"
                                />
                            </ResourceDefinitionContextProvider>
                        </div>
                    </Stack>
                </RecordContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

const relationalDataProvider = fakeRestDataProvider(
    {
        books: [
            {
                id: 1,
                title: 'War and Peace',
                authorId: 1,
                year: 1869,
            },
            {
                id: 2,
                title: 'Anna Karenina',
                authorId: 1,
                year: 1877,
            },
            {
                id: 3,
                title: 'Pride and Predjudice',
                authorId: 2,
                year: 1813,
            },
            {
                id: 4,
                authorId: 2,
                title: 'Sense and Sensibility',
                year: 1811,
            },
            {
                id: 5,
                title: 'The Picture of Dorian Gray',
                authorId: 3,
                year: 1890,
            },
            {
                id: 6,
                title: 'Le Petit Prince',
                authorId: 4,
                year: 1943,
            },
            {
                id: 7,
                title: "Alice's Adventures in Wonderland",
                authorId: 5,
                year: 1865,
            },
            {
                id: 8,
                title: 'Madame Bovary',
                authorId: 6,
                year: 1856,
            },
            { id: 9, title: 'The Hobbit', authorId: 7, year: 1937 },
            {
                id: 10,
                title: 'The Lord of the Rings',
                authorId: 7,
                year: 1954,
            },
            {
                id: 11,
                title: "Harry Potter and the Philosopher's Stone",
                authorId: 8,
                year: 1997,
            },
            {
                id: 12,
                title: 'The Alchemist',
                authorId: 9,
                year: 1988,
            },
            {
                id: 13,
                title: 'A Catcher in the Rye',
                authorId: 10,
                year: 1951,
            },
            {
                id: 14,
                title: 'Ulysses',
                authorId: 11,
                year: 1922,
            },
        ],
        authors: [
            { id: 1, firstName: 'Leo', lastName: 'Tolstoy' },
            { id: 2, firstName: 'Jane', lastName: 'Austen' },
            { id: 3, firstName: 'Oscar', lastName: 'Wilde' },
            { id: 4, firstName: 'Antoine', lastName: 'de Saint-Exupéry' },
            { id: 5, firstName: 'Lewis', lastName: 'Carroll' },
            { id: 6, firstName: 'Gustave', lastName: 'Flaubert' },
            { id: 7, firstName: 'J. R. R.', lastName: 'Tolkien' },
            { id: 8, firstName: 'J. K.', lastName: 'Rowling' },
            { id: 9, firstName: 'Paulo', lastName: 'Coelho' },
            { id: 10, firstName: 'J. D.', lastName: 'Salinger' },
            { id: 11, firstName: 'James', lastName: 'Joyce' },
        ],
    },
    process.env.NODE_ENV === 'development'
);

const bookListFilters = [
    <ReferenceInput source="authorId" reference="authors" alwaysOn />,
];

const BookList = () => (
    <List filters={bookListFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceField source="authorId" reference="authors" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const AuthorList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <ReferenceManyCount
                label="Nb books"
                reference="books"
                target="authorId"
                link
            />
        </Datagrid>
    </List>
);

export const FullApp = () => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={relationalDataProvider}
            i18nProvider={i18nProvider}
        >
            <AdminUI>
                <Resource name="books" list={BookList} edit={EditGuesser} />
                <Resource
                    name="authors"
                    recordRepresentation={record =>
                        `${record.firstName} ${record.lastName}`
                    }
                    list={AuthorList}
                    edit={EditGuesser}
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const SlowAccessControl = ({
    allowedAction = 'show',
    authProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.reject(new Error('Not implemented')),
        getPermissions: () => Promise.resolve(undefined),
        canAccess: ({ action, resource }) =>
            new Promise(resolve => {
                setTimeout(
                    resolve,
                    1000,
                    resource === 'books' ||
                        (allowedAction && action === allowedAction)
                );
            }),
    },
}: {
    authProvider?: AuthProvider;
    allowedAction?: 'show' | 'edit';
}) => (
    <TestMemoryRouter key={allowedAction}>
        <AdminContext
            authProvider={authProvider}
            dataProvider={relationalDataProvider}
        >
            <AdminUI>
                <Resource name="books" list={BookList} />
                <Resource
                    name="authors"
                    recordRepresentation={record =>
                        `${record.firstName} ${record.lastName}`
                    }
                    list={AuthorList}
                    edit={EditGuesser}
                    show={ShowGuesser}
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

SlowAccessControl.argTypes = {
    allowedAction: {
        options: ['show', 'edit', 'none'],
        mapping: {
            show: 'show',
            edit: 'edit',
            none: 'invalid',
        },
        control: { type: 'select' },
    },
};

export const AccessControl = () => (
    <TestMemoryRouter>
        <AccessControlAdmin queryClient={new QueryClient()} />
    </TestMemoryRouter>
);

const AccessControlAdmin = ({
    authProviderDelay = 300,
    queryClient,
}: {
    authProviderDelay?: number;
    queryClient: QueryClient;
}) => {
    const [authorizedResources, setAuthorizedResources] = React.useState({
        'authors.list': true,
        'authors.edit': true,
        'authors.show': true,
        'books.list': true,
        'books.edit': true,
        'books.show': true,
        'books.delete': true,
    });

    const authProvider: AuthProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.reject(new Error('Not implemented')),
        getPermissions: () => Promise.resolve(undefined),
        canAccess: ({ action, resource }) =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(authorizedResources[`${resource}.${action}`]);
                }, authProviderDelay);
            }),
    };
    return (
        <AdminContext
            authProvider={authProvider}
            dataProvider={relationalDataProvider}
            queryClient={queryClient}
        >
            <AdminUI
                layout={({ children }) => (
                    <AccessControlUI
                        queryClient={queryClient}
                        authorizedResources={authorizedResources}
                        setAuthorizedResources={setAuthorizedResources}
                    >
                        {children}
                    </AccessControlUI>
                )}
            >
                <Resource name="books" list={BookList} />
                <Resource
                    name="authors"
                    recordRepresentation={record =>
                        `${record.firstName} ${record.lastName}`
                    }
                    list={AuthorList}
                    edit={EditGuesser}
                    show={ShowGuesser}
                />
            </AdminUI>
        </AdminContext>
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
        'authors.list': boolean;
        'authors.edit': boolean;
        'authors.show': boolean;
        'books.edit': boolean;
        'books.show': boolean;
        'books.list': boolean;
        'books.delete': boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            {children}
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['authors.edit']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'authors.edit':
                                    !authorizedResources['authors.edit'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    authors.edit access
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['authors.show']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                'authors.show':
                                    !authorizedResources['authors.show'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    authors.show access
                </label>
            </div>
        </div>
    );
};

export const Nested = () => (
    <TestMemoryRouter initialEntries={['/comments/1/show']}>
        <CoreAdminContext
            dataProvider={
                {
                    getMany: async resource => {
                        if (resource === 'posts') {
                            await new Promise(resolve =>
                                setTimeout(resolve, 1000)
                            );
                            return { data: [{ id: 2, author_id: 3 }] };
                        }
                        if (resource === 'authors') {
                            await new Promise(resolve =>
                                setTimeout(resolve, 1000)
                            );
                            return { data: [{ id: 3, name: 'John Doe' }] };
                        }
                        throw new Error(`Unknown resource ${resource}`);
                    },
                } as any
            }
        >
            <ResourceDefinitionContextProvider
                definitions={{
                    books: {
                        name: 'books',
                        hasShow: true,
                        hasEdit: true,
                    },
                    posts: {
                        name: 'posts',
                        hasShow: true,
                        hasEdit: true,
                    },
                    authors: {
                        name: 'books',
                        hasShow: true,
                        hasEdit: true,
                    },
                }}
            >
                <ResourceContextProvider value="comments">
                    <RecordContextProvider value={{ id: 1, post_id: 2 }}>
                        <ReferenceField source="post_id" reference="posts">
                            <ReferenceField
                                source="author_id"
                                reference="authors"
                            />
                        </ReferenceField>
                    </RecordContextProvider>
                </ResourceContextProvider>
            </ResourceDefinitionContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);
