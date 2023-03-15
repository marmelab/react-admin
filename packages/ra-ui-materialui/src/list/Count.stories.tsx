import * as React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { DataProviderContext } from 'ra-core';
import { MemoryRouter } from 'react-router-dom';

import { Count } from './Count';

export default {
    title: 'ra-ui-materialui/list/Count',
    excludeStories: ['Wrapper'],
};

const posts = [
    { id: 1, is_published: true },
    { id: 2, is_published: true },
    { id: 3, is_published: false },
    { id: 4, is_published: true },
    { id: 5, is_published: false },
];

export const Wrapper = ({ dataProvider, children }) => (
    <MemoryRouter>
        <DataProviderContext.Provider value={dataProvider}>
            <QueryClientProvider
                client={
                    new QueryClient({
                        defaultOptions: {
                            queries: {
                                retry: false,
                            },
                        },
                    })
                }
            >
                {children}
            </QueryClientProvider>
        </DataProviderContext.Provider>
    </MemoryRouter>
);

export const Basic = () => (
    <Wrapper
        dataProvider={{
            getList: () =>
                Promise.resolve({
                    data: [posts[0]],
                    total: posts.length,
                }),
        }}
    >
        <Count />
    </Wrapper>
);

export const LoadingState = () => (
    <Wrapper dataProvider={{ getList: () => new Promise(() => {}) }}>
        <Count />
    </Wrapper>
);

export const ErrorState = () => (
    <Wrapper
        dataProvider={{ getList: () => Promise.reject(new Error('problem')) }}
    >
        <Count />
    </Wrapper>
);

export const WithFilter = () => (
    <Wrapper
        dataProvider={{
            getList: (resource, params) =>
                Promise.resolve({
                    data: posts.filter(post =>
                        Object.keys(params.filter).every(
                            key => post[key] === params.filter[key]
                        )
                    ),
                    total: posts.filter(post =>
                        Object.keys(params.filter).every(
                            key => post[key] === params.filter[key]
                        )
                    ).length,
                }),
        }}
    >
        <Count filter={{ is_published: true }} />
    </Wrapper>
);

export const Link = () => (
    <Wrapper
        dataProvider={{
            getList: () =>
                Promise.resolve({
                    data: [posts[0]],
                    total: posts.length,
                }),
        }}
    >
        <Count resource="posts" link />
    </Wrapper>
);

export const LinkWithFilter = () => (
    <Wrapper
        dataProvider={{
            getList: (resource, params) =>
                Promise.resolve({
                    data: posts.filter(post =>
                        Object.keys(params.filter).every(
                            key => post[key] === params.filter[key]
                        )
                    ),
                    total: posts.filter(post =>
                        Object.keys(params.filter).every(
                            key => post[key] === params.filter[key]
                        )
                    ).length,
                }),
        }}
    >
        <Count resource="posts" filter={{ is_published: true }} link />
    </Wrapper>
);

export const WithCustomVariant = () => (
    <Wrapper
        dataProvider={{
            getList: () =>
                Promise.resolve({
                    data: [posts[0]],
                    total: posts.length,
                }),
        }}
    >
        <Count variant="h1" />
    </Wrapper>
);

export const Slow = () => (
    <Wrapper
        dataProvider={{
            getList: () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve({
                                data: [posts[0]],
                                total: posts.length,
                            }),
                        2000
                    )
                ),
        }}
    >
        <Count />
    </Wrapper>
);
