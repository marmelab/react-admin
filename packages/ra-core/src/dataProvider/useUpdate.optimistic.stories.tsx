import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from 'react-query';

import { CoreAdminContext } from '../core';
import { useUpdate } from './useUpdate';
import { useGetOne } from './useGetOne';

export default { title: 'ra-core/dataProvider/useUpdate/optimistic' };

export const SuccessCase = () => {
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
    const { data, refetch } = useGetOne('posts', { id: 1 });
    const [update, { isLoading }] = useUpdate();
    const handleClick = () => {
        update(
            'posts',
            {
                id: 1,
                data: { title: 'Hello World' },
            },
            {
                mutationMode: 'optimistic',
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
                <button onClick={handleClick} disabled={isLoading}>
                    Update title
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
    const { data, refetch } = useGetOne('posts', { id: 1 });
    const [update, { isLoading }] = useUpdate();
    const handleClick = () => {
        update(
            'posts',
            {
                id: 1,
                data: { title: 'Hello World' },
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
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
                <dt>author</dt>
                <dd>{data?.author}</dd>
            </dl>
            <div>
                <button onClick={handleClick} disabled={isLoading}>
                    Update title
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
