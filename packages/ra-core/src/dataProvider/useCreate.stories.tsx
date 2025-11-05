import * as React from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';

import { CoreAdmin, CoreAdminContext, Resource } from '../core';
import { useCreate } from './useCreate';
import { useGetOne } from './useGetOne';
import type { MutationMode as MutationModeType } from '../types';
import {
    CreateBase,
    ListBase,
    RecordsIterator,
    useRegisterMutationMiddleware,
} from '../controller';
import { useNotificationContext } from '../notification';
import { useTakeUndoableMutation } from './undo';
import { Form, InputProps, useInput } from '../form';
import { TestMemoryRouter } from '../routing';
import { testDataProvider } from './testDataProvider';
import { useRefresh } from './useRefresh';

export default { title: 'ra-core/dataProvider/useCreate' };

export const MutationMode = ({ timeout = 1000 }) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            return new Promise((resolve, reject) => {
                const data = posts.find(p => p.id === params.id);
                setTimeout(() => {
                    if (!data) {
                        reject(new Error('nothing yet'));
                    }
                    resolve({ data });
                }, timeout);
            });
        },
        create: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    posts.push(params.data);
                    resolve({ data: params.data });
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: { retry: false },
                        mutations: { retry: false },
                    },
                })
            }
            dataProvider={dataProvider}
        >
            <MutationModeCore />
        </CoreAdminContext>
    );
};

const MutationModeCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = React.useState<string>();
    const [mutationMode, setMutationMode] =
        React.useState<MutationModeType>('pessimistic');

    const {
        isPending: isPendingGetOne,
        data,
        error,
        refetch,
    } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { id: 2, title: 'Hello World' },
        },
        {
            mutationMode,
            onSuccess: () => setSuccess('success'),
        }
    );
    const handleClick = () => {
        create();
    };
    return (
        <>
            {isPendingGetOne ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                <dl>
                    <dt>id</dt>
                    <dd>{data?.id}</dd>
                    <dt>title</dt>
                    <dd>{data?.title}</dd>
                    <dt>author</dt>
                    <dd>{data?.author}</dd>
                </dl>
            )}
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Create post
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
            return new Promise((resolve, reject) => {
                const data = posts.find(p => p.id === params.id);
                setTimeout(() => {
                    if (!data) {
                        reject(new Error('nothing yet'));
                    }
                    resolve({ data });
                }, timeout);
            });
        },
        create: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    posts.push(params.data);
                    resolve({ data: params.data });
                }, timeout);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={
                new QueryClient({
                    defaultOptions: {
                        queries: { retry: false },
                        mutations: { retry: false },
                    },
                })
            }
            dataProvider={dataProvider}
        >
            <ParamsCore />
        </CoreAdminContext>
    );
};

const ParamsCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = React.useState<string>();
    const [params, setParams] = React.useState<any>({ title: 'Hello World' });

    const {
        isPending: isPendingGetOne,
        data,
        error,
        refetch,
    } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { id: 2, ...params },
        },
        {
            mutationMode: 'optimistic',
            onSuccess: () => setSuccess('success'),
        }
    );
    const handleClick = () => {
        create();
    };
    return (
        <>
            {isPendingGetOne ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                <dl>
                    <dt>id</dt>
                    <dd>{data?.id}</dd>
                    <dt>title</dt>
                    <dd>{data?.title}</dd>
                    <dt>author</dt>
                    <dd>{data?.author}</dd>
                </dl>
            )}
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Create post
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

export const Middleware = ({
    middleware = (resource: string, params: any) => {
        console.log(
            `Creating resource ${resource} with params:`,
            JSON.stringify(params)
        );
    },
    mutationMode = 'undoable',
    timeout = 1000,
}: {
    mutationMode?: MutationModeType;
    timeout?: number;
    middleware?: (resource: string, params: any) => void;
}) => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = testDataProvider({
        // @ts-ignore
        getList: () => {
            return Promise.resolve({
                data: posts,
                total: posts.length,
            });
        },
        create: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = { id: posts.length + 1, ...params.data };
                    // @ts-ignore
                    posts.push(post);
                    // @ts-ignore
                    resolve({ data: post });
                }, timeout);
            });
        },
    });
    return (
        <TestMemoryRouter initialEntries={['/posts/create']}>
            <CoreAdmin
                queryClient={new QueryClient()}
                dataProvider={dataProvider}
                layout={({ children }) => (
                    <>
                        {children}
                        <Notification />
                    </>
                )}
            >
                <Resource
                    name="posts"
                    list={
                        <ListBase>
                            <ul>
                                <RecordsIterator
                                    render={record => <li>{record.title}</li>}
                                />
                            </ul>
                            <RefreshButton />
                        </ListBase>
                    }
                    create={
                        <CreateBase
                            mutationMode={mutationMode}
                            redirect="list"
                            transform={data => ({
                                id:
                                    mutationMode === 'pessimistic'
                                        ? undefined
                                        : posts.length + 1,
                                ...data,
                            })}
                        >
                            <Form>
                                <TextInput source="title" />
                                <CreateMiddleware middleware={middleware} />
                                <button type="submit">Save</button>
                            </Form>
                        </CreateBase>
                    }
                />
            </CoreAdmin>
        </TestMemoryRouter>
    );
};

Middleware.args = {
    timeout: 1000,
    mutationMode: 'optimistic',
};

Middleware.argTypes = {
    timeout: {
        control: {
            type: 'number',
        },
    },
    mutationMode: {
        control: {
            type: 'select',
        },
        options: ['pessimistic', 'optimistic', 'undoable'],
    },
};

const CreateMiddleware = ({
    middleware,
}: {
    middleware: (resource: string, params: any) => void;
}) => {
    useRegisterMutationMiddleware((resource, params, next) => {
        middleware(resource, params);
        return next(resource, params);
    });

    return null;
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
                        if (notifications[0].notificationOptions.undoable) {
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

const TextInput = (props: InputProps) => {
    const { field, id } = useInput(props);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor={id}>{props.label || field.name}</label>
            <input id={id} {...field} />
        </div>
    );
};

const RefreshButton = () => {
    const refresh = useRefresh();

    return (
        <button type="button" onClick={() => refresh()}>
            Refresh
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
        <TestMemoryRouter initialEntries={['/posts/create']}>
            <CoreAdmin dataProvider={dataProvider}>
                <Resource
                    name="posts"
                    create={
                        <CreateBase mutationMode={mutationMode}>
                            <Form>
                                {mutationMode !== 'pessimistic' && (
                                    <TextInput source="id" defaultValue={3} />
                                )}
                                <TextInput source="title" />
                                <button type="submit">Save</button>
                            </Form>
                        </CreateBase>
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
