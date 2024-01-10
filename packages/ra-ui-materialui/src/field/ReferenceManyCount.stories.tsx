import * as React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import {
    DataProviderContext,
    RecordContextProvider,
    ResourceContextProvider,
} from 'ra-core';
import { MemoryRouter } from 'react-router-dom';

import { ReferenceManyCount } from './ReferenceManyCount';

export default {
    title: 'ra-ui-materialui/fields/ReferenceManyCount',
    excludeStories: ['Wrapper'],
};

const post = {
    id: 1,
    title: 'Lorem Ipsum',
};
const comments = [
    { id: 1, post_id: 1, is_published: true },
    { id: 2, post_id: 1, is_published: true },
    { id: 3, post_id: 1, is_published: false },
    { id: 4, post_id: 2, is_published: true },
    { id: 5, post_id: 2, is_published: false },
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
                <ResourceContextProvider value="posts">
                    <RecordContextProvider value={post}>
                        {children}
                    </RecordContextProvider>
                </ResourceContextProvider>
            </QueryClientProvider>
        </DataProviderContext.Provider>
    </MemoryRouter>
);

export const Basic = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const LoadingState = () => (
    <Wrapper dataProvider={{ getManyReference: () => new Promise(() => {}) }}>
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const ErrorState = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () => Promise.reject(new Error('problem')),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const WithFilter = () => (
    <Wrapper
        dataProvider={{
            getManyReference: (resource, params) =>
                Promise.resolve({
                    data: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ),
                    total: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ).length,
                }),
        }}
    >
        <ReferenceManyCount
            reference="comments"
            target="post_id"
            filter={{ is_published: true }}
        />
    </Wrapper>
);

export const Link = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" link />
    </Wrapper>
);

export const LinkWithFilter = () => (
    <Wrapper
        dataProvider={{
            getManyReference: (resource, params) =>
                Promise.resolve({
                    data: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ),
                    total: comments
                        .filter(c => c.post_id === 1)
                        .filter(post =>
                            Object.keys(params.filter).every(
                                key => post[key] === params.filter[key]
                            )
                        ).length,
                }),
        }}
    >
        <ReferenceManyCount
            reference="comments"
            target="post_id"
            filter={{ is_published: true }}
            link
        />
    </Wrapper>
);

export const WithCustomVariant = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
    >
        <ReferenceManyCount
            reference="comments"
            target="post_id"
            variant="h1"
        />
    </Wrapper>
);

export const Slow = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve({
                                data: [
                                    comments.filter(c => c.post_id === 1)[0],
                                ],
                                total: comments.filter(c => c.post_id === 1)
                                    .length,
                            }),
                        2000
                    )
                ),
        }}
    >
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);
