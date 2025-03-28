import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import { TestMemoryRouter } from '../../routing';

import { EditBase } from '../edit';
import {
    ChoicesProps,
    Form,
    InputProps,
    useChoices,
    useChoicesContext,
    useInput,
} from '../../form';
import { ReferenceInputBase } from './ReferenceInputBase';
import {
    CoreAdmin,
    CoreAdminContext,
    DataProvider,
    ListBase,
    Resource,
    testDataProvider,
    useListContext,
    useRedirect,
} from '../..';

export default {
    title: 'ra-core/input/ReferenceInputBase',
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

const AutocompleteInput = (
    props: Omit<InputProps, 'source'> &
        Partial<Pick<InputProps, 'source'>> &
        ChoicesProps & { source?: string }
) => {
    const { allChoices, error, source, setFilters } = useChoicesContext(props);
    const { getChoiceValue, getChoiceText } = useChoices(props);
    const { field } = useInput({ ...props, source });

    if (error) {
        return <div style={{ color: 'red' }}>{error.message}</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor={`${source}-search`}>
                {props.label || field.name}
            </label>
            <input type="hidden" id={field.name} {...field} />
            <input
                id={`${source}-search`}
                name={`${source}-search`}
                list={`${source}-choices`}
                onChange={e => {
                    const choice = allChoices?.find(
                        choice =>
                            getChoiceText(choice).toString() === e.target.value
                    );
                    if (choice) {
                        field.onChange(getChoiceValue(choice));
                        return;
                    }
                    setFilters({ q: e.target.value }, {}, true);
                }}
            />

            <datalist id={`${source}-choices`}>
                {allChoices?.map(choice => (
                    <option
                        key={getChoiceValue(choice)}
                        value={getChoiceText(choice).toString()}
                    >
                        {getChoiceText(choice)}
                    </option>
                ))}
            </datalist>
        </div>
    );
};

const SelectInput = (
    props: Omit<InputProps, 'source'> &
        Partial<Pick<InputProps, 'source'>> &
        ChoicesProps & { source?: string }
) => {
    const { allChoices, error, isPending, source } = useChoicesContext(props);
    const { getChoiceValue, getChoiceText } = useChoices(props);
    const { field } = useInput({ ...props, source });

    if (error) {
        return <div style={{ color: 'red' }}>{error.message}</div>;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor={field.name}>{props.label || field.name}</label>
            <select id={field.name} {...field}>
                {isPending && <option value="">Loading...</option>}
                {allChoices?.map(choice => (
                    <option
                        key={getChoiceValue(choice)}
                        value={getChoiceValue(choice)}
                    >
                        {getChoiceText(choice)}
                    </option>
                ))}
            </select>
        </div>
    );
};

const TextInput = (props: InputProps) => {
    const { field } = useInput(props);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor={field.name}>{props.label || field.name}</label>
            <input {...field} />
        </div>
    );
};

const BookEdit = () => (
    <EditBase
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <Form>
            <ReferenceInputBase reference="authors" source="author">
                <SelectInput optionText="last_name" />
            </ReferenceInputBase>
            <button type="submit">Save</button>
        </Form>
    </EditBase>
);

export const Basic = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource name="authors" />
            <Resource name="books" edit={BookEdit} />
        </CoreAdmin>
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
    <CoreAdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [5] }}>
            <div
                style={{
                    width: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                <ReferenceInputBase
                    reference="tags"
                    resource="posts"
                    source="tag_ids"
                >
                    <SelectInput optionText="name" />
                </ReferenceInputBase>
            </div>
        </Form>
    </CoreAdminContext>
);

const book = {
    id: 1,
    title: 'War and Peace',
    author: 1,
    summary:
        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
    year: 1869,
};

export const Error = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <CoreAdmin
            dataProvider={
                {
                    getOne: () => Promise.resolve({ data: book }),
                    getMany: (_resource, params) =>
                        Promise.resolve({
                            data: authors.filter(author =>
                                params.ids.includes(author.id)
                            ),
                        }),
                    getList: (_resource, params) => {
                        return params.filter.q === 'lorem'
                            ? Promise.reject({ message: 'An error occured' })
                            : Promise.resolve({
                                  data: authors,
                                  total: authors.length,
                              });
                    },
                } as any
            }
            queryClient={
                new QueryClient({
                    defaultOptions: { queries: { retry: false } },
                })
            }
        >
            <Resource
                name="books"
                edit={() => (
                    <EditBase mutationMode="pessimistic">
                        <Form>
                            <>
                                <p>Enter "lorem" to trigger the error</p>
                            </>

                            <ReferenceInputBase
                                reference="authors"
                                source="author"
                            >
                                <AutocompleteInput optionText="last_name" />
                            </ReferenceInputBase>
                            <button type="submit">Save</button>
                        </Form>
                    </EditBase>
                )}
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const AuthorList = () => (
    <ListBase>
        <ListView />
    </ListBase>
);

const ListView = () => {
    const context = useListContext();

    return (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {context.data?.map(record => (
                <li key={record.id} style={{ display: 'flex', gap: 2 }}>
                    <span>{record.first_name}</span>
                    <span>{record.last_name}</span>
                </li>
            ))}
        </ul>
    );
};

const BookEditWithSelfReference = () => {
    const redirect = useRedirect();
    return (
        <EditBase
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
            <Form>
                <TextInput source="title" />
                <ReferenceInputBase reference="books" source="self_reference">
                    <SelectInput
                        optionText="last_name"
                        label="Self reference"
                    />
                </ReferenceInputBase>
                <button type="submit">Save</button>
            </Form>
        </EditBase>
    );
};

export const SelfReference = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource name="authors" list={AuthorList} />
            <Resource name="books" edit={BookEditWithSelfReference} />
        </CoreAdmin>
    </TestMemoryRouter>
);

const BookEditQueryOptions = () => {
    const [enabled, setEnabled] = React.useState(false);
    return (
        <EditBase mutationMode="pessimistic">
            <button onClick={() => setEnabled(!enabled)}>
                Toggle queryOptions
            </button>
            <Form>
                <TextInput source="title" />
                <ReferenceInputBase
                    reference="authors"
                    source="author"
                    queryOptions={{ enabled }}
                >
                    <SelectInput optionText="last_name" />
                </ReferenceInputBase>
                <button type="submit">Save</button>
            </Form>
        </EditBase>
    );
};

export const QueryOptions = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <CoreAdmin
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
            <Resource name="authors" list={AuthorList} />
            <Resource name="books" edit={BookEditQueryOptions} />
        </CoreAdmin>
    </TestMemoryRouter>
);

const BookEditMeta = () => {
    return (
        <EditBase mutationMode="pessimistic">
            <Form>
                <TextInput source="title" />
                <ReferenceInputBase
                    reference="authors"
                    source="author"
                    queryOptions={{ meta: { test: true } }}
                >
                    <SelectInput optionText="last_name" />
                </ReferenceInputBase>
                <button type="submit">Save</button>
            </Form>
        </EditBase>
    );
};

export const Meta = ({
    dataProvider = fakeRestDataProvider(
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
    ),
}: {
    dataProvider: DataProvider;
}) => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditMeta} />
        </CoreAdmin>
    </TestMemoryRouter>
);
