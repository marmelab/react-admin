import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useUpdate } from './useUpdate';
import { useGetOne } from './useGetOne';
import type { MutationMode as MutationModeType } from '../types';

export default { title: 'ra-core/dataProvider/useUpdate' };

export const MutationMode = ({ timeout = 1000 }) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = posts.find(p => p.id === params.id);
                    if (post) {
                        post.title = params.data.title;
                    }
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
            <MutationModeCore />
        </CoreAdminContext>
    );
};

const MutationModeCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetOne('posts', { id: 1 });
    const [mutationMode, setMutationMode] =
        React.useState<MutationModeType>('pessimistic');
    const [update, { isPending }] = useUpdate(
        'posts',
        {
            id: 1,
            data: { title: 'Hello World' },
        },
        {
            mutationMode,
            onSuccess: () => setSuccess('success'),
        }
    );
    const handleClick = () => {
        update();
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
                <button onClick={handleClick} disabled={isPending}>
                    Update title
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
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = posts.find(p => p.id === params.id);
                    if (post) {
                        post.title = params.data.title;
                    }
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
            <ParamsCore />
        </CoreAdminContext>
    );
};

const ParamsCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetOne('posts', { id: 1 });
    const [params, setParams] = React.useState<any>({ title: 'Hello World' });

    const [update, { isPending }] = useUpdate(
        'posts',
        {
            id: 1,
            data: params,
        },
        {
            mutationMode: 'optimistic',
            onSuccess: () => setSuccess('success'),
        }
    );
    const handleClick = () => {
        update();
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
                <button onClick={handleClick} disabled={isPending}>
                    Update title
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
