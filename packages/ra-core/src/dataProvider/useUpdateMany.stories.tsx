import * as React from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdmin, CoreAdminContext, Resource } from '../core';
import { useUpdateMany } from './useUpdateMany';
import { useGetList } from './useGetList';
import { useState } from 'react';
import { useGetOne } from './useGetOne';
import { useTakeUndoableMutation } from './undo';
import type { DataProvider, MutationMode as MutationModeType } from '../types';
import fakeRestDataProvider from 'ra-data-fakerest';
import { TestMemoryRouter, useRedirect } from '../routing';
import { useNotificationContext, useNotify } from '../notification';
import { EditBase, ListBase, RecordsIterator } from '../controller';

export default { title: 'ra-core/dataProvider/useUpdateMany' };

export const UndefinedValues = () => {
    const data = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' },
    ];
    const dataProvider = {
        getList: async () => ({ data, total: 2 }),
        updateMany: () => new Promise(() => {}), // never resolve to see only optimistic update
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <UndefinedValuesCore />
        </CoreAdminContext>
    );
};

const UndefinedValuesCore = () => {
    const { data } = useGetList('posts');
    const [updateMany, { isPending }] = useUpdateMany();
    const handleClick = () => {
        updateMany(
            'posts',
            {
                ids: [1, 2],
                data: { id: undefined, title: 'world' },
            },
            { mutationMode: 'optimistic' }
        );
    };
    return (
        <>
            <pre>{JSON.stringify(data)}</pre>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Update title
                </button>
            </div>
        </>
    );
};

export const WithMiddlewares = ({
    timeout = 1000,
    mutationMode,
    shouldError,
}: {
    timeout?: number;
    mutationMode: 'optimistic' | 'pessimistic' | 'undoable';
    shouldError?: boolean;
}) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: () => {
            return Promise.resolve({
                data: posts[0],
            });
        },
        updateMany: (resource, params) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (shouldError) {
                        return reject(new Error('something went wrong'));
                    }
                    posts[0].title = params.data.title;
                    resolve({ data: [1] });
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <WithMiddlewaresCore mutationMode={mutationMode} />
        </CoreAdminContext>
    );
};
WithMiddlewares.args = {
    timeout: 1000,
    mutationMode: 'optimistic',
    shouldError: false,
};
WithMiddlewares.argTypes = {
    timeout: {
        control: { type: 'number' },
    },
    mutationMode: {
        options: ['optimistic', 'pessimistic', 'undoable'],
        control: { type: 'select' },
    },
    shouldError: {
        control: { type: 'boolean' },
    },
};

const WithMiddlewaresCore = ({
    mutationMode,
}: {
    mutationMode: 'optimistic' | 'pessimistic' | 'undoable';
}) => {
    const isMutating = useIsMutating();
    const [notification, setNotification] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<any>();

    const takeMutation = useTakeUndoableMutation();

    const { data, refetch } = useGetOne('posts', { id: 1 });
    const [updateMany, { isPending }] = useUpdateMany(
        'posts',
        {
            ids: [1],
            data: { title: 'Hello World' },
        },
        {
            mutationMode,
            // @ts-ignore
            getMutateWithMiddlewares: mutate => async (resource, params) => {
                return mutate(resource, {
                    ...params,
                    data: { title: `${params.data.title} from middleware` },
                });
            },
        }
    );
    const handleClick = () => {
        updateMany(
            'posts',
            {
                ids: [1],
                data: { title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
                onError: e => {
                    setError(e);
                    setSuccess('');
                },
            }
        );
        if (mutationMode === 'undoable') {
            setNotification(true);
        }
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
                {notification ? (
                    <>
                        <button
                            onClick={() => {
                                setNotification(false);
                                const mutation = takeMutation();
                                if (!mutation) return;
                                mutation({ isUndo: false });
                            }}
                        >
                            Confirm
                        </button>
                        &nbsp;
                        <button
                            onClick={() => {
                                setNotification(false);
                                const mutation = takeMutation();
                                if (!mutation) return;
                                mutation({ isUndo: true });
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={handleClick} disabled={isPending}>
                        Update title
                    </button>
                )}
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {error && <div>{error.message}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const MutationMode = () => {
    const data = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' },
    ];
    const dataProvider = {
        getList: async () => ({ data, total: 2 }),
        updateMany: () => new Promise(() => {}), // never resolve to see only optimistic update
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
    const { data } = useGetList('posts');
    const [mutationMode, setMutationMode] =
        React.useState<MutationModeType>('pessimistic');
    const [updateMany, { isPending }] = useUpdateMany(
        'posts',
        {
            ids: [1, 2],
            data: { id: undefined, title: 'world' },
        },
        { mutationMode }
    );
    const handleClick = () => {
        updateMany();
    };
    return (
        <>
            <pre>{JSON.stringify(data)}</pre>
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
            </div>
        </>
    );
};

export const Params = ({ dataProvider }: { dataProvider?: DataProvider }) => {
    const data = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' },
    ];
    const defaultDataProvider = {
        getList: async () => ({ data, total: 2 }),
        updateMany: () => new Promise(() => {}), // never resolve to see only optimistic update
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
    const { data } = useGetList('posts');
    const [params, setParams] = React.useState<any>({});
    const [updateMany, { isPending }] = useUpdateMany(
        'posts',
        {
            ids: [1, 2],
            data: { id: undefined, title: 'world' },
            meta: params.meta,
        },
        { mutationMode: 'optimistic' }
    );
    const handleClick = () => {
        updateMany();
    };
    return (
        <>
            <pre>{JSON.stringify(data)}</pre>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Update title
                </button>
                &nbsp;
                <button
                    onClick={() => setParams({ meta: 'test' })}
                    disabled={isPending}
                >
                    Change params
                </button>
            </div>
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

const UpdateButton = ({ mutationMode }: { mutationMode: MutationModeType }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [updateMany, { isPending }] = useUpdateMany();
    const handleClick = () => {
        updateMany(
            'posts',
            {
                ids: [1],
                data: { title: 'Hello updated' },
            },
            {
                mutationMode,
                onSuccess: () => {
                    // Show undoable notification like controllers do
                    notify('resources.posts.notifications.updated', {
                        type: 'info',
                        undoable: mutationMode === 'undoable',
                    });
                    // Redirect to list after mutation succeeds
                    redirect('list', 'posts');
                },
            }
        );
    };
    return (
        <button onClick={handleClick} disabled={isPending}>
            Update
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
                                <UpdateButton mutationMode={mutationMode} />
                            </div>
                        </EditBase>
                    }
                    list={
                        <ListBase loading={<p>Loading...</p>}>
                            <RecordsIterator
                                render={record => (
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
