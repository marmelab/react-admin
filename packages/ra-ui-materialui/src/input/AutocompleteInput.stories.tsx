import * as React from 'react';
import { Admin, AdminContext } from 'react-admin';

import {
    Resource,
    required,
    useCreate,
    useRecordContext,
    ListBase,
    useListContext,
    RecordContextProvider,
    TestMemoryRouter,
} from 'ra-core';

import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    Typography,
    Box,
    InputAdornment,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import fakeRestProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import AttributionIcon from '@mui/icons-material/Attribution';

import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { AutocompleteInput, AutocompleteInputProps } from './AutocompleteInput';
import { ReferenceInput } from './ReferenceInput';
import { TextInput } from './TextInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import { useState } from 'react';

export default { title: 'ra-ui-materialui/input/AutocompleteInput' };

const dataProviderDefault = {
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
    update: (_resource, params) => Promise.resolve(params),
} as any;

const dataProviderEmpty = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                author: 1,
                authorNone: 1,
                authorEmpty: 1,
                authorZero: 1,
                summary:
                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                year: 1869,
            },
        }),
    update: (_resource, params) => Promise.resolve(params),
} as any;

const Wrapper = ({
    children,
    dataProvider = dataProviderDefault,
    onSuccess = data => {
        console.log(data);
    },
}) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        mutationMode="pessimistic"
                        mutationOptions={{ onSuccess }}
                    >
                        <SimpleForm>{children}</SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const defaultChoices = [
    { id: 1, name: 'Leo Tolstoy' },
    { id: 2, name: 'Victor Hugo' },
    { id: 3, name: 'William Shakespeare' },
    { id: 4, name: 'Charles Baudelaire' },
    { id: 5, name: 'Marcel Proust' },
];

export const Basic = ({ onSuccess = console.log }) => (
    <Wrapper onSuccess={onSuccess}>
        <AutocompleteInput source="author" choices={defaultChoices} />
    </Wrapper>
);

export const StringChoices = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            choices={[
                'Leo Tolstoy',
                'Victor Hugo',
                'William Shakespeare',
                'Charles Baudelaire',
                'Marcel Proust',
            ]}
        />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            choices={defaultChoices}
            fullWidth
            readOnly
        />
        <AutocompleteInput
            source="genre"
            choices={defaultChoices}
            fullWidth
            readOnly
        />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            choices={defaultChoices}
            fullWidth
            disabled
        />
        <AutocompleteInput
            source="genre"
            choices={defaultChoices}
            fullWidth
            disabled
        />
    </Wrapper>
);

export const Required = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            choices={defaultChoices}
            validate={required()}
        />
    </Wrapper>
);

export const IsPending = () => (
    <Wrapper>
        <AutocompleteInput source="author" isPending />
    </Wrapper>
);

export const OnChange = ({
    onChange = (value, record) => console.log({ value, record }),
}: Pick<AutocompleteInputProps, 'onChange'>) => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            choices={defaultChoices}
            onChange={onChange}
        />
    </Wrapper>
);

export const OptionTextString = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            optionText="fullName"
            choices={[
                { id: 1, fullName: 'Leo Tolstoy' },
                { id: 2, fullName: 'Victor Hugo' },
                { id: 3, fullName: 'William Shakespeare' },
                { id: 4, fullName: 'Charles Baudelaire' },
                { id: 5, fullName: 'Marcel Proust' },
            ]}
        />
    </Wrapper>
);

export const OptionTextFunction = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            optionText={choice => choice?.fullName}
            choices={[
                { id: 1, fullName: 'Leo Tolstoy' },
                { id: 2, fullName: 'Victor Hugo' },
                { id: 3, fullName: 'William Shakespeare' },
                { id: 4, fullName: 'Charles Baudelaire' },
                { id: 5, fullName: 'Marcel Proust' },
            ]}
        />
    </Wrapper>
);

const CustomOption = props => {
    const record = useRecordContext();
    return (
        <div {...props}>
            {record?.fullName}&nbsp;<i>({record?.language})</i>
        </div>
    );
};

export const OptionTextElement = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            optionText={<CustomOption />}
            inputText={record => record.fullName}
            matchSuggestion={(searchText, record) => {
                const searchTextLower = searchText.toLowerCase();
                const match =
                    record.fullName?.toLowerCase().includes(searchTextLower) ||
                    record.language?.toLowerCase().includes(searchTextLower);

                return match;
            }}
            choices={[
                { id: 1, fullName: 'Leo Tolstoy', language: 'Russian' },
                { id: 2, fullName: 'Victor Hugo', language: 'French' },
                { id: 3, fullName: 'William Shakespeare', language: 'English' },
                { id: 4, fullName: 'Charles Baudelaire', language: 'French' },
                { id: 5, fullName: 'Marcel Proust', language: 'French' },
            ]}
        />
    </Wrapper>
);

const choicesForCreationSupport = [
    { id: 1, name: 'Leo Tolstoy' },
    { id: 2, name: 'Victor Hugo' },
    { id: 3, name: 'William Shakespeare' },
    { id: 4, name: 'Charles Baudelaire' },
    { id: 5, name: 'Marcel Proust' },
];

const OnCreateInput = () => {
    const [choices, setChoices] = useState(choicesForCreationSupport);
    return (
        <AutocompleteInput
            source="author"
            choices={choices}
            onCreate={async filter => {
                if (!filter) return;

                const newOption = {
                    id: choices.length + 1,
                    name: filter,
                };
                setChoices(options => [...options, newOption]);
                // Wait until next tick to give some time for React to update the state
                await new Promise(resolve => setTimeout(resolve));
                return newOption;
            }}
            TextFieldProps={{
                placeholder: 'Start typing to create a new item',
            }}
        />
    );
};

export const OnCreate = () => (
    <Wrapper>
        <OnCreateInput />
    </Wrapper>
);

const AutocompleteWithCreateInReferenceInput = () => {
    const [create] = useCreate();
    const handleCreateAuthor = async (authorName?: string) => {
        if (!authorName) return;
        const newAuthor = await create(
            'authors',
            { data: { name: authorName } },
            { returnPromise: true }
        );
        return newAuthor;
    };
    return <AutocompleteInput onCreate={handleCreateAuthor} />;
};

export const OnCreateSlow = () => (
    <Wrapper
        dataProvider={fakeRestProvider(
            {
                authors: [
                    { id: 1, name: 'Leo Tolstoy' },
                    { id: 2, name: 'Victor Hugo' },
                    { id: 3, name: 'William Shakespeare' },
                    { id: 4, name: 'Charles Baudelaire' },
                    { id: 5, name: 'Marcel Proust' },
                ],
                books: [
                    { id: 1, title: 'War and Peace', author: 1 },
                    { id: 2, title: 'Les Misérables', author: 2 },
                    { id: 3, title: 'Romeo and Juliet', author: 3 },
                    { id: 4, title: 'Les Fleurs du Mal', author: 4 },
                    { id: 5, title: 'In Search of Lost Time', author: 5 },
                ],
            },
            false,
            1500
        )}
    >
        <ReferenceInput reference="authors" source="author">
            <AutocompleteWithCreateInReferenceInput />
        </ReferenceInput>
    </Wrapper>
);

const OnCreatePromptInput = () => {
    const [choices, setChoices] = useState(choicesForCreationSupport);
    return (
        <AutocompleteInput
            source="author"
            choices={choices}
            onCreate={async filter => {
                const newAuthorName = window.prompt(
                    'Enter a new author',
                    filter
                );
                if (!newAuthorName) return;
                const newAuthor = {
                    id: choices.length + 1,
                    name: newAuthorName,
                };
                setChoices(authors => [...authors, newAuthor]);
                // Wait until next tick to give some time for React to update the state
                await new Promise(resolve => setTimeout(resolve));
                return newAuthor;
            }}
            TextFieldProps={{
                placeholder: 'Start typing to create a new item',
            }}
            // Disable clearOnBlur because opening the prompt blurs the input
            // and creates a flicker
            clearOnBlur={false}
        />
    );
};

export const OnCreatePrompt = () => (
    <Wrapper>
        <OnCreatePromptInput />
    </Wrapper>
);

const CreateAuthorLocal = ({ choices, setChoices }) => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [name, setName] = React.useState(filter || '');
    const [language, setLanguage] = React.useState('');

    const handleSubmit = event => {
        event.preventDefault();
        const newAuthor = {
            id: choices.length + 1,
            name,
            language,
        };
        setChoices(authors => [...authors, newAuthor]);
        setName('');
        setLanguage('');
        // Wait until next tick to give some time for React to update the state
        setTimeout(() => {
            onCreate(newAuthor);
        });
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

const CreateDialogInput = () => {
    const [choices, setChoices] = useState(choicesForCreationSupport);
    return (
        <AutocompleteInput
            source="author"
            choices={choices}
            create={
                <CreateAuthorLocal choices={choices} setChoices={setChoices} />
            }
            TextFieldProps={{
                placeholder: 'Start typing to create a new item',
            }}
        />
    );
};

export const CreateDialog = () => (
    <Wrapper>
        <CreateDialogInput />
    </Wrapper>
);

const CreateLabelInput = () => {
    const [choices, setChoices] = useState(choicesForCreationSupport);
    return (
        <AutocompleteInput
            source="author"
            choices={choices}
            onCreate={async filter => {
                if (!filter) return;

                const newOption = {
                    id: choices.length + 1,
                    name: filter,
                };
                setChoices(options => [...options, newOption]);
                // Wait until next tick to give some time for React to update the state
                await new Promise(resolve => setTimeout(resolve));
                return newOption;
            }}
            createLabel="Start typing to create a new item"
        />
    );
};

export const CreateLabel = () => (
    <Wrapper>
        <CreateLabelInput />
    </Wrapper>
);

const CreateItemLabelInput = () => {
    const [choices, setChoices] = useState(choicesForCreationSupport);
    return (
        <AutocompleteInput
            source="author"
            choices={choices}
            onCreate={async filter => {
                if (!filter) return;

                const newOption = {
                    id: choices.length + 1,
                    name: filter,
                };
                setChoices(options => [...options, newOption]);
                // Wait until next tick to give some time for React to update the state
                await new Promise(resolve => setTimeout(resolve));
                return newOption;
            }}
            createItemLabel="Add a new author: %{item}"
        />
    );
};

export const CreateItemLabel = () => (
    <Wrapper>
        <CreateItemLabelInput />
    </Wrapper>
);

const authorsWithFirstAndLastName = [
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

const dataProviderWithAuthorsWithFirstAndLastName = {
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
            data: authorsWithFirstAndLastName.filter(author =>
                params.ids.includes(author.id)
            ),
        }),
    getList: (_resource, params) =>
        new Promise(resolve => {
            // eslint-disable-next-line eqeqeq
            if (params.filter.q == undefined) {
                setTimeout(
                    () =>
                        resolve({
                            data: authorsWithFirstAndLastName,
                            total: authors.length,
                        }),
                    500
                );
                return;
            }

            const filteredAuthors = authorsWithFirstAndLastName.filter(author =>
                author.last_name
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
    update: (_resource, params) => Promise.resolve(params),
    create: (_resource, params) => {
        const newAuthor = {
            id: authorsWithFirstAndLastName.length + 1,
            name: params.data.name,
            language: params.data.language,
        };
        authors.push(newAuthor);
        return Promise.resolve({ data: newAuthor });
    },
} as any;

const BookEditWithReferenceAndRecordRepresentation = () => (
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
                <AutocompleteInput />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const InsideReferenceInputWithRecordRepresentation = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithAuthorsWithFirstAndLastName}>
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
            />
            <Resource
                name="books"
                edit={BookEditWithReferenceAndRecordRepresentation}
            />
        </Admin>
    </TestMemoryRouter>
);

const authors = [
    { id: 1, name: 'Leo Tolstoy', language: 'Russian' },
    { id: 2, name: 'Victor Hugo', language: 'French' },
    { id: 3, name: 'William Shakespeare', language: 'English' },
    { id: 4, name: 'Charles Baudelaire', language: 'French' },
    { id: 5, name: 'Marcel Proust', language: 'French' },
];

const dataProviderWithAuthors = {
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
    getList: (_resource, params) =>
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
    update: (_resource, params) => Promise.resolve(params),
    create: (_resource, params) => {
        const newAuthor = {
            id: authors.length + 1,
            name: params.data.name,
            language: params.data.language,
        };
        authors.push(newAuthor);
        return Promise.resolve({ data: newAuthor });
    },
} as any;

export const InsideReferenceInput = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource name="authors" />
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
                                <AutocompleteInput optionText="name" />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const LanguageChangingAuthorInput = ({ onChange }) => {
    const { setValue } = useFormContext();
    const handleChange = (value, record) => {
        setValue('language', record?.language);
        onChange(value, record);
    };
    return (
        <ReferenceInput reference="authors" source="author">
            <AutocompleteInput optionText="name" onChange={handleChange} />
        </ReferenceInput>
    );
};

export const InsideReferenceInputOnChange = ({
    onChange = (value, record) => console.log({ value, record }),
}: Pick<AutocompleteInputProps, 'onChange'>) => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource name="authors" />
            <Resource
                name="books"
                create={() => (
                    <Create
                        mutationOptions={{
                            onSuccess: data => {
                                console.log(data);
                            },
                        }}
                        redirect={false}
                    >
                        <SimpleForm>
                            <LanguageChangingAuthorInput onChange={onChange} />
                            <TextInput source="language" />
                        </SimpleForm>
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const InsideReferenceInputDefaultValue = ({
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
            <Resource name="authors" />
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        mutationMode="pessimistic"
                        mutationOptions={{ onSuccess }}
                    >
                        <SimpleForm>
                            <TextInput source="title" />
                            <ReferenceInput reference="authors" source="author">
                                <AutocompleteInput optionText="name" />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const InsideReferenceInputWithError = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin
            dataProvider={{
                ...dataProviderWithAuthors,
                getList: () => Promise.reject('error'),
            }}
        >
            <Resource name="authors" />
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
                                <AutocompleteInput optionText="name" />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
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
                onSuccess: data => {
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
            <ReferenceInput reference="authors" source="author">
                <AutocompleteInput
                    create={<CreateAuthor />}
                    optionText="name"
                />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const InsideReferenceInputWithCreationSupport = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource name="authors" />
            <Resource
                name="books"
                edit={BookEditWithReferenceAndCreationSupport}
            />
        </Admin>
    </TestMemoryRouter>
);

const BookOptionText = () => {
    const book = useRecordContext();
    if (!book) return null;
    return <div>{`${book.name} - ${book.language}`}</div>;
};

export const InsideReferenceInputWithCustomizedItemRendering = (
    props: Partial<AutocompleteInputProps>
) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource name="authors" />
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
                                <AutocompleteInput
                                    optionText={<BookOptionText />}
                                    inputText={book =>
                                        `${book.name} - ${book.language}`
                                    }
                                    {...props}
                                />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const OptionItem = props => {
    const record = useRecordContext();
    return (
        <div {...props} aria-label={record && record.name}>
            {`from optionText: ${record && record.name}`}
        </div>
    );
};

export const CustomizedItemRendering = () => {
    return (
        <AdminContext dataProvider={dataProviderWithAuthors}>
            <SimpleForm onSubmit={() => {}} defaultValues={{ role: 2 }}>
                <AutocompleteInput
                    source="role"
                    resource="users"
                    optionText={<OptionItem />}
                    inputText={record => `from inputText ${record?.name}`}
                    matchSuggestion={(filter, option) =>
                        option.name.includes(filter)
                    }
                    choices={[
                        { id: 1, name: 'bar' },
                        { id: 2, name: 'foo' },
                    ]}
                />
            </SimpleForm>
        </AdminContext>
    );
};

const DalmatianEdit = () => {
    const dalmatians: any[] = [];
    for (let index = 0; index < 1100; index++) {
        dalmatians.push({
            id: index + 1,
            name: `Dalmatian #${index + 1}`,
            altData: `altData  #${index + 1}`,
        });
    }

    return (
        <Edit mutationMode="pessimistic">
            <SimpleForm>
                <Typography aria-label="count" variant="body2">
                    choices: {dalmatians.length}
                </Typography>
                <AutocompleteInput source="dalmatians" choices={dalmatians} />
            </SimpleForm>
        </Edit>
    );
};

export const VeryLargeOptionsNumber = () => {
    return (
        <TestMemoryRouter initialEntries={['/dalmatians/1']}>
            <Admin dataProvider={dataProviderDefault}>
                <Resource name="dalmatians" edit={<DalmatianEdit />} />
            </Admin>
        </TestMemoryRouter>
    );
};

export const EmptyText = () => (
    <Wrapper dataProvider={dataProviderEmpty}>
        <AutocompleteInput
            label="emptyValue set to 'no-author', emptyText not set"
            source="author"
            choices={defaultChoices}
            emptyValue="no-author"
        />
        <AutocompleteInput
            label="emptyValue set to 'none'"
            source="authorNone"
            choices={defaultChoices}
            emptyValue="none"
            emptyText="- No author - "
        />
        <AutocompleteInput
            label="emptyValue set to ''"
            source="authorEmpty"
            choices={defaultChoices}
            emptyText="- No author - "
        />
        <AutocompleteInput
            label="emptyValue set to 0"
            source="authorZero"
            choices={defaultChoices}
            emptyValue={0}
            emptyText="- No author - "
        />
    </Wrapper>
);

const nullishValuesFakeData = {
    fans: [
        { id: 'null', name: 'null', prefers: null },
        { id: 'undefined', name: 'undefined', prefers: undefined },
        { id: 'empty-string', name: 'empty string', prefers: '' },
        { id: 'zero-string', name: '0', prefers: 0 },
        { id: 'zero-number', name: '0', prefers: '0' },
        { id: 'valid-value', name: '1', prefers: 1 },
    ],
    artists: [{ id: 0 }, { id: 1 }],
};

const FanList = () => {
    const { data } = useListContext();
    return data ? (
        <>
            {data.map(fan => (
                <RecordContextProvider value={fan} key={fan.id}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{ m: 1, width: '90%' }}
                    >
                        <Box sx={{ width: '320px' }}>
                            <Typography variant="body1">
                                <b>Fan #{fan.id}</b>
                                <br />
                                <code>{`${
                                    fan.name
                                } [${typeof fan.prefers}]`}</code>
                            </Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 100%' }}>
                            <SimpleForm toolbar={<></>}>
                                <AutocompleteInput
                                    id={`prefers_${fan.id}`}
                                    label={`prefers_${fan.id}`}
                                    source="prefers"
                                    optionText={option => option.id}
                                    choices={nullishValuesFakeData.artists}
                                    helperText={false}
                                />
                            </SimpleForm>
                        </Box>
                    </Stack>
                </RecordContextProvider>
            ))}
        </>
    ) : (
        <>Loading</>
    );
};

export const NullishValuesSupport = () => {
    return (
        <AdminContext
            dataProvider={fakeRestProvider(nullishValuesFakeData, false)}
        >
            <Typography variant="h6" gutterBottom>
                Test nullish values
            </Typography>
            <Typography variant="body1">
                Story demonstrating nullish values support: each fan specify a
                preferred artist. The <code>prefer</code> value is evaluated
                against artist IDs.
            </Typography>
            <ListBase resource="fans">
                <FanList />
            </ListBase>
        </AdminContext>
    );
};

const dataProviderWithDifferentShapeInGetMany = {
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
            data: authors
                .filter(author => params.ids.includes(author.id))
                .map(author => ({
                    ...author,
                    newField: 'newField',
                })),
        }),
    getList: (_resource, params) =>
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
    update: (_resource, params) => Promise.resolve(params),
    create: (last_nameresource, params) => {
        const newAuthor = {
            id: authors.length + 1,
            name: params.data.name,
            language: params.data.language,
        };
        authors.push(newAuthor);
        return Promise.resolve({ data: newAuthor });
    },
} as any;

export const DifferentShapeInGetMany = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithDifferentShapeInGetMany}>
            <Resource name="authors" />
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
                                <AutocompleteInput optionText="name" />
                            </ReferenceInput>
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TranslateChoice = () => {
    const i18nProvider = polyglotI18nProvider(() => ({
        ...englishMessages,
        'option.male': 'Male',
        'option.female': 'Female',
    }));
    return (
        <AdminContext
            i18nProvider={i18nProvider}
            dataProvider={
                {
                    getOne: () =>
                        Promise.resolve({ data: { id: 1, gender: 'F' } }),
                    getList: () =>
                        Promise.resolve({
                            data: [
                                { id: 'M', name: 'option.male' },
                                { id: 'F', name: 'option.female' },
                            ],
                            total: 2,
                        }),
                    getMany: (_resource, { ids }) =>
                        Promise.resolve({
                            data: [
                                { id: 'M', name: 'option.male' },
                                { id: 'F', name: 'option.female' },
                            ].filter(({ id }) => ids.includes(id)),
                        }),
                } as any
            }
            defaultTheme="light"
        >
            <Edit resource="posts" id="1">
                <SimpleForm>
                    <AutocompleteInput
                        label="translateChoice default"
                        source="gender"
                        id="gender1"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                    />
                    <AutocompleteInput
                        label="translateChoice true"
                        source="gender"
                        id="gender2"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                        translateChoice
                    />
                    <AutocompleteInput
                        label="translateChoice false"
                        source="gender"
                        id="gender3"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                        translateChoice={false}
                    />
                    <ReferenceInput reference="genders" source="gender">
                        <AutocompleteInput
                            optionText="name"
                            label="inside ReferenceInput"
                            id="gender4"
                        />
                    </ReferenceInput>
                    <ReferenceInput reference="genders" source="gender">
                        <AutocompleteInput
                            optionText="name"
                            label="inside ReferenceInput forced"
                            id="gender5"
                            translateChoice
                        />
                    </ReferenceInput>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};

export const WithInputProps = () => (
    <Wrapper>
        <AutocompleteInput
            source="author"
            choices={defaultChoices}
            TextFieldProps={{
                InputProps: {
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            sx={{
                                position: 'relative',
                                top: '-8px',
                            }}
                        >
                            <AttributionIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment
                            position="end"
                            sx={{
                                position: 'relative',
                                top: '-8px',
                                left: '50px',
                            }}
                        >
                            <ExpandCircleDownIcon />
                        </InputAdornment>
                    ),
                },
            }}
        />
    </Wrapper>
);
