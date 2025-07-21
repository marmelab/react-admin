import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useCreate } from './useCreate';
import { useGetOne } from './useGetOne';

export default { title: 'ra-core/dataProvider/useCreate/optimistic' };

export const SuccessCase = ({ timeout = 1000 }) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            return new Promise((resolve, reject) => {
                const data = posts.find(p => p.id === params.id);
                setTimeout(() => {
                    if (!data) {
                        reject(new Error('nothing yet'));
                    }
                    resolve({ data });
                }, timeout);
            });
        },
        create: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    posts.push(params.data);
                    resolve({ data: params.data });
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: { retry: false },
                        mutations: { retry: false },
                    },
                })
            }
            dataProvider={dataProvider}
        >
            <SuccessCore />
        </CoreAdminContext>
    );
};

const SuccessCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const {
        isPending: isPendingGetOne,
        data,
        error,
        refetch,
    } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate();
    const handleClick = () => {
        create(
            'posts',
            {
                data: { id: 2, title: 'Hello World' },
            },
            {
                mutationMode: 'optimistic',
                onSuccess: () => setSuccess('success'),
            }
        );
    };
    return (
        <>
            {isPendingGetOne ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                <dl>
                    <dt>id</dt>
                    <dd>{data?.id}</dd>
                    <dt>title</dt>
                    <dd>{data?.title}</dd>
                    <dt>author</dt>
                    <dd>{data?.author}</dd>
                </dl>
            )}
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Create post
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const ErrorCase = ({ timeout = 1000 }) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            return new Promise((resolve, reject) => {
                const data = posts.find(p => p.id === params.id);
                setTimeout(() => {
                    if (!data) {
                        reject(new Error('nothing yet'));
                    }
                    resolve({ data });
                }, timeout);
            });
        },
        create: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: { retry: false },
                        mutations: { retry: false },
                    },
                })
            }
            dataProvider={dataProvider}
        >
            <ErrorCore />
        </CoreAdminContext>
    );
};

const ErrorCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<any>();
    const {
        isPending: isPendingGetOne,
        data,
        error: getOneError,
        refetch,
    } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate();
    const handleClick = () => {
        create(
            'posts',
            {
                data: {
                    id: 2,
                    title: 'Hello World',
                },
            },
            {
                mutationMode: 'optimistic',
                onSuccess: () => setSuccess('success'),
                onError: e => {
                    setError(e);
                    setSuccess('');
                },
            }
        );
    };
    return (
        <>
            {isPendingGetOne ? (
                <p>Loading...</p>
            ) : getOneError ? (
                <p>{getOneError.message}</p>
            ) : (
                <dl>
                    <dt>id</dt>
                    <dd>{data?.id}</dd>
                    <dt>title</dt>
                    <dd>{data?.title}</dd>
                    <dt>author</dt>
                    <dd>{data?.author}</dd>
                </dl>
            )}
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Create post
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {error && <div>{error.message}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const WithMiddlewaresSuccess = ({ timeout = 1000 }) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            return new Promise((resolve, reject) => {
                const data = posts.find(p => p.id === params.id);
                setTimeout(() => {
                    if (!data) {
                        reject(new Error('nothing yet'));
                    }
                    resolve({ data });
                }, timeout);
            });
        },
        create: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    posts.push(params.data);
                    resolve({ data: params.data });
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: { retry: false },
                        mutations: { retry: false },
                    },
                })
            }
            dataProvider={dataProvider}
        >
            <WithMiddlewaresSuccessCore />
        </CoreAdminContext>
    );
};

const WithMiddlewaresSuccessCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, error, refetch } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: {
                id: 2,
                title: 'Hello World',
            },
        },
        {
            mutationMode: 'optimistic',
            // @ts-ignore
            getMutateWithMiddlewares: mutate => async (resource, params) => {
                return mutate(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        title: `${params.data.title} from middleware`,
                    },
                });
            },
        }
    );
    const handleClick = () => {
        create(
            'posts',
            {
                data: {
                    id: 2,
                    title: 'Hello World',
                },
            },
            {
                onSuccess: () => setSuccess('success'),
            }
        );
    };
    return (
        <>
            {error ? (
                <p>{error.message}</p>
            ) : (
                <dl>
                    <dt>id</dt>
                    <dd>{data?.id}</dd>
                    <dt>title</dt>
                    <dd>{data?.title}</dd>
                    <dt>author</dt>
                    <dd>{data?.author}</dd>
                </dl>
            )}
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Create post
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const WithMiddlewaresError = ({ timeout = 1000 }) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            return new Promise((resolve, reject) => {
                const data = posts.find(p => p.id === params.id);
                setTimeout(() => {
                    if (!data) {
                        reject(new Error('nothing yet'));
                    }
                    resolve({ data });
                }, timeout);
            });
        },
        create: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: { retry: false },
                        mutations: { retry: false },
                    },
                })
            }
            dataProvider={dataProvider}
        >
            <WithMiddlewaresErrorCore />
        </CoreAdminContext>
    );
};

const WithMiddlewaresErrorCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<any>();
    const { data, error: getOneError, refetch } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: {
                id: 2,
                title: 'Hello World',
            },
        },
        {
            mutationMode: 'optimistic',
            // @ts-ignore
            mutateWithMiddlewares: mutate => async (resource, params) => {
                return mutate(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        title: `${params.data.title} from middleware`,
                    },
                });
            },
        }
    );
    const handleClick = () => {
        setError(undefined);
        create(
            'posts',
            {
                data: {
                    id: 2,
                    title: 'Hello World',
                },
            },
            {
                onSuccess: () => setSuccess('success'),
                onError: e => {
                    setError(e);
                    setSuccess('');
                },
            }
        );
    };
    return (
        <>
            {getOneError ? (
                <p>{getOneError.message}</p>
            ) : (
                <dl>
                    <dt>id</dt>
                    <dd>{data?.id}</dd>
                    <dt>title</dt>
                    <dd>{data?.title}</dd>
                    <dt>author</dt>
                    <dd>{data?.author}</dd>
                </dl>
            )}
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Create post
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {error && <div>{error.message}</div>}
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};
