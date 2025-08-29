import * as React from 'react';
import {
    QueryClientProvider,
    QueryClient,
    onlineManager,
} from '@tanstack/react-query';
import {
    DataProviderContext,
    RecordContextProvider,
    ResourceContextProvider,
    TestMemoryRouter,
    useIsOffline,
} from 'ra-core';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeOptions } from '@mui/material';

import { ReferenceManyCount } from './ReferenceManyCount';
import { defaultLightTheme, ThemeProvider, ThemesContext } from '../theme';

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

export const Wrapper = ({
    dataProvider,
    children,
    theme = defaultLightTheme,
}) => (
    <TestMemoryRouter>
        <ThemesContext.Provider
            value={{
                lightTheme: theme,
            }}
        >
            <ThemeProvider>
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
            </ThemeProvider>
        </ThemesContext.Provider>
    </TestMemoryRouter>
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

export const Themed = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
        theme={deepmerge(createTheme(), {
            components: {
                RaReferenceManyCount: {
                    defaultProps: {
                        'data-testid': 'themed',
                    },
                    styleOverrides: {
                        root: {
                            color: 'hotpink',
                        },
                    },
                },
            },
        } as ThemeOptions)}
    >
        <ReferenceManyCount reference="comments" target="post_id" />
    </Wrapper>
);

export const Offline = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () =>
                Promise.resolve({
                    data: [comments.filter(c => c.post_id === 1)[0]],
                    total: comments.filter(c => c.post_id === 1).length,
                }),
        }}
    >
        <RenderChildOnDemand>
            <ReferenceManyCount reference="comments" target="post_id" />
        </RenderChildOnDemand>
        <SimulateOfflineButton />
    </Wrapper>
);

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
