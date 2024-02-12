import React from 'react';
import { Datagrid, DateField, List, NumberField, TextField } from './../..';

export const BooksList = () => (
    <List>
        <Datagrid rowClick="edit">
            <NumberField source="id" />
            <TextField source="title.en" label="Title" />
            <TextField source="author" />
            <DateField source="year" />
        </Datagrid>
    </List>
);
