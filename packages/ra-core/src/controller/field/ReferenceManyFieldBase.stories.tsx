import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { CoreAdmin } from '../../core/CoreAdmin';
import { Resource } from '../../core/Resource';
import { ShowBase } from '../../controller/show/ShowBase';
import { TestMemoryRouter } from '../../routing';
import { ReferenceManyFieldBase } from './ReferenceManyFieldBase';
import { useListContext, useListContextWithProps } from '../list';

export default {
    title: 'ra-core/controller/field/ReferenceManyFieldBase',
    excludeStories: ['dataProviderWithAuthors'],
};

const author = {
    id: 1,
    first_name: 'Leo',
    last_name: 'Tolstoy',
    language: 'Russian',
};

const books = [
    {
        id: 1,
        title: 'War and Peace',
        author: 1,
    },
    {
        id: 2,
        title: 'Anna Karenina',
        author: 1,
    },
    {
        id: 3,
        title: 'The Kreutzer Sonata',
        author: 1,
    },
    {
        id: 4,
        author: 2,
        title: 'Hamlet',
    },
];

export const dataProviderWithAuthors = {
    getOne: () =>
        Promise.resolve({
            data: author,
        }),
    getMany: (_resource, params) =>
        Promise.resolve({
            data: books.filter(book => params.ids.includes(book.author)),
        }),
    getManyReference: (_resource, params) => {
        const result = books.filter(book => book.author === params.id);

        return Promise.resolve({
            data: result.slice(
                (params.pagination.page - 1) * params.pagination.perPage,
                (params.pagination.page - 1) * params.pagination.perPage +
                    params.pagination.perPage
            ),
            total: result.length,
        });
    },
} as any;

export const Basic = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/authors/1/show']}>
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
            <Resource name="books" />
            <Resource
                name="authors"
                show={
                    <ShowBase>
                        <ReferenceManyFieldBase
                            target="author"
                            source="id"
                            reference="books"
                        >
                            <MyReferenceManyField>
                                <List source="title" />
                            </MyReferenceManyField>
                        </ReferenceManyFieldBase>
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
    getMany: (_resource, params) =>
        Promise.resolve({
            data: books.filter(book => params.ids.includes(book.author)),
        }),
    getManyReference: _resource => Promise.reject(new Error('Error')),
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
                        <ReferenceManyFieldBase
                            reference="authors"
                            target="id"
                            source="author"
                        >
                            <MyReferenceManyField>
                                <List source="first_name" />
                            </MyReferenceManyField>
                        </ReferenceManyFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const dataProviderWithAuthorsLoading = {
    getOne: () =>
        Promise.resolve({
            data: author,
        }),

    getMany: (_resource, params) =>
        Promise.resolve({
            data: books.filter(book => params.ids.includes(book.author)),
        }),
    getManyReference: _resource => new Promise(() => {}),
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
                        <ReferenceManyFieldBase
                            reference="authors"
                            target="id"
                            source="author"
                        >
                            <MyReferenceManyField>
                                <List source="first_name" />
                            </MyReferenceManyField>
                        </ReferenceManyFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const WithPagination = ({ dataProvider = dataProviderWithAuthors }) => (
    <TestMemoryRouter initialEntries={['/authors/1/show']}>
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
            <Resource name="books" />
            <Resource
                name="authors"
                show={
                    <ShowBase>
                        <ReferenceManyFieldBase
                            target="author"
                            source="id"
                            reference="books"
                            perPage={2}
                            pagination={<Pagination />}
                        >
                            <MyReferenceManyField>
                                <List source="title" />
                            </MyReferenceManyField>
                        </ReferenceManyFieldBase>
                    </ShowBase>
                }
            />
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
                        <ReferenceManyFieldBase
                            reference="books"
                            target="author"
                            source="id"
                            render={({ error, isPending, data }) => {
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
                                return (
                                    <p>
                                        {data?.map((datum, index) => (
                                            <li key={index}>{datum.title}</li>
                                        ))}
                                    </p>
                                );
                            }}
                        />
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const WithRenderPagination = ({
    dataProvider = dataProviderWithAuthors,
}) => (
    <TestMemoryRouter initialEntries={['/authors/1/show']}>
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
            <Resource name="books" />
            <Resource
                name="authors"
                show={
                    <ShowBase>
                        <ReferenceManyFieldBase
                            target="author"
                            source="id"
                            reference="books"
                            perPage={2}
                            renderPagination={({
                                page = 0,
                                setPage,
                                total = 0,
                                perPage,
                            }) => {
                                const nextPage = () => {
                                    setPage(page + 1);
                                };
                                const previousPage = () => {
                                    setPage(page - 1);
                                };
                                return (
                                    <div>
                                        <button
                                            disabled={page <= 1}
                                            onClick={previousPage}
                                        >
                                            previous page
                                        </button>
                                        {`${(page - 1) * perPage + 1} - ${Math.min(page * perPage, total)} of ${total}`}
                                        <button
                                            disabled={page >= total / perPage}
                                            onClick={nextPage}
                                        >
                                            next page
                                        </button>
                                    </div>
                                );
                            }}
                        >
                            <MyReferenceManyField>
                                <List source="title" />
                            </MyReferenceManyField>
                        </ReferenceManyFieldBase>
                    </ShowBase>
                }
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

const MyReferenceManyField = ({ children }: { children: React.ReactNode }) => {
    const context = useListContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p style={{ color: 'red' }}>{context.error.toString()}</p>;
    }
    return children;
};

const List = ({ source }: { source: string }) => {
    const listContext = useListContext();
    return (
        <p>
            {listContext.data?.map((datum, index) => (
                <li key={index}>{datum[source]}</li>
            ))}
        </p>
    );
};

const Pagination = () => {
    const { page = 1, setPage, total = 0, perPage = 0 } = useListContext();
    const nextPage = () => {
        setPage?.(page + 1);
    };
    const previousPage = () => {
        setPage?.(page - 1);
    };
    return (
        <div>
            <button disabled={page <= 1} onClick={previousPage}>
                Previous Page
            </button>
            <span>
                {`${(page - 1) * perPage + 1} - ${Math.min(page * perPage, total)} of ${total}`}
            </span>
            <button disabled={page >= total / perPage} onClick={nextPage}>
                Next Page
            </button>
        </div>
    );
};
