import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import { CardContent } from '@mui/material';
import { ResourceDefinitionContextProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Datagrid } from '../list';
import { ReferenceArrayField } from './ReferenceArrayField';
import { TextField } from './TextField';
import { Show, SimpleShowLayout } from '../detail';

export default { title: 'ra-ui-materialui/fields/ReferenceArrayField' };

const fakeData = {
    bands: [{ id: 1, name: 'The Beatles', members: [1, 2, 3, 4] }],
    artists: [
        { id: 1, name: 'John Lennon' },
        { id: 2, name: 'Paul McCartney' },
        { id: 3, name: 'Ringo Star' },
        { id: 4, name: 'George Harrison' },
        { id: 5, name: 'Mick Jagger' },
    ],
};
const dataProvider = fakeRestProvider(fakeData, false);

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
    <AdminContext dataProvider={dataProvider}>
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
    <AdminContext dataProvider={dataProvider}>
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <ReferenceArrayField source="members" reference="artists">
                        <Datagrid bulkActionButtons={false}>
                            <TextField source="id" />
                            <TextField source="name" />
                        </Datagrid>
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
    <AdminContext dataProvider={dataProviderWithDifferentIdTypes}>
        <CardContent>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <TextField source="name" fullWidth />
                <ReferenceArrayField
                    fullWidth
                    source="members"
                    reference="artists"
                >
                    <Datagrid bulkActionButtons={false}>
                        <TextField source="id" />
                        <TextField source="name" />
                    </Datagrid>
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
        <AdminContext dataProvider={dataProviderWithLog}>
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
                        <Datagrid bulkActionButtons={false}>
                            <TextField source="id" />
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceArrayField>
                </Show>
            </CardContent>
        </AdminContext>
    );
};
