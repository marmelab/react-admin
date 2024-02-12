import React from 'react';
import {
    Edit,
    NumberInput,
    SimpleForm,
    TextInput,
} from '../ra-ui-materialui/src';

export const BooksEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="id" />
            <TextInput source="title" />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleForm>
    </Edit>
);
