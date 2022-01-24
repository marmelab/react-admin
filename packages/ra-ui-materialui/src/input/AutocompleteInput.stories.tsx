import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, required, useCreate } from 'ra-core';
import { createMemoryHistory } from 'history';
import {
    Dialog,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Stack,
} from '@mui/material';

import { Edit } from '../detail';
import { SimpleForm } from '../form';
import { AutocompleteInput } from './AutocompleteInput';
import { ReferenceInput } from './ReferenceInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

export default { title: 'ra-ui-materialui/input/AutocompleteInput' };

const dataProvider = {
    getOne: (resource, params) =>
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
    update: (resource, params) => Promise.resolve(params),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1'] });

const BookEdit = () => {
    const choices = [
        { id: 1, name: 'Leo Tolstoy' },
        { id: 2, name: 'Victor Hugo' },
        { id: 3, name: 'William Shakespeare' },
        { id: 4, name: 'Charles Baudelaire' },
        { id: 5, name: 'Marcel Proust' },
    ];
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
                <AutocompleteInput
                    source="author"
                    choices={choices}
                    validate={required()}
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    );
};

export const Basic = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEdit} />
    </Admin>
);

const BookEditCustomText = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy' },
        { id: 2, fullName: 'Victor Hugo' },
        { id: 3, fullName: 'William Shakespeare' },
        { id: 4, fullName: 'Charles Baudelaire' },
        { id: 5, fullName: 'Marcel Proust' },
    ];
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
                <AutocompleteInput
                    source="author"
                    optionText="fullName"
                    choices={choices}
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomText = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditCustomText} />
    </Admin>
);

const BookEditCustomTextFunction = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy' },
        { id: 2, fullName: 'Victor Hugo' },
        { id: 3, fullName: 'William Shakespeare' },
        { id: 4, fullName: 'Charles Baudelaire' },
        { id: 5, fullName: 'Marcel Proust' },
    ];
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
                <AutocompleteInput
                    source="author"
                    optionText={choice => choice?.fullName}
                    choices={choices}
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomTextFunction = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditCustomTextFunction} />
    </Admin>
);

const CustomOption = ({ record, ...rest }) => (
    <div {...rest}>
        {record?.fullName}&nbsp;<i>({record?.language})</i>
    </div>
);

const BookEditCustomOptions = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy', language: 'Russian' },
        { id: 2, fullName: 'Victor Hugo', language: 'French' },
        { id: 3, fullName: 'William Shakespeare', language: 'English' },
        { id: 4, fullName: 'Charles Baudelaire', language: 'French' },
        { id: 5, fullName: 'Marcel Proust', language: 'French' },
    ];
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
                <AutocompleteInput
                    fullWidth
                    source="author"
                    optionText={<CustomOption />}
                    inputText={record => record.fullName}
                    matchSuggestion={(searchText, record) => {
                        const searchTextLower = searchText.toLowerCase();
                        const match =
                            record.fullName
                                .toLowerCase()
                                .includes(searchTextLower) ||
                            record.language
                                .toLowerCase()
                                .includes(searchTextLower);

                        return match;
                    }}
                    choices={choices}
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomOptions = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditCustomOptions} />
    </Admin>
);

const choicesForCreationSupport = [
    { id: 1, name: 'Leo Tolstoy' },
    { id: 2, name: 'Victor Hugo' },
    { id: 3, name: 'William Shakespeare' },
    { id: 4, name: 'Charles Baudelaire' },
    { id: 5, name: 'Marcel Proust' },
];
const BookEditWithCreationSupport = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <AutocompleteInput
                source="author"
                choices={choicesForCreationSupport}
                onCreate={filter => {
                    const newAuthorName = window.prompt(
                        'Enter a new author',
                        filter
                    );

                    if (newAuthorName) {
                        const newAuthor = {
                            id: choicesForCreationSupport.length + 1,
                            name: newAuthorName,
                        };
                        choicesForCreationSupport.push(newAuthor);
                        return newAuthor;
                    }
                }}
                fullWidth
            />
        </SimpleForm>
    </Edit>
);

export const CreationSupport = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditWithCreationSupport} />
    </Admin>
);

const authors = [
    { id: 1, name: 'Leo Tolstoy', language: 'Russian' },
    { id: 2, name: 'Victor Hugo', language: 'French' },
    { id: 3, name: 'William Shakespeare', language: 'English' },
    { id: 4, name: 'Charles Baudelaire', language: 'French' },
    { id: 5, name: 'Marcel Proust', language: 'French' },
];

const dataProviderWithAuthors = {
    getOne: (resource, params) =>
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
    getMany: (resource, params) =>
        Promise.resolve({
            data: authors.filter(author => params.ids.includes(author.id)),
        }),
    getList: (resource, params) =>
        new Promise(resolve => {
            // eslint-disable-next-line eqeqeq
            if (params.filter.q == undefined) {
                setTimeout(
                    () =>
                        resolve({
                            data: authors,
                            total: authors.length,
                        }),
                    500
                );
                return;
            }

            const filteredAuthors = authors.filter(author =>
                author.name
                    .toLowerCase()
                    .includes(params.filter.q.toLowerCase())
            );

            setTimeout(
                () =>
                    resolve({
                        data: filteredAuthors,
                        total: filteredAuthors.length,
                    }),
                500
            );
        }),
    update: (resource, params) => Promise.resolve(params),
    create: (resource, params) => {
        const newAuthor = {
            id: authors.length + 1,
            name: params.data.name,
            language: params.data.language,
        };
        authors.push(newAuthor);
        return Promise.resolve({ data: newAuthor });
    },
} as any;

const BookEditWithReference = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <ReferenceInput reference="authors" source="author" fullWidth>
                <AutocompleteInput />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const InsideReferenceInput = () => (
    <Admin dataProvider={dataProviderWithAuthors} history={history}>
        <Resource name="authors" />
        <Resource name="books" edit={BookEditWithReference} />
    </Admin>
);

const CreateAuthor = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [name, setName] = React.useState(filter || '');
    const [language, setLanguage] = React.useState('');
    const [create] = useCreate();

    const handleSubmit = event => {
        event.preventDefault();
        create(
            'authors',
            {
                data: {
                    name,
                    language,
                },
            },
            {
                onSuccess: ({ data }) => {
                    setName('');
                    setLanguage('');
                    onCreate(data);
                },
            }
        );
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack gap={4}>
                        <TextField
                            name="name"
                            label="The author name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            autoFocus
                        />
                        <TextField
                            name="language"
                            label="The author language"
                            value={language}
                            onChange={event => setLanguage(event.target.value)}
                            autoFocus
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const BookEditWithReferenceAndCreationSupport = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <ReferenceInput reference="authors" source="author" fullWidth>
                <AutocompleteInput
                    create={<CreateAuthor />}
                    options={{
                        renderOption: (props, choice) => (
                            <div {...props}>
                                {choice.name}{' '}
                                {choice.language ? (
                                    <i>({choice.language})</i>
                                ) : null}
                            </div>
                        ),
                    }}
                />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const InsideReferenceInputWithCreationSupport = () => (
    <Admin dataProvider={dataProviderWithAuthors} history={history}>
        <Resource name="authors" />
        <Resource name="books" edit={BookEditWithReferenceAndCreationSupport} />
    </Admin>
);
