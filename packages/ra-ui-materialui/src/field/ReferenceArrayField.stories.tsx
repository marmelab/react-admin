import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import { Alert, CardContent } from '@mui/material';
import {
    IsOffline,
    ResourceDefinitionContextProvider,
    useIsOffline,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { DataTable, Pagination } from '../list';
import { ReferenceArrayField } from './ReferenceArrayField';
import { TextField } from './TextField';
import { Show, SimpleShowLayout } from '../detail';
import { onlineManager } from '@tanstack/react-query';

export default { title: 'ra-ui-materialui/fields/ReferenceArrayField' };

const fakeData = {
    bands: [{ id: 1, name: 'The Beatles', members: [1, 2, 3, 4, 5, 6, 7, 8] }],
    artists: [
        { id: 1, name: 'John Lennon' },
        { id: 2, name: 'Paul McCartney' },
        { id: 3, name: 'Ringo Star' },
        { id: 4, name: 'George Harrison' },
        { id: 5, name: 'Mick Jagger' },
        { id: 6, name: 'Keith Richards' },
        { id: 7, name: 'Ronnie Wood' },
        { id: 8, name: 'Charlie Watts' },
    ],
};
const dataProvider = fakeRestProvider(
    fakeData,
    process.env.NODE_ENV !== 'test'
);

const resouceDefs = {
    artists: {
        name: 'artists',
        hasList: true,
        hasEdit: true,
        hasShow: true,
        hasCreate: true,
        recordRepresentation: 'name',
    },
};
export const Basic = () => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <ReferenceArrayField source="members" reference="artists" />
                </SimpleShowLayout>
            </Show>
        </ResourceDefinitionContextProvider>
    </AdminContext>
);

export const Children = () => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <ReferenceArrayField source="members" reference="artists">
                        <DataTable bulkActionButtons={false}>
                            <DataTable.Col source="id" />
                            <DataTable.Col source="name" />
                        </DataTable>
                    </ReferenceArrayField>
                </SimpleShowLayout>
            </Show>
        </ResourceDefinitionContextProvider>
    </AdminContext>
);

const fakeDataWidthDifferentIdTypes = {
    bands: [{ id: 1, name: 'band_1', members: [1, '2', '3'] }],
    artists: [
        { id: 1, name: 'artist_1' },
        { id: 2, name: 'artist_2' },
        { id: 3, name: 'artist_3' },
        { id: 4, name: 'artist_4' },
    ],
};
const dataProviderWithDifferentIdTypes = fakeRestProvider(
    fakeDataWidthDifferentIdTypes,
    false
);

export const DifferentIdTypes = () => (
    <AdminContext
        dataProvider={dataProviderWithDifferentIdTypes}
        defaultTheme="light"
    >
        <CardContent>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <TextField source="name" fullWidth />
                <ReferenceArrayField
                    fullWidth
                    source="members"
                    reference="artists"
                >
                    <DataTable bulkActionButtons={false}>
                        <DataTable.Col source="id" />
                        <DataTable.Col source="name" />
                    </DataTable>
                </ReferenceArrayField>
            </Show>
        </CardContent>
    </AdminContext>
);

const dataProviderWithLog = {
    ...dataProvider,
    getMany: (resource, params) => {
        console.log('getMany', resource, params);
        return dataProvider.getMany(resource, params);
    },
} as any;

export const WithMeta = () => {
    return (
        <AdminContext dataProvider={dataProviderWithLog} defaultTheme="light">
            <CardContent>
                <Show resource="bands" id={1} sx={{ width: 600 }}>
                    <TextField source="name" />
                    <ReferenceArrayField
                        source="members"
                        reference="artists"
                        queryOptions={{
                            meta: { foo: 'bar' },
                        }}
                    >
                        <DataTable bulkActionButtons={false}>
                            <DataTable.Col source="id" />
                            <DataTable.Col source="name" />
                        </DataTable>
                    </ReferenceArrayField>
                </Show>
            </CardContent>
        </AdminContext>
    );
};

export const WithPagination = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => englishMessages)}
        defaultTheme="light"
    >
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <ReferenceArrayField
                        source="members"
                        reference="artists"
                        pagination={<Pagination />}
                        perPage={5}
                    >
                        <DataTable>
                            <DataTable.Col source="id" />
                            <DataTable.Col source="name" />
                        </DataTable>
                    </ReferenceArrayField>
                </SimpleShowLayout>
            </Show>
        </ResourceDefinitionContextProvider>
    </AdminContext>
);

export const WithRenderProp = () => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <ReferenceArrayField
                        source="members"
                        reference="artists"
                        render={({ data, isPending, error }) => {
                            if (isPending) {
                                return <p>Loading...</p>;
                            }

                            if (error) {
                                return (
                                    <p style={{ color: 'red' }}>
                                        {error.toString()}
                                    </p>
                                );
                            }

                            return (
                                <p>
                                    {data?.map((datum, index) => (
                                        <li key={index}>{datum.name}</li>
                                    ))}
                                </p>
                            );
                        }}
                    />
                </SimpleShowLayout>
            </Show>
        </ResourceDefinitionContextProvider>
    </AdminContext>
);

export const Offline = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => englishMessages)}
        defaultTheme="light"
    >
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <RenderChildOnDemand>
                        <ReferenceArrayField
                            source="members"
                            reference="artists"
                            pagination={<Pagination />}
                            perPage={5}
                        >
                            <IsOffline>
                                <Alert severity="warning">
                                    You are offline, the data may be outdated
                                </Alert>
                            </IsOffline>
                            <DataTable>
                                <DataTable.Col source="id" />
                                <DataTable.Col source="name" />
                            </DataTable>
                        </ReferenceArrayField>
                    </RenderChildOnDemand>
                </SimpleShowLayout>
                <SimulateOfflineButton />
            </Show>
        </ResourceDefinitionContextProvider>
    </AdminContext>
);

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
