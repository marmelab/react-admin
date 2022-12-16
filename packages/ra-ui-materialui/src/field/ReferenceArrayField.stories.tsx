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

export const DifferentIdTypes = () => {
    return (
        <AdminContext dataProvider={fakeRestProvider(fakeData, false)}>
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
