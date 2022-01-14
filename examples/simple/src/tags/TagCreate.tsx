/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextField,
    TextInput,
    required,
    TranslatableInputs,
} from 'react-admin';

const TagCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextField source="id" />
            <TranslatableInputs locales={['en', 'fr']}>
                <TextInput source="name" validate={[required()]} />
            </TranslatableInputs>
        </SimpleForm>
    </Create>
);

export default TagCreate;
