import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useDelete } from './useDelete';
import { useGetList } from './useGetList';
import type { DataProvider, MutationMode as MutationModeType } from '../types';

export default { title: 'ra-core/dataProvider/useDelete' };

export const MutationMode = () => {
    const posts = [
        { id: 1, title: 'Hello' },
        { id: 2, title: 'World' },
    ];
    const dataProvider = {
        getList: () => {
            return Promise.resolve({
                data: posts,
                total: posts.length,
            });
        },
        delete: (_, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const index = posts.findIndex(p => p.id === params.id);
                    posts.splice(index, 1);
                    resolve({ data: params.previousData });
                }, 1000);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <MutationModeCore />
        </CoreAdminContext>
    );
};

const MutationModeCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetList('posts');
    const [mutationMode, setMutationMode] =
        React.useState<MutationModeType>('pessimistic');

    const [deleteOne, { isPending }] = useDelete(
        'posts',
        {
            id: 1,
            previousData: { id: 1, title: 'Hello' },
        },
        {
            mutationMode,
            onSuccess: () => setSuccess('success'),
        }
    );

    const handleClick = () => {
        deleteOne();
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete first post
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

export const Params = ({ dataProvider }: { dataProvider?: DataProvider }) => {
    const posts = [
        { id: 1, title: 'Hello' },
        { id: 2, title: 'World' },
    ];
    const defaultDataProvider = {
        getList: () => {
            return Promise.resolve({
                data: posts,
                total: posts.length,
            });
        },
        delete: (_, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const index = posts.findIndex(p => p.id === params.id);
                    posts.splice(index, 1);
                    resolve({ data: params.previousData });
                }, 1000);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider ?? defaultDataProvider}
        >
            <ParamsCore />
        </CoreAdminContext>
    );
};

const ParamsCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetList('posts');
    const [params, setParams] = React.useState<any>({});

    const [deleteOne, { isPending }] = useDelete(
        'posts',
        {
            id: 1,
            previousData: { id: 1, title: 'Hello' },
            meta: params.meta,
        },
        {
            mutationMode: 'optimistic',
            onSuccess: () => setSuccess('success'),
        }
    );

    const handleClick = () => {
        deleteOne();
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete first post
                </button>
                &nbsp;
                <button
                    onClick={() => setParams({ meta: 'test' })}
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
