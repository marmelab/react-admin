import * as React from 'react';
import { CheckboxGroupInput, FieldProps } from 'react-admin';

export const FieldViewsInput = (props: FieldProps) => (
    <CheckboxGroupInput
        {...props}
        choices={VIEWS}
        initialValue={VIEWS_INITIAL_VALUE}
    />
);

const VIEWS = [
    {
        id: 'list',
        name: 'List',
    },
    {
        id: 'edit',
        name: 'Edit',
    },
    {
        id: 'create',
        name: 'Create',
    },
    {
        id: 'show',
        name: 'Show',
    },
];

const VIEWS_INITIAL_VALUE = ['list', 'edit', 'create', 'show'];
