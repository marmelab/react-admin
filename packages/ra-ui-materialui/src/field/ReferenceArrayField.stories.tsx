import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';

import { AdminContext } from '../AdminContext';
import { Datagrid } from '../list';
import { ReferenceArrayField } from './ReferenceArrayField';
import { TextField } from './TextField';
import { Show } from '../detail';
import { CardContent } from '@mui/material';

const fakeData = {
    bands: [{ id: 1, name: 'band_1', members: [1, '2', '3'] }],
    artists: [
        { id: 1, name: 'artist_1' },
        { id: 2, name: 'artist_2' },
        { id: 3, name: 'artist_3' },
        { id: 4, name: 'artist_4' },
    ],
};

export default { title: 'ra-ui-materialui/fields/ReferenceArrayField' };

const dataProvider = fakeRestProvider(fakeData, false);

export const DifferentIdTypes = () => {
    return (
        <AdminContext dataProvider={dataProvider}>
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
};

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
