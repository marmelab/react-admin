import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';

import { CoreAdmin, CoreAdminContext, Resource } from '../core';
import { useDeleteMany } from './useDeleteMany';
import { useGetList } from './useGetList';
import type { DataProvider, MutationMode as MutationModeType } from '../types';
import { TestMemoryRouter, useRedirect } from '../routing';
import { useNotificationContext, useNotify } from '../notification';
import { useTakeUndoableMutation } from './undo';
import { EditBase, ListBase, RecordsIterator } from '../controller';

export default { title: 'ra-core/dataProvider/useDeleteMany' };

export const MutationMode = () => {
    let posts = [
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
        deleteMany: (_, params) => {
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

const Notification = () => {
    const { notifications, resetNotifications } = useNotificationContext();
    const takeMutation = useTakeUndoableMutation();

    return notifications.length > 0 ? (
        <>
            <div>{notifications[0].message}</div>
            <div style={{ display: 'flex', gap: '16px' }}>
                <button
                    onClick={() => {
                        if (notifications[0].notificationOptions?.undoable) {
                            const mutation = takeMutation();
                            if (mutation) {
                                mutation({ isUndo: false });
                            }
                        }
                        resetNotifications();
                    }}
                >
                    Close
                </button>
            </div>
        </>
    ) : null;
};

const DeleteButton = ({ mutationMode }: { mutationMode: MutationModeType }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [deleteMany, { isPending }] = useDeleteMany();
    const handleClick = () => {
        deleteMany(
            'posts',
            {
                ids: [1],
            },
            {
                mutationMode,
                onSuccess: () => {
                    notify('resources.posts.notifications.deleted', {
                        type: 'info',
                        undoable: mutationMode === 'undoable',
                    });
                    redirect('list', 'posts');
                },
            }
        );
    };
    return (
        <button onClick={handleClick} disabled={isPending}>
            Delete
        </button>
    );
};

export const InvalidateList = ({
    mutationMode,
}: {
    mutationMode: MutationModeType;
}) => {
    const dataProvider = fakeRestDataProvider(
        {
            posts: [
                { id: 1, title: 'Hello' },
                { id: 2, title: 'World' },
            ],
        },
        process.env.NODE_ENV !== 'test',
        process.env.NODE_ENV === 'test' ? 10 : 1000
    );

    return (
        <TestMemoryRouter initialEntries={['/posts/1']}>
            <CoreAdmin dataProvider={dataProvider}>
                <Resource
                    name="posts"
                    edit={
                        <EditBase>
                            <div>
                                <h1>Edit Post</h1>
                                <DeleteButton mutationMode={mutationMode} />
                            </div>
                        </EditBase>
                    }
                    list={
                        <ListBase loading={<p>Loading...</p>}>
                            <RecordsIterator
                                render={(record: any) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '8px',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {record.id}: {record.title}
                                    </div>
                                )}
                            />
                            <Notification />
                        </ListBase>
                    }
                />
            </CoreAdmin>
        </TestMemoryRouter>
    );
};
InvalidateList.args = {
    mutationMode: 'undoable',
};
InvalidateList.argTypes = {
    mutationMode: {
        control: {
            type: 'select',
        },
        options: ['pessimistic', 'optimistic', 'undoable'],
    },
};

export const Params = ({ dataProvider }: { dataProvider?: DataProvider }) => {
    let posts = [
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
        deleteMany: (_, params) => {
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
