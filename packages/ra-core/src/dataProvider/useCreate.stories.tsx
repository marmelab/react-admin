import * as React from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useCreate } from './useCreate';
import { useGetOne } from './useGetOne';
import type { MutationMode as MutationModeType } from '../types';

export default { title: 'ra-core/dataProvider/useCreate' };

export const MutationMode = ({ timeout = 1000 }) => {
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
            <MutationModeCore />
        </CoreAdminContext>
    );
};

const MutationModeCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = React.useState<string>();
    const [mutationMode, setMutationMode] =
        React.useState<MutationModeType>('pessimistic');

    const {
        isPending: isPendingGetOne,
        data,
        error,
        refetch,
    } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { id: 2, title: 'Hello World' },
        },
        {
            mutationMode,
            onSuccess: () => setSuccess('success'),
        }
    );
    const handleClick = () => {
        create();
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
                <button
                    onClick={() => setMutationMode('optimistic')}
                    disabled={isPending}
                >
                    Change mutation mode to optimistic
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const Params = ({ timeout = 1000 }) => {
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
            <ParamsCore />
        </CoreAdminContext>
    );
};

const ParamsCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = React.useState<string>();
    const [params, setParams] = React.useState<any>({ title: 'Hello World' });

    const {
        isPending: isPendingGetOne,
        data,
        error,
        refetch,
    } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { id: 2, ...params },
        },
        {
            mutationMode: 'optimistic',
            onSuccess: () => setSuccess('success'),
        }
    );
    const handleClick = () => {
        create();
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
                <button
                    onClick={() => setParams({ title: 'Goodbye World' })}
                    disabled={isPending}
                >
                    Change params
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};
