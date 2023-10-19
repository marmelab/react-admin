import * as React from 'react';
import {
    maxValue,
    required,
    ResourceContextProvider,
    testDataProvider,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Edit } from '../detail';
import { NumberInput, TextInput } from '../input';
import { SimpleForm } from './SimpleForm';
import { Stack } from '@mui/material';

export default { title: 'ra-ui-materialui/forms/SimpleForm' };

const data = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    year: 1869,
};

const Wrapper = ({
    children,
    i18nProvider = {
        translate: (x, options) => options?._ ?? x,
        changeLocale: () => Promise.resolve(),
        getLocale: () => 'en',
    },
}) => (
    <AdminContext
        i18nProvider={i18nProvider}
        dataProvider={testDataProvider({
            getOne: () => Promise.resolve({ data }),
        })}
    >
        <ResourceContextProvider value="books">
            <Edit id={1} sx={{ width: 600 }}>
                {children}
            </Edit>
        </ResourceContextProvider>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper>
        <SimpleForm>
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleForm>
    </Wrapper>
);

export const CustomLayout = () => (
    <Wrapper>
        <SimpleForm>
            <TextInput source="title" fullWidth />
            <Stack direction="row" gap={1} width="100%">
                <TextInput source="author" sx={{ width: '50%' }} />
                <NumberInput source="year" sx={{ width: '50%' }} />
            </Stack>
        </SimpleForm>
    </Wrapper>
);

export const StackProps = () => (
    <Wrapper>
        <SimpleForm spacing={3} alignItems="center">
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleForm>
    </Wrapper>
);

export const NoToolbar = () => (
    <Wrapper>
        <SimpleForm toolbar={false}>
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleForm>
    </Wrapper>
);

const translate = (x, options) => {
    switch (x) {
        case 'resources.books.name':
            return 'Books';
        case 'ra.page.edit':
            return 'Edit';
        case 'resources.books.fields.title':
            return 'Title';
        case 'resources.books.fields.author':
            return 'Author';
        case 'resources.books.fields.year':
            return 'Year';
        case 'ra.action.save':
            return 'Save';
        case 'ra.action.delete':
            return 'Delete';
        case 'ra.validation.required.author':
            return 'The author is required';
        case 'ra.validation.maxValue':
            return `The year must be less than ${options.max}`;
        default:
            console.warn(`Missing translation for key '${x}'`);
            return options?._ ?? x;
    }
};

const validate = values => {
    const errors = {} as any;
    if (!values.title) {
        errors.title = 'The title is required';
    }
    if (!values.author) {
        errors.author = 'ra.validation.required.author';
    }
    if (values.year > 2000) {
        errors.year = {
            message: 'ra.validation.maxValue',
            args: { max: 2000 },
        };
    }
    return errors;
};

export const GlobalValidation = () => (
    <Wrapper
        i18nProvider={{
            translate,
            changeLocale: () => Promise.resolve(),
            getLocale: () => 'en',
        }}
    >
        <SimpleForm validate={validate}>
            <TextInput source="title" fullWidth />
            <TextInput source="author" />
            <NumberInput source="year" />
        </SimpleForm>
    </Wrapper>
);

export const InputBasedValidation = () => (
    <Wrapper
        i18nProvider={{
            translate,
            changeLocale: () => Promise.resolve(),
            getLocale: () => 'en',
        }}
    >
        <SimpleForm>
            <TextInput
                source="title"
                fullWidth
                validate={required('The title is required')}
            />
            <TextInput
                source="author"
                validate={required('ra.validation.required.author')}
            />
            <NumberInput
                source="year"
                validate={maxValue(2000, 'ra.validation.maxValue')}
            />
        </SimpleForm>
    </Wrapper>
);
