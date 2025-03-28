import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,
    Box,
    TextField,
} from '@mui/material';
import fakeRestProvider from 'ra-data-fakerest';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { SelectArrayInput } from './SelectArrayInput';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import { TextInput } from './TextInput';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';
import { Resource, TestMemoryRouter } from 'ra-core';
import { Admin } from 'react-admin';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/SelectArrayInput' };

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider} defaultTheme="light">
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm>{children}</SimpleForm>
        </Create>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper>
        <SelectArrayInput
            source="roles"
            choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]}
        />
    </Wrapper>
);

export const StringChoices = () => (
    <Wrapper>
        <SelectArrayInput
            source="roles"
            choices={['Admin', 'Editor', 'Moderator', 'Reviewer']}
        />
    </Wrapper>
);

export const Variant = () => (
    <Wrapper>
        <SelectArrayInput
            source="roles"
            choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]}
        />
        <SelectArrayInput
            source="roles"
            variant="outlined"
            choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]}
        />
        <SelectArrayInput
            source="roles"
            variant="standard"
            choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]}
        />
    </Wrapper>
);

export const Disabled = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="users"
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 800 }}
        >
            <SimpleForm>
                <Stack direction="row">
                    <Box>
                        <SelectArrayInput
                            source="roles"
                            choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'u001', name: 'Editor' },
                                { id: 'u002', name: 'Moderator' },
                                { id: 'u003', name: 'Reviewer' },
                            ]}
                            sx={{ width: 300 }}
                            disabled
                        />
                        <SelectArrayInput
                            source="roles"
                            variant="outlined"
                            choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'u001', name: 'Editor' },
                                { id: 'u002', name: 'Moderator' },
                                { id: 'u003', name: 'Reviewer' },
                            ]}
                            sx={{ width: 300 }}
                            disabled
                        />
                        <SelectArrayInput
                            source="roles"
                            variant="standard"
                            choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'u001', name: 'Editor' },
                                { id: 'u002', name: 'Moderator' },
                                { id: 'u003', name: 'Reviewer' },
                            ]}
                            sx={{ width: 300 }}
                            disabled
                        />
                    </Box>
                    <Box>
                        <SelectArrayInput
                            source="title"
                            sx={{ width: 300 }}
                            disabled
                        />
                        <SelectArrayInput
                            source="title"
                            variant="outlined"
                            sx={{ width: 300 }}
                            disabled
                        />
                        <SelectArrayInput
                            source="title"
                            variant="standard"
                            sx={{ width: 300 }}
                            disabled
                        />
                    </Box>
                </Stack>
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const ReadOnly = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="users"
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 800 }}
        >
            <SimpleForm>
                <Stack direction="row">
                    <Box>
                        <SelectArrayInput
                            source="roles"
                            choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'u001', name: 'Editor' },
                                { id: 'u002', name: 'Moderator' },
                                { id: 'u003', name: 'Reviewer' },
                            ]}
                            sx={{ width: 300 }}
                            readOnly
                        />
                        <SelectArrayInput
                            source="roles"
                            variant="outlined"
                            choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'u001', name: 'Editor' },
                                { id: 'u002', name: 'Moderator' },
                                { id: 'u003', name: 'Reviewer' },
                            ]}
                            sx={{ width: 300 }}
                            readOnly
                        />
                        <SelectArrayInput
                            source="roles"
                            variant="standard"
                            choices={[
                                { id: 'admin', name: 'Admin' },
                                { id: 'u001', name: 'Editor' },
                                { id: 'u002', name: 'Moderator' },
                                { id: 'u003', name: 'Reviewer' },
                            ]}
                            sx={{ width: 300 }}
                            readOnly
                        />
                    </Box>
                    <Box>
                        <SelectArrayInput
                            source="title"
                            sx={{ width: 300 }}
                            readOnly
                        />
                        <SelectArrayInput
                            source="title"
                            variant="outlined"
                            sx={{ width: 300 }}
                            readOnly
                        />
                        <SelectArrayInput
                            source="title"
                            variant="standard"
                            sx={{ width: 300 }}
                            readOnly
                        />
                    </Box>
                </Stack>
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const DefaultValue = () => (
    <Wrapper>
        <SelectArrayInput
            source="roles"
            defaultValue={['u001', 'u003']}
            choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]}
            sx={{ width: 300 }}
        />
    </Wrapper>
);

export const InsideArrayInput = () => (
    <Wrapper>
        <ArrayInput
            source="items"
            label="Items"
            defaultValue={[{ data: ['foo'] }]}
        >
            <SimpleFormIterator>
                <SelectArrayInput
                    label="data"
                    source="data"
                    choices={[
                        { id: 'foo', name: 'Foo' },
                        { id: 'bar', name: 'Bar' },
                    ]}
                    defaultValue={['foo']}
                />
            </SimpleFormIterator>
        </ArrayInput>
        <FormInspector name="items" />
    </Wrapper>
);

const choices = [
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
];

const CreateRole = () => {
    const { onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState('');

    const handleSubmit = event => {
        event.preventDefault();
        const newOption = { id: value, name: value };
        choices.push(newOption);
        setValue('');
        onCreate(newOption);
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Role name"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export const CreateProp = () => (
    <Wrapper>
        <SelectArrayInput
            source="roles"
            choices={choices}
            defaultValue={['u001', 'u003']}
            create={<CreateRole />}
        />
    </Wrapper>
);

export const CreateLabel = () => (
    <Wrapper>
        <SelectArrayInput
            source="roles"
            choices={choices}
            defaultValue={['u001', 'u003']}
            create={<CreateRole />}
            createLabel="Create a new role"
        />
    </Wrapper>
);

export const DifferentIdTypes = () => {
    const fakeData = {
        bands: [{ id: 1, name: 'band_1', members: [1, '2'] }],
        artists: [
            { id: 1, name: 'artist_1' },
            { id: 2, name: 'artist_2' },
            { id: 3, name: 'artist_3' },
        ],
    };
    const dataProvider = fakeRestProvider(fakeData, false);
    return (
        <AdminContext dataProvider={dataProvider} defaultTheme="light">
            <Edit resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleForm>
                    <TextInput source="name" />
                    <SelectArrayInput
                        source="members"
                        choices={fakeData.artists}
                    ></SelectArrayInput>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};

export const Size = () => {
    const fakeData = {
        bands: [{ id: 1, name: 'band_1', members: [1, '2'] }],
        artists: [
            { id: 1, name: 'artist_1' },
            { id: 2, name: 'artist_2' },
            { id: 3, name: 'artist_3' },
        ],
    };
    const dataProvider = fakeRestProvider(fakeData, false);
    return (
        <AdminContext dataProvider={dataProvider} defaultTheme="light">
            <Edit resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleForm>
                    <TextInput source="name" />
                    <SelectArrayInput
                        source="members"
                        choices={fakeData.artists}
                        size="small"
                    />
                    <SelectArrayInput
                        source="members"
                        choices={fakeData.artists}
                        size="medium"
                    />
                    <SelectArrayInput
                        source="members"
                        choices={fakeData.artists}
                        size="small"
                        variant="outlined"
                    />
                    <SelectArrayInput
                        source="members"
                        choices={fakeData.artists}
                        size="medium"
                        variant="outlined"
                    />
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};

export const TranslateChoice = () => {
    const i18nProvider = polyglotI18nProvider(() => ({
        ...englishMessages,
        'option.tech': 'Tech',
        'option.business': 'Business',
    }));
    return (
        <AdminContext
            i18nProvider={i18nProvider}
            dataProvider={
                {
                    getOne: () =>
                        Promise.resolve({ data: { id: 1, tags: ['tech'] } }),
                    getList: () =>
                        Promise.resolve({
                            data: [
                                { id: 'tech', name: 'option.tech' },
                                { id: 'business', name: 'option.business' },
                            ],
                            total: 2,
                        }),
                    getMany: (_resource, { ids }) =>
                        Promise.resolve({
                            data: [
                                { id: 'tech', name: 'option.tech' },
                                { id: 'business', name: 'option.business' },
                            ].filter(({ id }) => ids.includes(id)),
                        }),
                } as any
            }
            defaultTheme="light"
        >
            <Edit resource="posts" id="1">
                <SimpleForm>
                    <SelectArrayInput
                        label="translateChoice default"
                        source="tags"
                        id="tags1"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                    />
                    <SelectArrayInput
                        label="translateChoice true"
                        source="tags"
                        id="tags2"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                        translateChoice
                    />
                    <SelectArrayInput
                        label="translateChoice false"
                        source="tags"
                        id="tags3"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                        translateChoice={false}
                    />
                    <ReferenceArrayInput reference="tags" source="tags">
                        <SelectArrayInput
                            optionText="name"
                            label="inside ReferenceArrayInput"
                            id="tags4"
                        />
                    </ReferenceArrayInput>
                    <ReferenceArrayInput reference="tags" source="tags">
                        <SelectArrayInput
                            optionText="name"
                            label="inside ReferenceArrayInput forced"
                            id="tags5"
                            translateChoice
                        />
                    </ReferenceArrayInput>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
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

const dataProviderWithAuthors = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                authors: [1],
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
    create: (_resource, params) => {
        const newAuthor = {
            id: authors.length + 1,
            first_name: params.data.first_name,
            last_name: params.data.last_name,
            language: params.data.language,
        };
        authors.push(newAuthor);
        return Promise.resolve({ data: newAuthor });
    },
} as any;

export const InsideReferenceArrayInput = () => (
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
                            <ReferenceArrayInput
                                reference="authors"
                                source="authors"
                            >
                                <SelectArrayInput />
                            </ReferenceArrayInput>
                            <FormInspector name="authors" />
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const InsideReferenceArrayInputDefaultValue = ({
    onSuccess = console.log,
}) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={{
                ...dataProviderWithAuthors,
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 1,
                            title: 'War and Peace',
                            // trigger default value
                            author: undefined,
                            summary:
                                "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                            year: 1869,
                        },
                    }),
            }}
        >
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
                        mutationOptions={{ onSuccess }}
                    >
                        <SimpleForm>
                            <TextInput source="title" />
                            <ReferenceArrayInput
                                reference="authors"
                                source="authors"
                            >
                                <SelectArrayInput />
                            </ReferenceArrayInput>
                            <FormInspector name="authors" />
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const InsideReferenceArrayInputWithError = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={{
                ...dataProviderWithAuthors,
                getList: () =>
                    Promise.reject(
                        new Error('Error while fetching the authors')
                    ),
            }}
        >
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
                            <ReferenceArrayInput
                                reference="authors"
                                source="authors"
                            >
                                <SelectArrayInput />
                            </ReferenceArrayInput>
                            <FormInspector name="authors" />
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);
