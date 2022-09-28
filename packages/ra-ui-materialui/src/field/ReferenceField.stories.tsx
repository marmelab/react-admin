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
} from 'ra-core';
import { createMemoryHistory } from 'history';
import { ThemeProvider, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { TextField } from '../field';
import { ReferenceField } from './ReferenceField';
import { SimpleShowLayout } from '../detail/SimpleShowLayout';
import { Datagrid } from '../list/datagrid/Datagrid';

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

const history = createMemoryHistory({ initialEntries: ['/books/1/show'] });

const defaultDataProvider = {
    getMany: () =>
        Promise.resolve({
            data: [{ id: 1, ISBN: '9780393966473', genre: 'novel' }],
        }),
} as any;
const defaultRecord = { id: 1, title: 'War and Peace', detail_id: 1 };

const Wrapper = ({
    children,
    dataProvider = defaultDataProvider,
    record = defaultRecord,
}: any) => (
    <CoreAdminContext dataProvider={dataProvider} history={history}>
        <ResourceContextProvider value="books">
            <RecordContextProvider value={record}>
                {children}
            </RecordContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const Basic = () => (
    <Wrapper>
        <ReferenceField source="detail_id" reference="book_details">
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

const slowDataProvider = {
    getMany: (resource, params) =>
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

export const Empty = () => (
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

export const EmptyWithTranslate = () => (
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
        <ReferenceField
            source="detail_id"
            reference="book_details"
            emptyText="no detail"
        >
            <TextField source="ISBN" />
        </ReferenceField>
    </Wrapper>
);

export const Link = () => (
    <Wrapper>
        <ReferenceField source="detail_id" reference="book_details" link="show">
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
            <TextField source="ISBN" /> <TextField source="genre" />
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
                value={{
                    total: 1,
                    data: [{ id: 1, title: 'War and Peace', detail_id: 1 }],
                    sort: { field: 'title', order: 'ASC' },
                }}
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

const BookDetailsRepresentation = () => {
    const record = useRecordContext();
    return (
        <>
            <strong>Genre</strong>: {record.genre}, <strong>ISBN</strong>:{' '}
            {record.ISBN}
        </>
    );
};
export const RecordRepresentation = () => (
    <CoreAdminContext dataProvider={defaultDataProvider} history={history}>
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
);
