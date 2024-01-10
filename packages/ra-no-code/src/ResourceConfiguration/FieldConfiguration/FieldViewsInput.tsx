import * as React from 'react';
import { CheckboxGroupInput, CheckboxGroupInputProps } from 'react-admin';

export const FieldViewsInput = (props: CheckboxGroupInputProps) => (
    <CheckboxGroupInput
        {...props}
        choices={VIEWS}
        defaultValue={VIEWS_INITIAL_VALUE}
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
