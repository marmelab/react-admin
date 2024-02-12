import * as React from 'react';
import { required } from 'ra-core';
import { useFormState, useFormContext } from 'react-hook-form';
import fakeRestProvider from 'ra-data-fakerest';

import { Resource } from '../../../ra-core/src/core/Resource';
import { TextInput } from './TextInput';
import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { Edit } from '../detail';
import { SimpleForm, Toolbar } from '../form';
import { SaveButton } from '../button';
import { FormInspector } from './common';
import { createHashHistory } from 'history';
import { useEffect } from 'react';
import { Datagrid, List } from '../list';
import { TextField } from '../field';

export default { title: 'ra-ui-materialui/input/TextInput' };

export const Basic = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" />
                <FormInspector />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const disabled = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" disabled />
                <FormInspector />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const data = {
    books: [
        { id: 1, title: 'War and Peace' },
        { id: 2, title: 'The Little Prince' },
        { id: 3, title: "Swann's Way" },
        { id: 4, title: 'A Tale of Two Cities' },
        { id: 5, title: 'The Lord of the Rings' },
        { id: 6, title: 'And Then There Were None' },
        { id: 7, title: 'Dream of the Red Chamber' },
        { id: 8, title: 'The Hobbit' },
        { id: 9, title: 'She: A History of Adventure' },
        { id: 10, title: 'The Lion, the Witch and the Wardrobe' },
        { id: 11, title: 'The Chronicles of Narnia' },
        { id: 12, title: 'Pride and Prejudice' },
        { id: 13, title: 'Ulysses' },
        { id: 14, title: 'The Catcher in the Rye' },
        { id: 15, title: 'The Little Mermaid' },
        { id: 16, title: 'The Secret Garden' },
        { id: 17, title: 'The Wind in the Willows' },
        { id: 18, title: 'The Wizard of Oz' },
        { id: 19, title: 'Madam Bovary' },
        { id: 20, title: 'The Little House' },
        { id: 21, title: 'The Phantom of the Opera' },
        { id: 22, title: 'The Adventures of Tom Sawyer' },
        { id: 23, title: 'The Adventures of Huckleberry Finn' },
        { id: 24, title: 'The Time Machine' },
        { id: 25, title: 'The War of the Worlds' },
    ],
};

const dataProvider = fakeRestProvider(data);

export const ReadOnly = () => {
    const history = createHashHistory();
    useEffect(() => {
        // history.replace('/books/create');
    }, [history]);

    return (
        <AdminContext dataProvider={dataProvider} history={history}>
            <Resource
                name="customers"
                list={CustomerList}
                create={CustomerCreate}
            />
        </AdminContext>
    );
};

export const CustomerList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
        </Datagrid>
    </List>
);

const CustomerCreate = () => {
    return (
        <Create
            // resource="books"
            // record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="id" />
                <TextInput source="title" disabled readOnly />
                <FormInspector />
            </SimpleForm>
        </Create>
    );
};

export const DefaultValue = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" defaultValue="hello" />
                <TextInput
                    source="title1"
                    label="Default john"
                    defaultValue="john"
                />
                <TextInput
                    source="title2"
                    label="Default empty string"
                    defaultValue=""
                />
                <TextInput source="title3" label="Default undefined" />
                <FormInspector name="title" />
                <FormInspector name="title1" />
                <FormInspector name="title2" />
                <FormInspector name="title3" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const HelperText = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" />
                <TextInput source="title" helperText={false} />
                <TextInput
                    source="title"
                    helperText="Number of times the post was read"
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Label = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" />
                <TextInput source="title" label={false} />
                <TextInput source="title" label="label of title" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const FullWidth = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" label="default" />
                <TextInput source="title" label="Full Width" fullWidth />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Margin = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" label="default (dense)" />
                <TextInput source="title" label="none" margin="none" />
                <TextInput source="title" label="normal" margin="normal" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Variant = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" label="default (filled)" />
                <TextInput source="title" label="outlined" variant="outlined" />
                <TextInput source="title" label="standard" variant="standard" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Required = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm mode="onBlur">
                <TextInput source="title" />
                <TextInput source="title" required />
                <TextInput source="title" validate={required()} />
                <TextInput source="title" validate={[required()]} />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Error = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm
                resolver={() => ({
                    values: {},
                    errors: {
                        title: {
                            type: 'custom',
                            message: 'Special error message',
                        },
                    },
                })}
            >
                <TextInput source="title" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Sx = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput
                    source="title"
                    sx={{
                        border: 'solid 1px red',
                        borderRadius: '5px',
                        '& .MuiInputLabel-root': { fontWeight: 'bold' },
                    }}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const ExtraProps = () => (
    <AdminContext>
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm>
                <TextInput
                    source="username"
                    inputProps={{ autocomplete: 'off' }}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const FormStateInspector = () => {
    const {
        touchedFields,
        isDirty,
        dirtyFields,
        isValid,
        errors,
    } = useFormState();
    return (
        <div>
            form state:&nbsp;
            <code style={{ backgroundColor: 'lightgrey' }}>
                {JSON.stringify({
                    touchedFields,
                    isDirty,
                    dirtyFields,
                    isValid,
                    errors,
                })}
            </code>
        </div>
    );
};

const FieldStateInspector = ({ name = 'title' }) => {
    const formContext = useFormContext();
    return (
        <div>
            {name}:
            <code style={{ backgroundColor: 'lightgrey' }}>
                {JSON.stringify(
                    formContext.getFieldState(name, formContext.formState)
                )}
            </code>
        </div>
    );
};

export const FieldState = () => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <TextInput source="title" />
                <FormStateInspector />
                <FieldStateInspector />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const AlwaysOnToolbar = (
    <Toolbar>
        <SaveButton alwaysEnable />
    </Toolbar>
);

export const ValueUndefined = ({ onSuccess = console.log }) => (
    <AdminContext
        dataProvider={
            {
                getOne: () => Promise.resolve({ data: { id: 123 } }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
    >
        <Edit
            resource="posts"
            id="123"
            sx={{ width: 600 }}
            mutationOptions={{ onSuccess }}
        >
            <SimpleForm toolbar={AlwaysOnToolbar}>
                <TextInput source="title" />
                <FormInspector />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const ValueNull = ({ onSuccess = console.log }) => (
    <AdminContext
        dataProvider={
            {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: null } }),
                update: (resource, { data }) => Promise.resolve({ data }),
            } as any
        }
    >
        <Edit
            resource="posts"
            id="123"
            sx={{ width: 600 }}
            mutationOptions={{ onSuccess }}
        >
            <SimpleForm toolbar={AlwaysOnToolbar}>
                <TextInput source="title" />
                <FormInspector />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Parse = ({ onSuccess = console.log }) => (
    <AdminContext>
        <Create
            resource="posts"
            record={{ id: 123, title: 'Lorem ipsum' }}
            sx={{ width: 600 }}
            mutationOptions={{ onSuccess }}
        >
            <SimpleForm>
                <TextInput
                    source="title"
                    parse={v => (v === 'foo' ? 'bar' : v)}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);
