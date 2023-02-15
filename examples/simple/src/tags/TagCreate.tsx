/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    Create,
    SimpleFormConfigurable,
    TextInput,
    required,
    TranslatableInputs,
} from 'react-admin';

const TagCreate = () => (
    <Create redirect="list">
        <SimpleFormConfigurable>
            <TranslatableInputs locales={['en', 'fr']}>
                <TextInput source="name" validate={[required()]} />
            </TranslatableInputs>
        </SimpleFormConfigurable>
    </Create>
);

export default TagCreate;
