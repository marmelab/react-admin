import * as React from 'react';
import { Form } from 'react-final-form';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { ThemeProvider, createTheme } from '@mui/material';

import { Datagrid } from '../list';
import { TextField } from '../field';
import { ReferenceArrayInput } from './ReferenceArrayInput';

export default { title: 'ra-ui-materialui/input/ReferenceArrayInput' };

const dataProvider = testDataProvider({
    getList: () =>
        // @ts-ignore
        Promise.resolve({
            data: [
                { id: 5, name: 'test1' },
                { id: 6, name: 'test2' },
            ],
            total: 2,
        }),
    // @ts-ignore
    getMany: (resource, params) => {
        console.log('getMany', resource, params);
        return Promise.resolve({ data: [{ id: 5, name: 'test1' }] });
    },
});

export const WithDatagridChild = () => (
    <ThemeProvider theme={createTheme()}>
        <CoreAdminContext dataProvider={dataProvider}>
            <Form
                onSubmit={() => {}}
                initialValues={{ tag_ids: [5] }}
                render={() => (
                    <ReferenceArrayInput
                        reference="tags"
                        resource="posts"
                        source="tag_ids"
                    >
                        <Datagrid rowClick="toggleSelection">
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceArrayInput>
                )}
            />
        </CoreAdminContext>
    </ThemeProvider>
);
