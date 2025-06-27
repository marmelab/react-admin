import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useCreate } from './useCreate';
import { useGetOne } from './useGetOne';
import { MutationMode } from '../types';

export default { title: 'ra-core/dataProvider/useCreate' };

export const Basic = ({ timeout = 1000 }: { timeout?: number }) => {
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

Basic.args = {
    timeout: 1000,
};

Basic.argTypes = {
    timeout: {
        control: {
            type: 'number',
        },
    },
};

const SuccessCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const [id, setId] = useState<number>(2);
    const [mutationMode, setMutationMode] =
        useState<MutationMode>('pessimistic');
    const { data, error, refetch } = useGetOne('posts', { id });
    const [create, { isPending }] = useCreate(
        'posts',
        {},
        {
            mutationMode,
            onSuccess: () => {
                setSuccess('success');
            },
        }
    );
    const handleClick = () => {
        create('posts', {
            data: { id, title: `Hello World ${id}` },
        });
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
                <button onClick={() => setId(prev => prev + 1)}>
                    Increment id
                </button>
                <button onClick={() => setMutationMode('pessimistic')}>
                    pessimistic
                </button>
                <button onClick={() => setMutationMode('optimistic')}>
                    optimistic
                </button>
                <button onClick={() => setMutationMode('undoable')}>
                    undoable
                </button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};
