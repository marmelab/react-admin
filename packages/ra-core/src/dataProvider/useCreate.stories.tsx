import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useCreate } from './useCreate';
import { useGetOne } from './useGetOne';

export default { title: 'ra-core/dataProvider/useCreate' };

export const SuccessCase = ({ timeout = 1000 }) => {
    const posts: { id: number; title: string; author: string }[] = [];
    const dataProvider = {
        getOne: (resource, params) => {
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        create: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = { id: posts.length + 1, ...params.data };
                    posts.push(post);
                    resolve({ data: post });
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <SuccessCore />
        </CoreAdminContext>
    );
};

const SuccessCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetOne(
        'posts',
        { id: 1 },
        { enabled: success === 'success' }
    );
    const [create, { isPending }] = useCreate();
    const handleClick = () => {
        create(
            'posts',
            {
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
            </dl>
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
    const posts: { id: number; title: string; author: string }[] = [];
    const dataProvider = {
        getOne: (resource, params) => {
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
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
            queryClient={new QueryClient()}
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
    const { data, refetch } = useGetOne(
        'posts',
        { id: 1 },
        { enabled: success === 'success' }
    );
    const [create, { isPending }] = useCreate();
    const handleClick = () => {
        setError(undefined);
        create(
            'posts',
            {
                data: { title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
                onError: e => setError(e),
            }
        );
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
            </dl>
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

export const WithMiddlewaresSuccess = ({ timeout = 1000 }) => {
    const posts: { id: number; title: string; author: string }[] = [];
    const dataProvider = {
        getOne: (resource, params) => {
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        create: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = { id: posts.length + 1, ...params.data };
                    posts.push(post);
                    resolve({ data: post });
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <WithMiddlewaresSuccessCore />
        </CoreAdminContext>
    );
};

const WithMiddlewaresSuccessCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetOne(
        'posts',
        { id: 1 },
        { enabled: success === 'success' }
    );
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { title: 'Hello World' },
        },
        {
            // @ts-ignore
            getMutateWithMiddlewares: mutate => async (resource, params) => {
                return mutate(resource, {
                    ...params,
                    data: { title: `${params.data.title} from middleware` },
                });
            },
        }
    );
    const handleClick = () => {
        create(
            'posts',
            {
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
            </dl>
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
    const posts: { id: number; title: string; author: string }[] = [];
    const dataProvider = {
        getOne: (resource, params) => {
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
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
            queryClient={new QueryClient()}
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
    const { data, refetch } = useGetOne(
        'posts',
        { id: 1 },
        { enabled: success === 'success' }
    );
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { title: 'Hello World' },
        },
        {
            // @ts-ignore
            getMutateWithMiddlewares: mutate => async (resource, params) => {
                return mutate(resource, {
                    ...params,
                    data: { title: `${params.data.title} from middleware` },
                });
            },
        }
    );
    const handleClick = () => {
        setError(undefined);
        create(
            'posts',
            {
                data: { title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
                onError: e => setError(e),
            }
        );
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
            </dl>
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
