import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useDeleteMany } from './useDeleteMany';
import { useGetList } from './useGetList';
import type { DataProvider, MutationMode as MutationModeType } from '../types';

export default { title: 'ra-core/dataProvider/useDeleteMany' };

export const MutationMode = () => {
    let posts = [
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
        deleteMany: (resource, params) => {
            console.log('delete', resource, params);
            return new Promise(resolve => {
                setTimeout(() => {
                    posts = posts.filter(post => !params.ids.includes(post.id));
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

    const [deleteMany, { isPending }] = useDeleteMany(
        'posts',
        {
            ids: [1],
        },
        {
            mutationMode,
            onSuccess: () => setSuccess('success'),
        }
    );

    const handleClick = () => {
        deleteMany();
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete posts
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
    let posts = [
        { id: 1, title: 'Hello' },
        { id: 2, title: 'World' },
    ];
    const defaultDataProvider = {
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
                    posts = posts.filter(post => !params.ids.includes(post.id));
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

    const [deleteMany, { isPending }] = useDeleteMany(
        'posts',
        {
            ids: [1],
            meta: params.meta,
        },
        {
            mutationMode: 'optimistic',
            onSuccess: () => setSuccess('success'),
        }
    );

    const handleClick = () => {
        deleteMany();
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete posts
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
