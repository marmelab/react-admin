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
} from 'ra-core';
import { createMemoryHistory } from 'history';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    Typography,
    Box,
} from '@mui/material';
import fakeRestProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { Edit } from '../detail';
import { SimpleForm } from '../form';
import { AutocompleteInput, AutocompleteInputProps } from './AutocompleteInput';
import { ReferenceInput } from './ReferenceInput';
import { TextInput } from './TextInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

export default { title: 'ra-ui-materialui/input/AutocompleteInput' };

const dataProvider = {
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

export const Nullable = ({ onSuccess = console.log }) => {
    const choices = [
        { id: 1, name: 'Leo Tolstoy' },
        { id: 2, name: 'Victor Hugo' },
        { id: 3, name: 'William Shakespeare' },
        { id: 4, name: 'Charles Baudelaire' },
        { id: 5, name: 'Marcel Proust' },
    ];
    return (
        <Admin dataProvider={dataProvider} history={history}>
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        mutationMode="pessimistic"
                        mutationOptions={{
                            onSuccess,
                        }}
                    >
                        <SimpleForm>
                            <AutocompleteInput
                                source="author"
                                choices={choices}
                                fullWidth
                            />
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    );
};

export const IsLoading = () => {
    return (
        <Admin dataProvider={dataProvider} history={history}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <SimpleForm>
                            <AutocompleteInput source="author" isLoading />
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    );
};

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

const CustomOption = props => {
    const record = useRecordContext();

    return (
        <div {...props}>
            {record?.fullName}&nbsp;<i>({record?.language})</i>
        </div>
    );
};

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
                                ?.toLowerCase()
                                .includes(searchTextLower) ||
                            record.language
                                ?.toLowerCase()
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
                TextFieldProps={{
                    placeholder: 'Start typing to create a new item',
                }}
            />
        </SimpleForm>
    </Edit>
);

export const CreationSupport = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditWithCreationSupport} />
    </Admin>
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
    <Admin
        dataProvider={dataProviderWithAuthorsWithFirstAndLastName}
        history={history}
    >
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
    <Admin dataProvider={dataProviderWithAuthors} history={history}>
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
                            <AutocompleteInput fullWidth optionText="name" />
                        </ReferenceInput>
                    </SimpleForm>
                </Edit>
            )}
        />
    </Admin>
);

export const InsideReferenceInputDefaultValue = ({
    onSuccess = console.log,
}) => (
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
        history={history}
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
                            <AutocompleteInput fullWidth optionText="name" />
                        </ReferenceInput>
                    </SimpleForm>
                </Edit>
            )}
        />
    </Admin>
);

export const InsideReferenceInputWithError = () => (
    <Admin
        dataProvider={{
            ...dataProviderWithAuthors,
            getList: () => Promise.reject('error'),
        }}
        history={history}
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
                            <AutocompleteInput fullWidth optionText="name" />
                        </ReferenceInput>
                    </SimpleForm>
                </Edit>
            )}
        />
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
                    fullWidth
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

const BookOptionText = () => {
    const book = useRecordContext();
    if (!book) return null;
    return <div>{`${book.name} - ${book.language}`}</div>;
};

export const InsideReferenceInputWithCustomizedItemRendering = (
    props: Partial<AutocompleteInputProps>
) => (
    <Admin dataProvider={dataProviderWithAuthors} history={history}>
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
                                fullWidth
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
                    fullWidth
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
                <AutocompleteInput
                    source="dalmatians"
                    choices={dalmatians}
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    );
};

export const VeryLargeOptionsNumber = () => {
    return (
        <Admin
            dataProvider={dataProvider}
            history={createMemoryHistory({
                initialEntries: ['/dalmatians/1'],
            })}
        >
            <Resource name="dalmatians" edit={<DalmatianEdit />} />
        </Admin>
    );
};

const BookEditWithEmptyText = () => {
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
                    label="emptyValue set to 'no-author', emptyText not set"
                    source="author"
                    choices={choices}
                    emptyValue="no-author"
                    fullWidth
                />
                <AutocompleteInput
                    label="emptyValue set to 'none'"
                    source="authorNone"
                    choices={choices}
                    emptyValue="none"
                    emptyText="- No author - "
                    fullWidth
                />
                <AutocompleteInput
                    label="emptyValue set to ''"
                    source="authorEmpty"
                    choices={choices}
                    emptyText="- No author - "
                    fullWidth
                />
                <AutocompleteInput
                    label="emptyValue set to 0"
                    source="authorZero"
                    choices={choices}
                    emptyValue={0}
                    emptyText="- No author - "
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    );
};

export const EmptyText = () => (
    <Admin dataProvider={dataProviderEmpty} history={history}>
        <Resource name="books" edit={BookEditWithEmptyText} />
    </Admin>
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
                                    fullWidth
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
    <Admin
        dataProvider={dataProviderWithDifferentShapeInGetMany}
        history={history}
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
                            <AutocompleteInput fullWidth optionText="name" />
                        </ReferenceInput>
                    </SimpleForm>
                </Edit>
            )}
        />
    </Admin>
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
