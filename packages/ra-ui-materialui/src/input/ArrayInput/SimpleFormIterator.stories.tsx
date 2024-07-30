import * as React from 'react';
import { Button } from '@mui/material';

import { Edit } from '../../detail';
import { SimpleForm } from '../../form';
import { ArrayInput } from './ArrayInput';
import { SimpleFormIterator } from './SimpleFormIterator';
import { TextInput } from '../TextInput';
import { AdminContext } from '../../AdminContext';
import { defaultTheme } from '../../theme/defaultTheme';

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

const Wrapper = ({ children }) => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">{children}</ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper>
        <SimpleFormIterator>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const AddButton = () => (
    <Wrapper>
        <SimpleFormIterator addButton={<Button>Add</Button>}>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const GetItemLabel = () => (
    <Wrapper>
        <SimpleFormIterator getItemLabel={index => `item #${index}`}>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <SimpleFormIterator fullWidth={false}>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const Inline = () => (
    <Wrapper>
        <SimpleFormIterator inline>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const ReadOnly = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator readOnly>
                        <TextInput source="name" />
                        <TextInput source="role" />
                        <TextInput source="surname" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Disabled = () => (
    <AdminContext dataProvider={dataProvider}>
        <Edit resource="books" id="1">
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator disabled>
                        <TextInput source="name" />
                        <TextInput source="role" />
                        <TextInput source="surname" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const DisableAdd = () => (
    <Wrapper>
        <SimpleFormIterator disableAdd>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const DisableClear = () => (
    <Wrapper>
        <SimpleFormIterator disableClear>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const DisableRemove = () => (
    <Wrapper>
        <SimpleFormIterator disableRemove>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const DisableReordering = () => (
    <Wrapper>
        <SimpleFormIterator disableReordering>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleFormIterator>
    </Wrapper>
);

export const Sx = () => (
    <Wrapper>
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
    </Wrapper>
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
        defaultTheme="light"
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
