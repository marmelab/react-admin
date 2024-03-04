import * as React from 'react';
import { CoreAdmin } from '../../core/CoreAdmin';
import { Resource } from '../../core/Resource';
import { ShowBase } from '../../controller/show/ShowBase';
import { TestMemoryRouter } from '../../routing';
import { ReferenceFieldBase } from './ReferenceFieldBase';
import { useFieldValue } from '../../util/useFieldValue';
import { useReferenceFieldContext } from './ReferenceFieldContext';
import { QueryClient } from '@tanstack/react-query';

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

const MyReferenceField = (props: { children: React.ReactNode }) => {
    const context = useReferenceFieldContext();

    if (context.isLoading) {
        return <p>...Loading</p>;
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
