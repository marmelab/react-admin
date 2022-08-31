import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource } from 'ra-core';
import { createMemoryHistory } from 'history';

import { Edit } from '../../detail';
import { SimpleForm } from '../../form';
import { ArrayInput } from './ArrayInput';
import { SimpleFormIterator } from './SimpleFormIterator';
import { TextInput } from '../TextInput';
import { DateInput } from '../DateInput';
import { NumberInput } from '../NumberInput';
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

export const Disabled = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource
            name="books"
            edit={() => {
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
                            <ArrayInput source="authors" disabled>
                                <SimpleFormIterator>
                                    <TextInput source="name" />
                                    <TextInput source="role" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Edit>
                );
            }}
        />
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

export const Realistic = () => (
    <Admin
        dataProvider={
            {
                getOne: (resource, params) =>
                    Promise.resolve({
                        data: {
                            id: 1,
                            date: '2022-08-30',
                            customer: 'John Doe',
                            items: [
                                {
                                    name: 'Office Jeans',
                                    price: 45.99,
                                    quantity: 1,
                                },
                                {
                                    name: 'Black Elegance Jeans',
                                    price: 69.99,
                                    quantity: 2,
                                },
                                {
                                    name: 'Slim Fit Jeans',
                                    price: 55.99,
                                    quantity: 1,
                                },
                            ],
                        },
                    }),
                update: (resource, params) => Promise.resolve(params),
            } as any
        }
        history={createMemoryHistory({ initialEntries: ['/orders/1'] })}
    >
        <Resource
            name="orders"
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
                        <TextInput source="customer" helperText={false} />
                        <DateInput source="date" helperText={false} />
                        <ArrayInput source="items">
                            <SimpleFormIterator>
                                <TextInput source="name" helperText={false} />
                                <NumberInput
                                    source="price"
                                    helperText={false}
                                />
                                <NumberInput
                                    source="quantity"
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
