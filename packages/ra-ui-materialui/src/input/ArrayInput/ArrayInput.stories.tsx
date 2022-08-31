import * as React from 'react';
import { Admin } from 'react-admin';
import { required, Resource } from 'ra-core';
import { createMemoryHistory } from 'history';

import { Edit } from '../../detail';
import { SimpleForm } from '../../form';
import { ArrayInput } from './ArrayInput';
import { SimpleFormIterator } from './SimpleFormIterator';
import { TextInput } from '../TextInput';
import { AutocompleteInput } from '../AutocompleteInput';

export default { title: 'ra-ui-materialui/input/ArrayInput' };

const dataProvider = {
    getOne: (resource, params) =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                authors: [
                    {
                        name: 'Leo Tolstoy',
                        role: 'head_writer',
                    },
                    {
                        name: 'Alexander Pushkin',
                        role: 'co_writer',
                    },
                ],
                tags: ['novel', 'war', 'classic'],
            },
        }),
    update: (resource, params) => Promise.resolve(params),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1'] });

const BookEdit = () => {
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <ArrayInput source="authors" fullWidth>
                    <SimpleFormIterator>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};

export const Basic = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEdit} />
    </Admin>
);

const BookEditWithAutocomplete = () => {
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <ArrayInput source="authors" fullWidth>
                    <SimpleFormIterator>
                        <AutocompleteInput
                            source="role"
                            choices={[
                                { id: 'head_writer', name: 'Head Writer' },
                                { id: 'co_writer', name: 'Co-Writer' },
                            ]}
                        />
                        <TextInput source="name" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};

export const AutocompleteFirst = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditWithAutocomplete} />
    </Admin>
);

export const Scalar = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource
            name="books"
            edit={() => (
                <Edit
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: data => {
                            console.log(data);
                        },
                    }}
                >
                    <SimpleForm>
                        <TextInput source="title" />
                        <ArrayInput source="tags" fullWidth>
                            <SimpleFormIterator disableReordering>
                                <TextInput
                                    source=""
                                    label="tag"
                                    helperText={false}
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </Edit>
            )}
        />
    </Admin>
);

const globalValidator = values => {
    const errors: any = {};
    if (!values.authors || !values.authors.length) {
        errors.authors = 'ra.validation.required';
    } else {
        errors.authors = values.authors.map(author => {
            const authorErrors: any = {};
            if (!author?.name) {
                authorErrors.name = 'A name is required';
            }
            if (!author?.role) {
                authorErrors.role = 'ra.validation.required';
            }
            return authorErrors;
        });
    }
    return errors;
};
const BookEditGlobalValidation = () => {
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm validate={globalValidator}>
                {/* 
                  We still need `validate={required()}` to indicate fields are required 
                  with a '*' symbol after the label, but the real validation happens in `globalValidator`
                */}
                <ArrayInput source="authors" fullWidth validate={required()}>
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <TextInput source="role" validate={required()} />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};
export const GlobalValidation = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditGlobalValidation} />
    </Admin>
);
