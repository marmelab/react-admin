import * as React from 'react';
import { Admin, Datagrid, List, TextField } from 'react-admin';
import { QueryClient } from '@tanstack/react-query';
import {
    Resource,
    Form,
    testDataProvider,
    useRedirect,
    TestMemoryRouter,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Stack, Divider, Typography, Button, Paper } from '@mui/material';

import { AdminContext } from '../AdminContext';
import { Edit } from '../detail';
import { SimpleForm } from '../form';
import {
    SelectInput,
    RadioButtonGroupInput,
    TextInput,
    ArrayInput,
    SimpleFormIterator,
} from '../input';
import { ReferenceInput } from './ReferenceInput';
import { ListGuesser } from '../list/ListGuesser';

export default {
    title: 'ra-ui-materialui/input/ReferenceInput',
    excludeStories: ['dataProviderWithAuthors'],
};

const authors = [
    { id: 1, first_name: 'Leo', last_name: 'Tolstoy', language: 'Russian' },
    { id: 2, first_name: 'Victor', last_name: 'Hugo', language: 'French' },
    {
        id: 3,
        first_name: 'William',
        last_name: 'Shakespeare',
        language: 'English',
    },
    {
        id: 4,
        first_name: 'Charles',
        last_name: 'Baudelaire',
        language: 'French',
    },
    { id: 5, first_name: 'Marcel', last_name: 'Proust', language: 'French' },
];

export const dataProviderWithAuthors = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                author: 1,
                summary:
                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                year: 1869,
            },
        }),
    getMany: (_resource, params) =>
        Promise.resolve({
            data: authors.filter(author => params.ids.includes(author.id)),
        }),
    getList: () =>
        new Promise(resolve => {
            // eslint-disable-next-line eqeqeq
            setTimeout(
                () =>
                    resolve({
                        data: authors,
                        total: authors.length,
                    }),
                500
            );
            return;
        }),
    update: (_resource, params) => Promise.resolve(params),
} as any;

const BookEdit = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <ReferenceInput reference="authors" source="author" />
        </SimpleForm>
    </Edit>
);

export const Basic = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
            />
            <Resource name="books" edit={BookEdit} />
        </Admin>
    </TestMemoryRouter>
);

const tags = [
    { id: 5, name: 'lorem' },
    { id: 6, name: 'ipsum' },
];

const dataProvider = testDataProvider({
    getList: () =>
        new Promise(resolve => {
            setTimeout(
                () =>
                    resolve({
                        // @ts-ignore
                        data: tags,
                        total: tags.length,
                    }),
                1500
            );
        }),
    // @ts-ignore
    getMany: (resource, params) => {
        return Promise.resolve({
            data: tags.filter(tag => params.ids.includes(tag.id)),
        });
    },
});

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const Loading = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Paper>
            <Form onSubmit={() => {}} defaultValues={{ tag_ids: [5] }}>
                <Stack direction="row" spacing={2}>
                    <Typography gutterBottom sx={{ width: 200 }}></Typography>
                    <Typography gutterBottom sx={{ width: 200 }}>
                        Variant Default
                    </Typography>
                    <Typography gutterBottom sx={{ width: 200 }}>
                        Variant Standard
                    </Typography>
                    <Typography gutterBottom sx={{ width: 200 }}>
                        Variant Outlined
                    </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2}>
                    <Typography gutterBottom sx={{ width: 200 }}>
                        Default
                    </Typography>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput optionText="name" />
                        </ReferenceInput>
                        <TextInput source="foo" />
                    </Stack>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput optionText="name" variant="standard" />
                        </ReferenceInput>
                        <TextInput source="foo" variant="standard" />
                    </Stack>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput optionText="name" variant="outlined" />
                        </ReferenceInput>
                        <TextInput source="foo" variant="outlined" />
                    </Stack>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2}>
                    <Typography gutterBottom sx={{ width: 200 }}>
                        size
                    </Typography>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput optionText="name" size="medium" />
                        </ReferenceInput>
                        <TextInput source="foo" size="medium" />
                    </Stack>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput
                                optionText="name"
                                variant="standard"
                                size="medium"
                            />
                        </ReferenceInput>
                        <TextInput
                            source="foo"
                            variant="standard"
                            size="medium"
                        />
                    </Stack>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput
                                optionText="name"
                                variant="outlined"
                                size="medium"
                            />
                        </ReferenceInput>
                        <TextInput
                            source="foo"
                            variant="outlined"
                            size="medium"
                        />
                    </Stack>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={2}>
                    <Typography gutterBottom sx={{ width: 200 }}>
                        margin
                    </Typography>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput optionText="name" margin="normal" />
                        </ReferenceInput>
                        <TextInput source="foo" margin="normal" />
                    </Stack>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput
                                optionText="name"
                                variant="standard"
                                margin="normal"
                            />
                        </ReferenceInput>
                        <TextInput
                            source="foo"
                            variant="standard"
                            margin="normal"
                        />
                    </Stack>
                    <Stack sx={{ width: 200 }}>
                        <ReferenceInput
                            reference="tags"
                            resource="posts"
                            source="tag_ids"
                        >
                            <SelectInput
                                optionText="name"
                                variant="outlined"
                                margin="normal"
                            />
                        </ReferenceInput>
                        <TextInput
                            source="foo"
                            variant="outlined"
                            margin="normal"
                        />
                    </Stack>
                </Stack>
            </Form>
        </Paper>
    </AdminContext>
);

const book = {
    id: 1,
    title: 'War and Peace',
    author: 1,
    summary:
        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
    year: 1869,
};

export const ErrorAutocomplete = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={
                {
                    getOne: () => Promise.resolve({ data: book }),
                    getMany: (_resource, params) =>
                        Promise.resolve({
                            data: authors.filter(author =>
                                params.ids.includes(author.id)
                            ),
                        }),
                    getList: (_resource, params) =>
                        params.filter.q === 'lorem'
                            ? Promise.reject(new Error('An error occured'))
                            : Promise.resolve({
                                  data: authors,
                                  total: authors.length,
                              }),
                } as any
            }
            queryClient={
                new QueryClient({
                    defaultOptions: { queries: { retry: false } },
                })
            }
        >
            <Resource
                name="authors"
                recordRepresentation={r => `${r.first_name} ${r.last_name}`}
            />
            <Resource
                name="books"
                edit={() => (
                    <Edit mutationMode="pessimistic">
                        <SimpleForm>
                            <ReferenceInput
                                reference="authors"
                                source="author"
                            />
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithSelectInput = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
            />
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
                            <ReferenceInput reference="authors" source="author">
                                <SelectInput optionText="first_name" />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const ErrorSelectInput = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={
                {
                    getOne: () => Promise.resolve({ data: book }),
                    getMany: (_resource, params) =>
                        Promise.resolve({
                            data: authors.filter(author =>
                                params.ids.includes(author.id)
                            ),
                        }),
                    getList: (_resource, _params) =>
                        Promise.reject(new Error('An error occured')),
                } as any
            }
            queryClient={
                new QueryClient({
                    defaultOptions: { queries: { retry: false } },
                })
            }
        >
            <Resource
                name="authors"
                recordRepresentation={r => `${r.first_name} ${r.last_name}`}
            />
            <Resource
                name="books"
                edit={() => (
                    <Edit mutationMode="pessimistic">
                        <SimpleForm>
                            <ReferenceInput reference="authors" source="author">
                                <SelectInput />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithRadioButtonGroupInput = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
            />
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
                            <ReferenceInput reference="authors" source="author">
                                <RadioButtonGroupInput optionText="first_name" />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const ErrorRadioButtonGroupInput = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={
                {
                    getOne: () => Promise.resolve({ data: book }),
                    getMany: (_resource, params) =>
                        Promise.resolve({
                            data: authors.filter(author =>
                                params.ids.includes(author.id)
                            ),
                        }),
                    getList: (_resource, _params) =>
                        Promise.reject(new Error('An error occured')),
                } as any
            }
            queryClient={
                new QueryClient({
                    defaultOptions: { queries: { retry: false } },
                })
            }
        >
            <Resource
                name="authors"
                recordRepresentation={r => `${r.first_name} ${r.last_name}`}
            />
            <Resource
                name="books"
                edit={() => (
                    <Edit mutationMode="pessimistic">
                        <SimpleForm>
                            <ReferenceInput reference="authors" source="author">
                                <RadioButtonGroupInput optionText="first_name" />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AuthorList = () => (
    <List>
        <Datagrid>
            <TextField source="first_name" />
            <TextField source="last_name" />
        </Datagrid>
    </List>
);

const BookEditWithSelfReference = () => {
    const redirect = useRedirect();
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: () => {
                    // Redirecting to another page is an indirect way to make sure that
                    // no errors happened during the update nor its side effects
                    // (used by the jest tests)
                    redirect('/authors');
                },
            }}
        >
            <SimpleForm>
                <TextInput source="title" />
                <ReferenceInput reference="books" source="self_reference" />
            </SimpleForm>
        </Edit>
    );
};

export const SelfReference = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
                list={AuthorList}
            />
            <Resource name="books" edit={BookEditWithSelfReference} />
        </Admin>
    </TestMemoryRouter>
);

const BookEditQueryOptions = () => {
    const [enabled, setEnabled] = React.useState(false);
    return (
        <Edit mutationMode="pessimistic">
            <Button onClick={() => setEnabled(!enabled)}>
                Toggle queryOptions
            </Button>
            <SimpleForm>
                <TextInput source="title" />
                <ReferenceInput
                    reference="authors"
                    source="author"
                    queryOptions={{ enabled }}
                />
            </SimpleForm>
        </Edit>
    );
};

export const QueryOptions = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={fakeRestDataProvider(
                {
                    books: [
                        {
                            id: 1,
                            title: 'War and Peace',
                            author: 1,
                            summary:
                                "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                            year: 1869,
                        },
                    ],
                    authors: [
                        {
                            id: 1,
                            first_name: 'Leo',
                            last_name: 'Tolstoy',
                            language: 'Russian',
                        },
                        {
                            id: 2,
                            first_name: 'Victor',
                            last_name: 'Hugo',
                            language: 'French',
                        },
                        {
                            id: 3,
                            first_name: 'William',
                            last_name: 'Shakespeare',
                            language: 'English',
                        },
                        {
                            id: 4,
                            first_name: 'Charles',
                            last_name: 'Baudelaire',
                            language: 'French',
                        },
                        {
                            id: 5,
                            first_name: 'Marcel',
                            last_name: 'Proust',
                            language: 'French',
                        },
                    ],
                },
                process.env.NODE_ENV === 'development'
            )}
        >
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
                list={AuthorList}
            />
            <Resource name="books" edit={BookEditQueryOptions} />
        </Admin>
    </TestMemoryRouter>
);

const CollectionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <ArrayInput source="books">
                <SimpleFormIterator>
                    <TextInput source="title" />
                    <ReferenceInput
                        reference="authors"
                        source="author_id"
                        perPage={1}
                    />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);

export const InArrayInput = () => (
    <TestMemoryRouter initialEntries={['/collections/1']}>
        <Admin
            dataProvider={fakeRestDataProvider(
                {
                    collections: [
                        {
                            id: 1,
                            name: 'Novels',
                            books: [
                                {
                                    title: 'War and Peace',
                                    author_id: 1,
                                    summary:
                                        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                                    year: 1869,
                                },
                                {
                                    title: 'Les misérables',
                                    author_id: 2,
                                    summary:
                                        'Les Misérables is a French historical novel by Victor Hugo, first published in 1862, that is considered one of the greatest novels of the 19th century.',
                                    year: 1862,
                                },
                            ],
                        },
                    ],
                    authors: [
                        {
                            id: 1,
                            first_name: 'Leo',
                            last_name: 'Tolstoy',
                            language: 'Russian',
                        },
                        {
                            id: 2,
                            first_name: 'Victor',
                            last_name: 'Hugo',
                            language: 'French',
                        },
                        {
                            id: 3,
                            first_name: 'William',
                            last_name: 'Shakespeare',
                            language: 'English',
                        },
                        {
                            id: 4,
                            first_name: 'Charles',
                            last_name: 'Baudelaire',
                            language: 'French',
                        },
                        {
                            id: 5,
                            first_name: 'Marcel',
                            last_name: 'Proust',
                            language: 'French',
                        },
                    ],
                },
                process.env.NODE_ENV === 'development'
            )}
        >
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
            />
            <Resource
                name="collections"
                list={ListGuesser}
                edit={CollectionEdit}
            />
        </Admin>
    </TestMemoryRouter>
);
