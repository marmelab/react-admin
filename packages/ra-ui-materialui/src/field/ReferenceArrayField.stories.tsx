import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';

import { AdminContext } from '../AdminContext';
import { Datagrid, List } from '../list';
import { ReferenceArrayField } from './ReferenceArrayField';
import { TextField } from './TextField';

const fakeData = {
    bands: [{ id: 1, name: 'band_1', members: [1, '2', '3'] }],
    artists: [
        { id: 1, name: 'artist_1' },
        { id: 2, name: 'artist_2' },
        { id: 3, name: 'artist_3' },
        { id: 4, name: 'artist_4' },
    ],
};
const dataProvider = fakeRestProvider(fakeData, true);

export default { title: 'ra-ui-materialui/fields/ReferenceArrayField' };

export const HandlingIdsDiscrependies = () => {
    return (
        <AdminContext dataProvider={dataProvider}>
            <List resource="bands" sx={{ width: 600 }}>
                <Datagrid>
                    <TextField source="name" fullWidth />
                    <ReferenceArrayField
                        fullWidth
                        source="members"
                        reference="artists"
                    >
                        <Datagrid>
                            <TextField source="id" />
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceArrayField>
                </Datagrid>
            </List>
        </AdminContext>
    );
};
