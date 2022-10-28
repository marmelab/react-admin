import * as React from 'react';
import { Form, testDataProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { DatagridInput } from '../input';
import { TextField } from '../field';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { AutocompleteArrayInput } from './AutocompleteArrayInput';
import { SelectArrayInput } from './SelectArrayInput';
import { CheckboxGroupInput } from './CheckboxGroupInput';

export default { title: 'ra-ui-materialui/input/ReferenceArrayInput' };

const tags = [
    { id: 0, name: '3D' },
    { id: 1, name: 'Architecture' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Painting' },
    { id: 4, name: 'Photography' },
];

const dataProvider = testDataProvider({
    getList: () =>
        // @ts-ignore
        Promise.resolve({
            data: tags,
            total: tags.length,
        }),
    // @ts-ignore
    getMany: (resource, params) => {
        console.log('getMany', resource, params);
        return Promise.resolve({
            data: params.ids.map(id => tags.find(tag => tag.id === id)),
        });
    },
});

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const Basic = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <SimpleForm onSubmit={() => {}} defaultValues={{ tags_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tags_ids"
            >
                <AutocompleteArrayInput optionText="name" sx={{ width: 400 }} />
            </ReferenceArrayInput>
        </SimpleForm>
    </AdminContext>
);

export const WithAutocompleteInput = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorAutocomplete = () => (
    <AdminContext
        dataProvider={{
            getList: () => Promise.reject(new Error('fetch error')),
            getMany: () =>
                Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
        }}
        i18nProvider={i18nProvider}
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const WithSelectArrayInput = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorSelectArray = () => (
    <AdminContext
        dataProvider={{
            getList: () => Promise.reject(new Error('fetch error')),
            getMany: () =>
                Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
        }}
        i18nProvider={i18nProvider}
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const WithCheckboxGroupInput = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <CheckboxGroupInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorCheckboxGroupInput = () => (
    <AdminContext
        dataProvider={{
            getList: () => Promise.reject(new Error('fetch error')),
            getMany: () =>
                Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
        }}
        i18nProvider={i18nProvider}
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <CheckboxGroupInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const WithDatagridInput = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <DatagridInput rowClick="toggleSelection" sx={{ mt: 6 }}>
                    <TextField source="name" />
                </DatagridInput>
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorDatagridInput = () => (
    <AdminContext
        dataProvider={{
            getList: () => Promise.reject(new Error('fetch error')),
            getMany: () =>
                Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
        }}
        i18nProvider={i18nProvider}
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <DatagridInput rowClick="toggleSelection" sx={{ mt: 6 }}>
                    <TextField source="name" />
                </DatagridInput>
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);
