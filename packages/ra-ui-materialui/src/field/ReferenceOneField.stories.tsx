import * as React from 'react';
import { useState } from 'react';
import {
    CoreAdminContext,
    RecordContextProvider,
    ResourceContextProvider,
    ResourceDefinitionContextProvider,
    ListContextProvider,
    useRecordContext,
} from 'ra-core';
import { createMemoryHistory } from 'history';
import { ThemeProvider, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { TextField } from '../field';
import { ReferenceOneField } from './ReferenceOneField';
import { SimpleShowLayout } from '../detail/SimpleShowLayout';
import { Datagrid } from '../list/datagrid/Datagrid';

export default { title: 'ra-ui-materialui/fields/ReferenceOneField' };

const defaultDataProvider = {
    getManyReference: () =>
        Promise.resolve({
            data: [{ id: 1, ISBN: '9780393966473', genre: 'novel' }],
            total: 1,
        }),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1/show'] });

const Wrapper = ({ children, dataProvider = defaultDataProvider }) => (
    <CoreAdminContext dataProvider={dataProvider} history={history}>
        <ResourceContextProvider value="books">
            <RecordContextProvider value={{ id: 1, title: 'War and Peace' }}>
                {children}
            </RecordContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const Basic = () => (
    <Wrapper>
        <ReferenceOneField reference="book_details" target="book_id">
            <TextField source="ISBN" />
        </ReferenceOneField>
    </Wrapper>
);

const slowDataProvider = {
    getManyReference: (resource, params) =>
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
    getManyReference: (resource, params) =>
        Promise.resolve({
            data: [],
            total: 0,
        }),
} as any;

export const Empty = () => (
    <Wrapper dataProvider={emptyDataProvider}>
        <ReferenceOneField
            reference="book_details"
            target="book_id"
            emptyText="no detail"
        >
            <TextField source="ISBN" />
        </ReferenceOneField>
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
    <ThemeProvider theme={createTheme()}>
        <Wrapper>
            <ListContextProvider
                value={{
                    total: 1,
                    data: [{ id: 1, title: 'War and Peace' }],
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
            <ReferenceOneField
                label="ISBN"
                reference="book_details"
                target="book_id"
            >
                <TextField source="ISBN" />
            </ReferenceOneField>
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
            <RecordContextProvider value={{ id: 1, title: 'War and Peace' }}>
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
);
