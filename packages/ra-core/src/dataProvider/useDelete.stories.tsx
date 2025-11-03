import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';

import { CoreAdmin, CoreAdminContext, Resource } from '../core';
import { useDelete } from './useDelete';
import { useGetList } from './useGetList';
import type { DataProvider, MutationMode as MutationModeType } from '../types';
import {
    EditBase,
    ListBase,
    RecordsIterator,
    useDeleteController,
    WithRecord,
} from '../controller';
import { TestMemoryRouter } from '../routing';
import { useNotificationContext } from '../notification';
import { useTakeUndoableMutation } from './undo';

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
    const { isPending, handleDelete } = useDeleteController({
        mutationMode,
        redirect: 'list',
    });
    return (
        <button onClick={handleDelete} disabled={isPending}>
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
                                <WithRecord
                                    render={record => (
                                        <div>Title: {record.title}</div>
                                    )}
                                />
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
