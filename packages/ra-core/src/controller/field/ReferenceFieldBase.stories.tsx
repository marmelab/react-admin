import * as React from 'react';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';
import { CoreAdmin } from '../../core/CoreAdmin';
import { Resource } from '../../core/Resource';
import { ShowBase } from '../../controller/show/ShowBase';
import { TestMemoryRouter } from '../../routing';
import { ReferenceFieldBase } from './ReferenceFieldBase';
import { useFieldValue } from '../../util/useFieldValue';
import { useReferenceFieldContext } from './ReferenceFieldContext';
import { DataProvider } from '../../types';
import { useIsOffline } from '../../core/useIsOffline';
import { IsOffline } from '../..';

export default {
    title: 'ra-core/controller/field/ReferenceFieldBase',
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
    getMany: _resource => Promise.reject(new Error('Error')),
} as any;

export const Errored = ({ dataProvider = dataProviderWithAuthorsError }) => (
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

export const WithRenderProp = ({ dataProvider = dataProviderWithAuthors }) => (
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
                        <ReferenceFieldBase
                            source="author"
                            reference="authors"
                            render={({ error, isPending }) => {
                                if (isPending) {
                                    return <p>Loading...</p>;
                                }

                                if (error) {
                                    return (
                                        <p style={{ color: 'red' }}>
                                            {error.message}
                                        </p>
                                    );
                                }
                                return <TextField source="first_name" />;
                            }}
                        />
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const ZeroIndex = ({
    dataProvider = fakeRestDataProvider(
        {
            books: [{ id: 1, title: 'War and Peace', author: 0 }],
            authors: [{ id: 0, first_name: 'Leo', last_name: 'Tolstoy' }],
        },
        process.env.NODE_ENV === 'development'
    ),
}: {
    dataProvider?: DataProvider;
}) => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <ShowBase>
                        <TextField source="title" />
                        <ReferenceFieldBase
                            reference="authors"
                            source="author"
                            empty={<>Should not appear</>}
                        >
                            <TextField source="first_name" />
                            <TextField source="last_name" />
                        </ReferenceFieldBase>
                    </ShowBase>
                )}
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const Offline = () => {
    return (
        <TestMemoryRouter initialEntries={['/books/1/show']}>
            <CoreAdmin
                dataProvider={dataProviderWithAuthors}
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
                            <div>
                                <RenderChildOnDemand>
                                    <ReferenceFieldBase
                                        source="author"
                                        reference="authors"
                                        offline={
                                            <p style={{ color: 'orange' }}>
                                                You are offline, cannot load
                                                data
                                            </p>
                                        }
                                    >
                                        <MyReferenceField>
                                            <IsOffline>
                                                <p style={{ color: 'orange' }}>
                                                    You are offline, the data
                                                    may be outdated
                                                </p>
                                            </IsOffline>
                                            <TextField source="first_name" />
                                        </MyReferenceField>
                                    </ReferenceFieldBase>
                                </RenderChildOnDemand>
                            </div>
                            <SimulateOfflineButton />
                        </ShowBase>
                    }
                />
            </CoreAdmin>
        </TestMemoryRouter>
    );
};

const SimulateOfflineButton = () => {
    const isOffline = useIsOffline();
    return (
        <button
            type="button"
            onClick={() => onlineManager.setOnline(isOffline)}
        >
            {isOffline ? 'Simulate online' : 'Simulate offline'}
        </button>
    );
};

const RenderChildOnDemand = ({ children }) => {
    const [showChild, setShowChild] = React.useState(false);
    return (
        <>
            <button onClick={() => setShowChild(!showChild)}>
                Toggle Child
            </button>
            {showChild && <div>{children}</div>}
        </>
    );
};

const MyReferenceField = (props: { children: React.ReactNode }) => {
    const context = useReferenceFieldContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p style={{ color: 'red' }}>{context.error.toString()}</p>;
    }
    return props.children;
};

const TextField = ({ source }: { source: string }) => {
    const value = useFieldValue({ source });
    return <p>{value}</p>;
};
