import * as React from 'react';
import { Admin } from 'react-admin';
import {
    minLength,
    required,
    Resource,
    testI18nProvider,
    TestMemoryRouter,
    useSourceContext,
} from 'ra-core';
import { Button, InputAdornment } from '@mui/material';

import { Edit, Create } from '../../detail';
import { SimpleForm, TabbedForm } from '../../form';
import { ArrayInput } from './ArrayInput';
import { SimpleFormIterator } from './SimpleFormIterator';
import { TextInput } from '../TextInput';
import { DateInput } from '../DateInput';
import { NumberInput } from '../NumberInput';
import { AutocompleteInput } from '../AutocompleteInput';
import { TranslatableInputs } from '../TranslatableInputs';
import { ReferenceField, TextField, TranslatableFields } from '../../field';
import { Labeled } from '../../Labeled';
import { useFormContext, useWatch } from 'react-hook-form';

export default { title: 'ra-ui-materialui/input/ArrayInput' };

const dataProvider = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                authors: [
                    {
                        name: 'Leo Tolstoy',
                        role: 'head_writer',
                        country_id: 1,
                    },
                    {
                        name: 'Alexander Pushkin',
                        role: 'co_writer',
                        country_id: 2,
                    },
                ],
                tags: ['novel', 'war', 'classic'],
            },
        }),
    update: (_resource, params) => Promise.resolve(params),
    create: (_resource, params) => {
        return Promise.resolve({ data: { ...params.data, id: 2 } });
    },
} as any;

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
                <TextInput source="title" />
                <ArrayInput source="authors">
                    <SimpleFormIterator>
                        <TextInput source="name" />
                        <TextInput source="role" />
                    </SimpleFormIterator>
                </ArrayInput>
                <FormInspector />
            </SimpleForm>
        </Edit>
    );
};

const FormInspector = () => {
    const {
        formState: { defaultValues, isDirty, dirtyFields },
    } = useFormContext();
    const values = useWatch();
    return (
        <div>
            <div>isDirty: {isDirty.toString()}</div>
            <div>dirtyFields: {JSON.stringify(dirtyFields, null, 2)}</div>
            <div>defaultValues: {JSON.stringify(defaultValues, null, 2)}</div>
            <div>values: {JSON.stringify(values, null, 2)}</div>
        </div>
    );
};

export const Basic = () => (
    <React.StrictMode>
        <TestMemoryRouter initialEntries={['/books/1']}>
            <Admin dataProvider={dataProvider}>
                <Resource name="books" edit={BookEdit} />
            </Admin>
        </TestMemoryRouter>
    </React.StrictMode>
);

export const Disabled = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
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
                                <TextInput source="title" />
                                <ArrayInput source="authors">
                                    <SimpleFormIterator disabled>
                                        <TextInput source="name" disabled />
                                        <TextInput source="role" disabled />
                                        <TextInput source="surname" disabled />
                                    </SimpleFormIterator>
                                </ArrayInput>
                            </SimpleForm>
                        </Edit>
                    );
                }}
            />
        </Admin>
    </TestMemoryRouter>
);

export const ReadOnly = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
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
                                <TextInput source="title" />
                                <ArrayInput source="authors">
                                    <SimpleFormIterator disabled>
                                        <TextInput source="name" readOnly />
                                        <TextInput source="role" readOnly />
                                        <TextInput source="surname" readOnly />
                                    </SimpleFormIterator>
                                </ArrayInput>
                            </SimpleForm>
                        </Edit>
                    );
                }}
            />
        </Admin>
    </TestMemoryRouter>
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
                <TextInput source="title" />
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
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditWithAutocomplete} />
        </Admin>
    </TestMemoryRouter>
);

export const Scalar = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
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
    </TestMemoryRouter>
);

export const ScalarI18n = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={dataProvider}
            i18nProvider={testI18nProvider({
                messages: {
                    resources: {
                        books: {
                            fields: {
                                tags: 'Some tags',
                                tag: 'A tag',
                            },
                        },
                    },
                },
            })}
        >
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
                                        label="resources.books.fields.tag"
                                        helperText={false}
                                    />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const ScalarWithValidation = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
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
                                        validate={required()}
                                        helperText={false}
                                    />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const order = {
    id: 1,
    date: '2022-08-30',
    customer: 'John Doe',
    items: [
        {
            name: 'Office Jeans',
            price: 45.99,
            quantity: 1,
            extras: [
                {
                    type: 'card',
                    price: 2.99,
                    content: 'For you my love',
                },
                {
                    type: 'gift package',
                    price: 1.99,
                    content: '',
                },
                {
                    type: 'insurance',
                    price: 5,
                    content: '',
                },
            ],
        },
        {
            name: 'Black Elegance Jeans',
            price: 69.99,
            quantity: 2,
            extras: [
                {
                    type: 'card',
                    price: 2.99,
                    content: 'For you my love',
                },
            ],
        },
        {
            name: 'Slim Fit Jeans',
            price: 55.99,
            quantity: 1,
        },
    ],
};

export const Realistic = () => (
    <TestMemoryRouter initialEntries={['/orders/1']}>
        <Admin
            dataProvider={
                {
                    getOne: () => Promise.resolve({ data: order }),
                    update: (_resource, params) => Promise.resolve(params),
                } as any
            }
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
                        <SimpleForm sx={{ maxWidth: 600 }}>
                            <TextInput source="customer" helperText={false} />
                            <DateInput source="date" helperText={false} />
                            <ArrayInput source="items">
                                <SimpleFormIterator inline>
                                    <TextInput
                                        source="name"
                                        helperText={false}
                                        sx={{ width: 250 }}
                                    />
                                    <NumberInput
                                        source="price"
                                        helperText={false}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    €
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ maxWidth: 120 }}
                                    />
                                    <NumberInput
                                        source="quantity"
                                        helperText={false}
                                        sx={{ maxWidth: 120 }}
                                    />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const orderNested = {
    id: 1,
    date: '2022-08-30',
    customer: 'John Doe',
    items: [
        {
            name: { en: 'Office Jeans', fr: 'Jean de bureau' },
            price: 45.99,
            quantity: 1,
            extras: [
                {
                    type: 'card',
                    price: 2.99,
                    content: {
                        en: 'For you my love',
                        fr: 'Pour toi mon amour',
                    },
                },
                {
                    type: 'gift package',
                    price: 1.99,
                },
                {
                    type: 'insurance',
                    price: 5,
                },
            ],
        },
        {
            name: {
                en: 'Black Elegance Jeans',
                fr: 'Jean élégant noir',
            },
            price: 69.99,
            quantity: 2,
            extras: [
                {
                    type: 'card',
                    price: 2.99,
                    content: {
                        en: 'For you my love',
                        fr: 'Pour toi mon amour',
                    },
                },
            ],
        },
        {
            name: { en: 'Slim Fit Jeans', fr: 'Jean slim' },
            price: 55.99,
            quantity: 1,
        },
    ],
};
export const NestedInline = () => (
    <TestMemoryRouter initialEntries={['/orders/1']}>
        <Admin
            dataProvider={
                {
                    getOne: () => Promise.resolve({ data: orderNested }),
                    update: (_resource, params) => Promise.resolve(params),
                } as any
            }
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
                                <SimpleFormIterator
                                    inline
                                    sx={{
                                        '& .MuiStack-root': {
                                            flexWrap: 'wrap',
                                        },
                                    }}
                                >
                                    <TranslatableInputs locales={['en', 'fr']}>
                                        <TextInput
                                            source="name"
                                            helperText={false}
                                            sx={{ width: 200 }}
                                        />
                                    </TranslatableInputs>
                                    <NumberInput
                                        source="price"
                                        helperText={false}
                                        sx={{ width: 100 }}
                                    />
                                    <NumberInput
                                        source="quantity"
                                        helperText={false}
                                        sx={{ width: 100 }}
                                    />
                                    <ArrayInput source="extras">
                                        <SimpleFormIterator
                                            inline
                                            disableReordering
                                        >
                                            <TextInput
                                                source="type"
                                                helperText={false}
                                                sx={{ width: 100 }}
                                            />
                                            <NumberInput
                                                source="price"
                                                helperText={false}
                                                sx={{ width: 100 }}
                                            />
                                            <TranslatableInputs
                                                locales={['en', 'fr']}
                                            >
                                                <TextInput
                                                    source="content"
                                                    helperText={false}
                                                    sx={{ width: 200 }}
                                                />
                                            </TranslatableInputs>
                                        </SimpleFormIterator>
                                    </ArrayInput>
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const NestedInlineNoTranslation = () => (
    <TestMemoryRouter initialEntries={['/orders/1']}>
        <Admin
            dataProvider={
                {
                    getOne: () => Promise.resolve({ data: orderNested }),
                    update: (_resource, params) => Promise.resolve(params),
                } as any
            }
            i18nProvider={testI18nProvider()}
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
                                <SimpleFormIterator
                                    sx={{
                                        '& .MuiStack-root': {
                                            flexWrap: 'wrap',
                                        },
                                    }}
                                >
                                    <TranslatableInputs locales={['en', 'fr']}>
                                        <Labeled source="name">
                                            <TextField source="name" />
                                        </Labeled>
                                    </TranslatableInputs>
                                    <TranslatableFields locales={['en', 'fr']}>
                                        <TextField source="name" />
                                        {/* Duplicated so that TranslatableFields adds labels */}
                                        <TextField source="name" />
                                    </TranslatableFields>
                                    <NumberInput
                                        source="price"
                                        helperText={false}
                                    />
                                    <NumberInput
                                        source="quantity"
                                        helperText={false}
                                    />
                                    <ArrayInput source="extras">
                                        <SimpleFormIterator
                                            inline
                                            disableReordering
                                        >
                                            <TextInput
                                                source="type"
                                                helperText={false}
                                            />
                                            <NumberInput
                                                source="price"
                                                helperText={false}
                                            />
                                            <TranslatableInputs
                                                locales={['en', 'fr']}
                                            >
                                                <TextInput
                                                    source="content"
                                                    helperText={false}
                                                />
                                            </TranslatableInputs>
                                        </SimpleFormIterator>
                                    </ArrayInput>
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const ActionsLeft = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
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
                            <ArrayInput source="authors">
                                <SimpleFormIterator
                                    sx={{
                                        '& .RaSimpleFormIterator-indexContainer':
                                            {
                                                order: 0,
                                            },
                                        '& .RaSimpleFormIterator-action': {
                                            order: 1,
                                            visibility: 'visible',
                                        },
                                        '& .RaSimpleFormIterator-form': {
                                            order: 2,
                                        },
                                    }}
                                >
                                    <TextInput source="name" />
                                    <TextInput source="role" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const BookEditValidation = () => {
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
                <ArrayInput
                    source="authors"
                    fullWidth
                    validate={[
                        required(),
                        minLength(2, 'You need two authors at minimum'),
                    ]}
                    helperText="At least two authors"
                >
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <TextInput source="role" validate={required()} />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};

export const Validation = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditValidation} />
        </Admin>
    </TestMemoryRouter>
);

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

export const GlobalValidation = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditGlobalValidation} />
        </Admin>
    </TestMemoryRouter>
);

const CreateGlobalValidationInFormTab = () => {
    return (
        <Create
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <TabbedForm validate={globalValidator}>
                {/*
                  We still need `validate={required()}` to indicate fields are required
                  with a '*' symbol after the label, but the real validation happens in `globalValidator`
                */}
                <TabbedForm.Tab label="Main">
                    <TextInput source="title" />
                    <ArrayInput
                        source="authors"
                        fullWidth
                        validate={required()}
                    >
                        <SimpleFormIterator>
                            <TextInput source="name" validate={required()} />
                            <TextInput source="role" validate={required()} />
                        </SimpleFormIterator>
                    </ArrayInput>
                </TabbedForm.Tab>
            </TabbedForm>
        </Create>
    );
};

export const ValidationInFormTab = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" create={CreateGlobalValidationInFormTab} />
        </Admin>
    </TestMemoryRouter>
);

const countries = [
    { id: 1, name: 'France' },
    { id: 2, name: 'Italy' },
    { id: 3, name: 'Spain' },
    { id: 4, name: 'Russia' },
];
const dataProviderWithCountries = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                authors: [
                    {
                        name: 'Leo Tolstoy',
                        role: 'head_writer',
                        country_id: 4,
                    },
                    {
                        name: 'Alexander Pushkin',
                        role: 'co_writer',
                        country_id: 2,
                    },
                ],
                tags: ['novel', 'war', 'classic'],
            },
        }),
    getList: () =>
        Promise.resolve({ data: countries, count: countries.length }),
    getMany: (_resource, params) => {
        return Promise.resolve({
            data: countries.filter(country => params.ids.includes(country.id)),
        });
    },
} as any;

const EditWithReferenceField = () => (
    <Edit>
        <SimpleForm>
            <ArrayInput source="authors" fullWidth validate={required()}>
                <SimpleFormIterator>
                    <TextInput source="name" validate={required()} />
                    <TextInput source="role" validate={required()} />
                    <Labeled source="country_id">
                        <ReferenceField
                            source="country_id"
                            reference="countries"
                        >
                            <TextField source="name" />
                        </ReferenceField>
                    </Labeled>
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);

export const WithReferenceField = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithCountries}>
            <Resource name="books" edit={EditWithReferenceField} />
        </Admin>
    </TestMemoryRouter>
);

const MakeAdminButton = () => {
    const sourceContext = useSourceContext();
    const { setValue } = useFormContext();

    const onClick = () => {
        setValue(sourceContext.getSource('role'), 'admin');
    };

    return (
        <Button onClick={onClick} size="small" sx={{ minWidth: 120 }}>
            Make admin
        </Button>
    );
};

const BookEditSetValue = () => {
    return (
        <Edit>
            <SimpleForm>
                <ArrayInput source="authors">
                    <SimpleFormIterator inline>
                        <TextInput source="name" helperText={false} />
                        <TextInput source="role" helperText={false} />
                        <MakeAdminButton />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};

export const SetValue = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditSetValue} />
        </Admin>
    </TestMemoryRouter>
);
