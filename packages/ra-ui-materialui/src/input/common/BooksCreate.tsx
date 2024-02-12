import React from 'react';
import {
    DateInput,
    NumberInput,
    TextInput,
    TimeInput,
    Create,
    SimpleForm,
    TranslatableInputs,
} from './../..';

export const BooksCreate = () => (
    <Create>
        <SimpleForm>
            <NumberInput source="id" />
            <TranslatableInputs locales={['en', 'fr']}>
                <TextInput source="title" />
            </TranslatableInputs>
            <TextInput source="author" />
            <DateInput source="year" />
            <TimeInput source="time" />
        </SimpleForm>
    </Create>
);
