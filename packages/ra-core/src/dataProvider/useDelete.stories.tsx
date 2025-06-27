import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useDelete } from './useDelete';
import { useGetList } from './useGetList';
import { MutationMode } from '../types';

export default { title: 'ra-core/dataProvider/useDelete' };

export const Basic = ({ timeout = 1000 }: { timeout?: number }) => {
    const posts = [
        { id: 1, title: 'Hello' },
        { id: 2, title: 'World' },
    ];
    const dataProvider = {
        getList: (resource, params) => {
            console.log('getList', resource, params);
            return Promise.resolve({
                data: posts,
                total: posts.length,
            });
        },
        delete: (resource, params) => {
            console.log('delete', resource, params);
            return new Promise(resolve => {
                setTimeout(() => {
                    const index = posts.findIndex(p => p.id === params.id);
                    const deletedPost = posts.splice(index, 1);
                    resolve({ data: deletedPost });
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
    const [deleteOne, { isPending }] = useDelete(
        'posts',
        {},
        {
            mutationMode,
            onSuccess: () => setSuccess('success'),
        }
    );
    const handleClick = () => {
        deleteOne('posts', {
            id,
            previousData: { id, title: 'Hello' },
        });
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete post
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
