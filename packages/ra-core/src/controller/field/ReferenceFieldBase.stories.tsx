import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';
import { CoreAdmin } from '../../core/CoreAdmin';
import { Resource } from '../../core/Resource';
import { ShowBase } from '../../controller/show/ShowBase';
import { TestMemoryRouter } from '../../routing';
import { ReferenceFieldBase } from './ReferenceFieldBase';
import { useFieldValue } from '../../util/useFieldValue';
import { useReferenceFieldContext } from './ReferenceFieldContext';
import { DataProvider } from '../../types';

export default {
    title: 'ra-core/fields/ReferenceFieldBase',
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
} as any;

export const Basic = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdmin
            dataProvider={dataProvider}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource name="authors" />
            <Resource
                name="books"
                show={
                    <ShowBase>
                        <ReferenceFieldBase source="author" reference="authors">
                            <MyReferenceField>
                                <TextField source="first_name" />
                            </MyReferenceField>
                        </ReferenceFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const dataProviderWithAuthorsError = {
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
    getMany: _resource => Promise.reject('Error'),
} as any;

export const Error = ({ dataProvider = dataProviderWithAuthorsError }) => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdmin
            dataProvider={dataProvider}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource name="authors" />
            <Resource
                name="books"
                show={
                    <ShowBase>
                        <ReferenceFieldBase source="author" reference="authors">
                            <MyReferenceField>
                                <TextField source="first_name" />
                            </MyReferenceField>
                        </ReferenceFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const dataProviderWithAuthorsLoading = {
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
    getMany: _resource => new Promise(() => {}),
} as any;

export const Loading = ({ dataProvider = dataProviderWithAuthorsLoading }) => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdmin
            dataProvider={dataProvider}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource name="authors" />
            <Resource
                name="books"
                show={
                    <ShowBase>
                        <ReferenceFieldBase source="author" reference="authors">
                            <MyReferenceField>
                                <TextField source="first_name" />
                            </MyReferenceField>
                        </ReferenceFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const BookShowQueryOptions = () => {
    const [enabled, setEnabled] = React.useState(false);
    return (
        <ShowBase>
            <>
                <button onClick={() => setEnabled(!enabled)}>
                    Enable the query
                </button>
                <TextField source="title" />
                <ReferenceFieldBase
                    reference="authors"
                    source="author"
                    queryOptions={{ enabled }}
                >
                    <MyReferenceField>
                        <TextField source="last_name" />
                    </MyReferenceField>
                </ReferenceFieldBase>
                <button type="submit">Save</button>
            </>
        </ShowBase>
    );
};

export const QueryOptions = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
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
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource name="books" show={BookShowQueryOptions} />
        </CoreAdmin>
    </TestMemoryRouter>
);

const BookShowMeta = () => {
    return (
        <ShowBase>
            <>
                <TextField source="title" />
                <ReferenceFieldBase
                    reference="authors"
                    source="author"
                    queryOptions={{ meta: { test: true } }}
                >
                    <MyReferenceField>
                        <TextField source="last_name" />
                    </MyReferenceField>
                </ReferenceFieldBase>
            </>
        </ShowBase>
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
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdmin
            dataProvider={dataProvider}
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })
            }
        >
            <Resource name="books" show={BookShowMeta} />
        </CoreAdmin>
    </TestMemoryRouter>
);

const MyReferenceField = (props: { children: React.ReactNode }) => {
    const context = useReferenceFieldContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p style={{ color: 'red' }}>{context.error}</p>;
    }
    return props.children;
};

const TextField = ({ source }: { source: string }) => {
    const value = useFieldValue({ source });
    return <p>{value}</p>;
};
