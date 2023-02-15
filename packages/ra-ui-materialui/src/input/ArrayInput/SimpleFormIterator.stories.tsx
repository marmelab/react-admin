import * as React from 'react';
import { Button } from '@mui/material';

import { Edit } from '../../detail';
import { SimpleForm } from '../../form';
import { ArrayInput } from './ArrayInput';
import { SimpleFormIterator } from './SimpleFormIterator';
import { TextInput } from '../TextInput';
import { AdminContext } from '../../AdminContext';
import { defaultTheme } from '../../defaultTheme';

export default { title: 'ra-ui-materialui/input/SimpleFormIterator' };

const dataProvider = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                authors: [
                    {
                        name: 'Leo Tolstoy',
                        role: 'head_writer',
                    },
                    {
                        name: 'Alexander Pushkin',
                        role: 'co_writer',
                    },
                ],
            },
        }),
} as any;

export const Basic = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const AddButton = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator addButton={<Button>Add</Button>}>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const GetItemLabel = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator
                        getItemLabel={index => `item #${index}`}
                    >
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const FullWidth = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator fullWidth>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Inline = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator inline>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const DisableAdd = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator disableAdd>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const DisableClear = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator disableClear>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const DisableRemove = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator disableRemove>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const DisableReordering = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator disableReordering>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Sx = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator
                        sx={{
                            border: 'solid lightgrey 1px',
                            borderRadius: 2,
                            mt: 3,
                            p: 1,
                            '& .RaSimpleFormIterator-form': {
                                flexDirection: 'row',
                                gap: '1em',
                            },
                        }}
                    >
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Theming = () => (
    <AdminContext
        dataProvider={dataProvider}
        theme={{
            ...defaultTheme,
            components: {
                ...defaultTheme.components,
                RaSimpleFormIterator: {
                    styleOverrides: {
                        root: {
                            border: 'solid lightgrey 1px',
                            borderRadius: 2,
                            marginTop: 24,
                            padding: 8,
                            '& .RaSimpleFormIterator-form': {
                                flexDirection: 'row',
                                gap: '1em',
                            },
                        },
                    },
                },
            },
        }}
    >
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);
