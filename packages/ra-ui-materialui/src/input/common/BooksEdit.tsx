import React from 'react';
import { NumberInput, TextInput } from './..';
import { Edit, SimpleForm } from './../..';

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
