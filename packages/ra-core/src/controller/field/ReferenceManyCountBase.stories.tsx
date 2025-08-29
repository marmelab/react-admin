import * as React from 'react';
import {
    QueryClientProvider,
    QueryClient,
    onlineManager,
} from '@tanstack/react-query';
import { RecordContextProvider } from '../record';
import { DataProviderContext } from '../../dataProvider';
import { ResourceContextProvider, useIsOffline } from '../../core';
import { TestMemoryRouter } from '../../routing';
import { ReferenceManyCountBase } from './ReferenceManyCountBase';

export default {
    title: 'ra-core/controller/field/ReferenceManyCountBase',
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
    <TestMemoryRouter>
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
        <ReferenceManyCountBase reference="comments" target="post_id" />
    </Wrapper>
);

export const LoadingState = () => (
    <Wrapper dataProvider={{ getManyReference: () => new Promise(() => {}) }}>
        <ReferenceManyCountBase
            reference="comments"
            target="post_id"
            loading="loading..."
        />
    </Wrapper>
);

export const ErrorState = () => (
    <Wrapper
        dataProvider={{
            getManyReference: () => Promise.reject(new Error('problem')),
        }}
    >
        <ReferenceManyCountBase
            reference="comments"
            target="post_id"
            error="Error!"
        />
    </Wrapper>
);

export const Filter = () => (
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
        <ReferenceManyCountBase
            reference="comments"
            target="post_id"
            filter={{ is_published: true }}
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
        <ReferenceManyCountBase
            reference="comments"
            target="post_id"
            loading="Loading..."
        />
    </Wrapper>
);

export const Offline = () => {
    return (
        <Wrapper
            dataProvider={{
                getManyReference: () =>
                    Promise.resolve({
                        data: [comments.filter(c => c.post_id === 1)[0]],
                        total: comments.filter(c => c.post_id === 1).length,
                    }),
            }}
        >
            <div>
                <RenderChildOnDemand>
                    <ReferenceManyCountBase
                        reference="comments"
                        target="post_id"
                        loading="Loading..."
                        offline={
                            <span style={{ color: 'orange' }}>
                                You are offline, cannot load data
                            </span>
                        }
                    />
                </RenderChildOnDemand>
            </div>
            <SimulateOfflineButton />
        </Wrapper>
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
