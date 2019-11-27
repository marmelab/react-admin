/* eslint react/jsx-key: off */
import React from 'react';
import {
    Create,
    SimpleForm,
    TextField,
    TextInput,
    required,
} from 'react-admin';

const TagCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextField source="id" />
            <TextInput source="name" validate={[required()]} />
        </SimpleForm>
    </Create>
);

export default TagCreate;
