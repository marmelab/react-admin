import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useGetList } from './useGetList';
import { MutationMode } from '../types';
import { useDeleteMany } from './useDeleteMany';

export default { title: 'ra-core/dataProvider/useDeleteMany' };

export const Basic = ({ timeout = 1000 }: { timeout?: number }) => {
    const posts = [
        { id: 1, title: 'Hello World 1' },
        { id: 2, title: 'Hello World 2' },
        { id: 3, title: 'Hello World 3' },
        { id: 4, title: 'Hello World 4' },
    ];
    const dataProvider = {
        getList: (resource, params) => {
            console.log('getList', resource, params);
            return Promise.resolve({
                data: posts,
                total: posts.length,
            });
        },
        deleteMany: (resource, params) => {
            console.log('deleteMany', resource, params);
            return new Promise(resolve => {
                setTimeout(() => {
                    for (const id of params.ids) {
                        const index = posts.findIndex(p => p.id === id);
                        posts.splice(index, 1);
                    }
                    resolve({ data: params.ids });
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
    const { data, refetch } = useGetList('posts');
    const [id, setId] = useState<number>(1);
    const [mutationMode, setMutationMode] =
        useState<MutationMode>('pessimistic');
    const [deleteMany, { isPending }] = useDeleteMany('posts', undefined, {
        mutationMode,
        onSuccess: () => setSuccess('success'),
    });
    const handleClick = () => {
        deleteMany('posts', {
            ids: [id, id + 1],
        });
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete posts
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
                <button onClick={() => setId(prev => prev + 2)}>
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
