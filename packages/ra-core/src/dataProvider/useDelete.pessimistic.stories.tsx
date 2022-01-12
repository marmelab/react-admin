import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from 'react-query';

import { CoreAdminContext } from '../core';
import { useDelete } from './useDelete';
import { useGetList } from './useGetList';

export default { title: 'ra-core/dataProvider/useDelete/pessimistic' };

export const SuccessCase = () => {
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
            <SuccessCore />
        </CoreAdminContext>
    );
};

const SuccessCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetList('posts');
    const [deleteOne, { isLoading }] = useDelete();
    const handleClick = () => {
        deleteOne(
            'posts',
            {
                id: 1,
                previousData: { id: 1, title: 'Hello' },
            },
            {
                mutationMode: 'pessimistic',
                onSuccess: () => setSuccess('success'),
            }
        );
    };
    return (
        <>
            <ul>
                {data?.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
            <div>
                <button onClick={handleClick} disabled={isLoading}>
                    Delete first post
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const ErrorCase = () => {
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
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
                }, 1000);
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
    const { data, refetch } = useGetList('posts');
    const [deleteOne, { isLoading }] = useDelete();
    const handleClick = () => {
        setError(undefined);
        deleteOne(
            'posts',
            {
                id: 1,
                previousData: { id: 1, title: 'Hello World' },
            },
            {
                mutationMode: 'pessimistic',
                onSuccess: () => setSuccess('success'),
                onError: e => setError(e),
            }
        );
    };
    return (
        <>
            <ul>
                {data?.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
            <div>
                <button onClick={handleClick} disabled={isLoading}>
                    Delete first post
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
