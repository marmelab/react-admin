import * as React from 'react';
import { ResourceContextProvider, testDataProvider } from 'ra-core';

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

const Wrapper = ({ children }) => (
    <AdminContext
        i18nProvider={{
            translate: (x, options) => options?._ ?? x,
            changeLocale: () => Promise.resolve(),
            getLocale: () => 'en',
        }}
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
