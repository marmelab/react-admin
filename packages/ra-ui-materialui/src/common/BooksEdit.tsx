import React from 'react';
import { Edit, NumberInput, SimpleForm, TextInput } from '..';

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
