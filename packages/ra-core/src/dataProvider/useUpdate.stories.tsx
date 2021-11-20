import * as React from 'react';
import { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { TestContext } from 'ra-test';
import DataProviderContext from './DataProviderContext';
import { useUpdate } from './useUpdate';
import { useGetOne } from './useGetOne';

export default { title: 'ra-core/dataProvider/useUpdate' };

const PessimisticSuccessCore = () => {
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetOne('posts', 1);
    const mutation = useUpdate('posts', undefined, undefined, undefined, {
        mutationMode: 'pessimistic',
    });
    const handleClick = () => {
        mutation.mutate(
            {
                id: 1,
                data: { title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
            }
        );
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
                <dt>author</dt>
                <dd>{data?.author}</dd>
            </dl>
            <div>
                <button onClick={handleClick} disabled={mutation.isLoading}>
                    Update title
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
        </>
    );
};

export const PessimisticSuccess = () => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            console.log('getOne', resource, params);
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            console.log('update', resource, params);
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = posts.find(p => p.id === params.id);
                    post.title = params.data.title;
                    resolve({ data: post });
                }, 1000);
            });
        },
    } as any;
    return (
        <TestContext enableReducers>
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <PessimisticSuccessCore />
                </DataProviderContext.Provider>
            </QueryClientProvider>
        </TestContext>
    );
};

const PessimisticErrorCore = () => {
    const [error, setError] = useState<any>();
    const { data, refetch } = useGetOne('posts', 1);
    const mutation = useUpdate('posts', undefined, undefined, undefined, {
        mutationMode: 'pessimistic',
    });
    const handleClick = () => {
        setError(undefined);
        mutation.mutate(
            {
                id: 1,
                data: { title: 'Hello World' },
            },
            {
                onError: e => setError(e),
            }
        );
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
                <dt>author</dt>
                <dd>{data?.author}</dd>
            </dl>
            <div>
                <button onClick={handleClick} disabled={mutation.isLoading}>
                    Update title
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {error && <div>{error.message}</div>}
        </>
    );
};

export const PessimisticError = () => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            console.log('getOne', resource, params);
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            console.log('update', resource, params);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
                }, 1000);
            });
        },
    } as any;
    return (
        <TestContext enableReducers>
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <PessimisticErrorCore />
                </DataProviderContext.Provider>
            </QueryClientProvider>
        </TestContext>
    );
};

const OptimisticSuccessCore = () => {
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetOne('posts', 1);
    const mutation = useUpdate('posts', undefined, undefined, undefined, {
        mutationMode: 'optimistic',
    });
    const handleClick = () => {
        mutation.mutate(
            {
                id: 1,
                data: { title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
            }
        );
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
                <dt>author</dt>
                <dd>{data?.author}</dd>
            </dl>
            <div>
                <button onClick={handleClick} disabled={mutation.isLoading}>
                    Update title
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
        </>
    );
};

export const OptimisticSuccess = () => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            console.log('getOne', resource, params);
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            console.log('update', resource, params);
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = posts.find(p => p.id === params.id);
                    post.title = params.data.title;
                    resolve({ data: post });
                }, 1000);
            });
        },
    } as any;
    return (
        <TestContext enableReducers>
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <OptimisticSuccessCore />
                </DataProviderContext.Provider>
            </QueryClientProvider>
        </TestContext>
    );
};

const OptimisticErrorCore = () => {
    const [error, setError] = useState<any>();
    const { data, refetch } = useGetOne('posts', 1);
    const mutation = useUpdate('posts', undefined, undefined, undefined, {
        mutationMode: 'optimistic',
    });
    const handleClick = () => {
        mutation.mutate(
            {
                id: 1,
                data: { title: 'Hello World' },
            },
            {
                onError: e => setError(e),
            }
        );
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
                <dt>author</dt>
                <dd>{data?.author}</dd>
            </dl>
            <div>
                <button onClick={handleClick} disabled={mutation.isLoading}>
                    Update title
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {error && <div>{error.message}</div>}
        </>
    );
};

export const OptimisticError = () => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            console.log('getOne', resource, params);
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            console.log('update', resource, params);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
                }, 1000);
            });
        },
    } as any;
    return (
        <TestContext enableReducers>
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <OptimisticErrorCore />
                </DataProviderContext.Provider>
            </QueryClientProvider>
        </TestContext>
    );
};
