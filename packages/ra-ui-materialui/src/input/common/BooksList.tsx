import React from 'react';
import { Datagrid, List, NumberField, TextField } from './../..';

export const BooksList = () => (
    <List>
        <Datagrid>
            <NumberField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <NumberField source="year" />
        </Datagrid>
    </List>
);
