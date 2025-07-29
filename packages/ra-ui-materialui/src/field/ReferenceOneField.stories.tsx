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
    TestMemoryRouter,
    Resource,
    useIsOffline,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { createTheme, Stack, ThemeOptions } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { onlineManager } from '@tanstack/react-query';

import {
    ReferenceOneField,
    ReferenceField,
    ReferenceInput,
    AdminContext,
    AdminUI,
    CreateButton,
    Create,
    List,
    Show,
    SimpleShowLayout,
    SimpleForm,
    DataTable,
    TextField,
    TextInput,
} from '..';
import { defaultLightTheme, ThemeProvider, ThemesContext } from '../theme';

export default { title: 'ra-ui-materialui/fields/ReferenceOneField' };

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
    getManyReference: () =>
        Promise.resolve({
            data: [{ id: 1, ISBN: '9780393966473', genre: 'novel' }],
            total: 1,
        }),
} as any;

const Wrapper = ({
    children,
    dataProvider = defaultDataProvider,
    theme = defaultLightTheme,
}) => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <ThemesContext.Provider
            value={{
                lightTheme: theme,
            }}
        >
            <ThemeProvider>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ResourceContextProvider value="books">
                        <RecordContextProvider
                            value={{ id: 1, title: 'War and Peace' }}
                        >
                            {children}
                        </RecordContextProvider>
                    </ResourceContextProvider>
                </CoreAdminContext>
            </ThemeProvider>
        </ThemesContext.Provider>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <ReferenceOneField reference="book_details" target="book_id">
            <TextField source="ISBN" />
        </ReferenceOneField>
    </Wrapper>
);

const slowDataProvider = {
    getManyReference: () =>
        new Promise(resolve => {
            setTimeout(
                () =>
                    resolve({
                        data: [{ id: 1, ISBN: '9780393966473' }],
                        total: 1,
                    }),
                1500
            );
        }),
} as any;

export const Loading = () => (
    <Wrapper dataProvider={slowDataProvider}>
        <ReferenceOneField reference="book_details" target="book_id">
            <TextField source="ISBN" />
        </ReferenceOneField>
    </Wrapper>
);

const emptyDataProvider = {
    getManyReference: () =>
        Promise.resolve({
            data: [],
            total: 0,
        }),
} as any;

const dataProvider = fakeRestDataProvider({
    book_details: [],
    books: [
        {
            id: 1,
            title: 'War and Peace',
            year: 1869,
            Genre: 'Historical',
        },
        {
            id: 2,
            title: 'Anna Karenina',
            year: 1877,
            Genre: 'Romance',
        },
        {
            id: 3,
            title: 'The Death of Ivan Ilyich',
            year: 1886,
            Genre: 'Philosophical',
        },
    ],
});

export const EmptyText = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="books"
                    list={() => (
                        <List>
                            <DataTable>
                                <DataTable.Col source="id" />
                                <DataTable.Col source="title" />
                                <DataTable.Col source="year" />
                                <DataTable.Col source="Genre" />
                                <DataTable.Col label="ISBN">
                                    <ReferenceOneField
                                        reference="book_details"
                                        target="book_id"
                                        emptyText="no detail"
                                    >
                                        <TextField source="ISBN" />
                                    </ReferenceOneField>
                                </DataTable.Col>
                            </DataTable>
                        </List>
                    )}
                    show={() => (
                        <Show>
                            <SimpleShowLayout>
                                <TextField source="id" />
                                <TextField source="title" />
                                <TextField source="year" />
                                <TextField source="Genre" />
                                <ReferenceOneField
                                    reference="book_details"
                                    target="book_id"
                                    label="ISBN"
                                    emptyText={
                                        <CreateButton to="/book_details/create" />
                                    }
                                >
                                    <TextField source="ISBN" />
                                </ReferenceOneField>
                            </SimpleShowLayout>
                        </Show>
                    )}
                />
                <Resource
                    name="book_details"
                    list={() => (
                        <List>
                            <DataTable>
                                <DataTable.Col source="id" />
                                <DataTable.Col source="ISBN" />
                                <DataTable.Col source="book_id">
                                    <ReferenceField
                                        source="book_id"
                                        reference="books"
                                    />
                                </DataTable.Col>
                            </DataTable>
                        </List>
                    )}
                    create={() => (
                        <Create>
                            <SimpleForm>
                                <TextInput source="ISBN" />
                                <ReferenceInput
                                    source="book_id"
                                    reference="books"
                                    label="Book"
                                />
                            </SimpleForm>
                        </Create>
                    )}
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const EmptyTextWithTranslate = () => (
    <Wrapper dataProvider={emptyDataProvider}>
        <I18nContextProvider value={i18nProvider}>
            <ReferenceOneField
                reference="book_details"
                target="book_id"
                emptyText="resources.books.not_found"
            >
                <TextField source="ISBN" />
            </ReferenceOneField>
        </I18nContextProvider>
    </Wrapper>
);

export const Empty = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="books"
                    list={() => (
                        <List>
                            <DataTable>
                                <DataTable.Col source="id" />
                                <DataTable.Col source="title" />
                                <DataTable.Col source="year" />
                                <DataTable.Col source="Genre" />
                                <DataTable.Col label="ISBN">
                                    <ReferenceOneField
                                        reference="book_details"
                                        target="book_id"
                                        empty="no detail"
                                    >
                                        <TextField source="ISBN" />
                                    </ReferenceOneField>
                                </DataTable.Col>
                            </DataTable>
                        </List>
                    )}
                    show={() => (
                        <Show>
                            <SimpleShowLayout>
                                <TextField source="id" />
                                <TextField source="title" />
                                <TextField source="year" />
                                <TextField source="Genre" />
                                <ReferenceOneField
                                    reference="book_details"
                                    target="book_id"
                                    label="ISBN"
                                    empty={
                                        <CreateButton to="/book_details/create" />
                                    }
                                >
                                    <TextField source="ISBN" />
                                </ReferenceOneField>
                            </SimpleShowLayout>
                        </Show>
                    )}
                />
                <Resource
                    name="book_details"
                    list={() => (
                        <List>
                            <DataTable>
                                <DataTable.Col source="id" />
                                <DataTable.Col source="ISBN" />
                                <DataTable.Col source="book_id">
                                    <ReferenceField
                                        source="book_id"
                                        reference="books"
                                    />
                                </DataTable.Col>
                            </DataTable>
                        </List>
                    )}
                    create={() => (
                        <Create>
                            <SimpleForm>
                                <TextInput source="ISBN" />
                                <ReferenceInput
                                    source="book_id"
                                    reference="books"
                                    label="Book"
                                />
                            </SimpleForm>
                        </Create>
                    )}
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const EmptyWithTranslate = () => (
    <Wrapper dataProvider={emptyDataProvider}>
        <I18nContextProvider value={i18nProvider}>
            <ReferenceOneField
                reference="book_details"
                target="book_id"
                empty="resources.books.not_found"
            >
                <TextField source="ISBN" />
            </ReferenceOneField>
        </I18nContextProvider>
    </Wrapper>
);

export const Link = () => (
    <Wrapper>
        <ReferenceOneField
            reference="book_details"
            target="book_id"
            link="show"
        >
            <TextField source="ISBN" />
        </ReferenceOneField>
    </Wrapper>
);

export const Multiple = () => {
    const [calls, setCalls] = useState<any>([]);
    const dataProviderWithLogging = {
        getManyReference: (resource, params) => {
            setCalls(calls =>
                calls.concat({ type: 'getManyReference', resource, params })
            );
            return Promise.resolve({
                data: [
                    {
                        id: 1,
                        ISBN: '9780393966473',
                        genre: 'novel',
                    },
                ],
                total: 1,
            });
        },
    } as any;
    return (
        <Wrapper dataProvider={dataProviderWithLogging}>
            <div style={{ display: 'flex', paddingLeft: '1em' }}>
                <div>
                    <h3>Title</h3>
                    <TextField source="title" />
                    <h3>ISBN</h3>
                    <ReferenceOneField
                        reference="book_details"
                        target="book_id"
                    >
                        <TextField source="ISBN" />
                    </ReferenceOneField>
                    <h3>Genre</h3>
                    <ReferenceOneField
                        reference="book_details"
                        target="book_id"
                    >
                        <TextField source="genre" />
                    </ReferenceOneField>
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
            <ReferenceOneField
                label="ISBN"
                reference="book_details"
                target="book_id"
            >
                <TextField source="ISBN" />
            </ReferenceOneField>
        </SimpleShowLayout>
    </Wrapper>
);

const ListWrapper = ({ children }) => (
    <Wrapper>
        <ListContextProvider
            value={
                {
                    total: 1,
                    data: [{ id: 1, title: 'War and Peace' }],
                    sort: { field: 'id', order: 'ASC' },
                    setSort: () => {},
                } as any
            }
        >
            {children}
        </ListContextProvider>
    </Wrapper>
);

export const InDatagrid = () => (
    <ListWrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col label="ISBN">
                <ReferenceOneField reference="book_details" target="book_id">
                    <TextField source="ISBN" />
                </ReferenceOneField>
            </DataTable.Col>
        </DataTable>
    </ListWrapper>
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
                <RecordContextProvider
                    value={{ id: 1, title: 'War and Peace' }}
                >
                    <Stack spacing={4} direction="row" sx={{ ml: 2 }}>
                        <div>
                            <h3>Default</h3>
                            <ReferenceOneField
                                reference="book_details"
                                target="book_id"
                            />
                        </div>
                        <div>
                            <ResourceDefinitionContextProvider
                                definitions={{
                                    book_details: {
                                        name: 'book_details',
                                        recordRepresentation: 'ISBN',
                                    },
                                }}
                            >
                                <h3>String</h3>
                                <ReferenceOneField
                                    reference="book_details"
                                    target="book_id"
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
                                    },
                                }}
                            >
                                <h3>Function</h3>
                                <ReferenceOneField
                                    reference="book_details"
                                    target="book_id"
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
                                    },
                                }}
                            >
                                <h3>Element</h3>
                                <ReferenceOneField
                                    reference="book_details"
                                    target="book_id"
                                />
                            </ResourceDefinitionContextProvider>
                        </div>
                    </Stack>
                </RecordContextProvider>
            </ResourceContextProvider>
        </CoreAdminContext>
    </TestMemoryRouter>
);

export const QueryOptions = ({ dataProvider = defaultDataProvider }) => (
    <Wrapper dataProvider={dataProvider}>
        <ReferenceOneField
            reference="book_details"
            target="book_id"
            queryOptions={{ meta: { foo: 'bar' } }}
        >
            <TextField source="ISBN" />
        </ReferenceOneField>
    </Wrapper>
);

export const Themed = () => (
    <Wrapper
        theme={deepmerge(createTheme(), {
            components: {
                RaReferenceOneField: {
                    defaultProps: {
                        'data-testid': 'themed',
                    },
                },
                RaReferenceField: {
                    styleOverrides: {
                        root: {
                            color: 'hotpink',
                        },
                    },
                },
            },
        } as ThemeOptions)}
    >
        <ReferenceOneField reference="book_details" target="book_id">
            <TextField source="ISBN" />
        </ReferenceOneField>
    </Wrapper>
);

export const WithRenderProp = () => (
    <Wrapper>
        <ReferenceOneField
            reference="book_details"
            target="book_id"
            render={({ isPending, error, referenceRecord }) => {
                if (isPending) {
                    return <p>Loading...</p>;
                }

                if (error) {
                    return <p style={{ color: 'red' }}>{error.toString()}</p>;
                }

                return (
                    <span>{referenceRecord ? referenceRecord.ISBN : ''}</span>
                );
            }}
        />
    </Wrapper>
);

export const Offline = () => {
    return (
        <Wrapper>
            <I18nContextProvider value={i18nProvider}>
                <div>
                    <RenderChildOnDemand>
                        <ReferenceOneField
                            reference="book_details"
                            target="book_id"
                        >
                            <TextField source="ISBN" />
                        </ReferenceOneField>
                    </RenderChildOnDemand>
                </div>
                <SimulateOfflineButton />
            </I18nContextProvider>
        </Wrapper>
    );
};

const SimulateOfflineButton = () => {
    const isOffline = useIsOffline();
    return (
        <button
            type="button"
            onClick={() => onlineManager.setOnline(isOffline)}
        >
            {isOffline ? 'Simulate online' : 'Simulate offline'}
        </button>
    );
};

const RenderChildOnDemand = ({ children }) => {
    const [showChild, setShowChild] = React.useState(false);
    return (
        <>
            <button onClick={() => setShowChild(!showChild)}>
                Toggle Child
            </button>
            {showChild && <div>{children}</div>}
        </>
    );
};
