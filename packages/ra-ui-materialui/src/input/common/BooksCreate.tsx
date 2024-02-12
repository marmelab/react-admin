import React from 'react';
import { NumberInput, TextInput } from './..';
import { Create, SimpleForm } from './../..';

export const BooksCreate = () => (
    <Create>
        <SimpleForm>
            <NumberInput source="id" />
            <TextInput source="title" />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleForm>
    </Create>
);
