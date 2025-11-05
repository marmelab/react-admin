import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';

import { CoreAdmin, CoreAdminContext, Resource } from '../core';
import { useUpdate } from './useUpdate';
import { useGetOne } from './useGetOne';
import type { MutationMode as MutationModeType } from '../types';
import {
    EditBase,
    ListBase,
    RecordsIterator,
    useRegisterMutationMiddleware,
} from '../controller';
import { Form, InputProps, useInput } from '../form';
import { TestMemoryRouter } from '../routing';
import { testDataProvider } from './testDataProvider';
import { Link } from 'react-router-dom';
import { useNotificationContext } from '../notification';
import { useTakeUndoableMutation } from './undo';

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

export const Middleware = ({
    middleware = (resource: string, params: any) => {
        console.log(
            `Updating resource ${resource} with params:`,
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
        // @ts-ignore
        getOne: (resource, params) => {
            return Promise.resolve({
                // eslint-disable-next-line eqeqeq
                data: posts.find(p => p.id == params.id),
            });
        },
        update: (resource, params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    // eslint-disable-next-line eqeqeq
                    const post = posts.find(p => p.id == params.id);
                    if (post) {
                        post.title = params.data.title;
                    }
                    // @ts-ignore
                    resolve({ data: post });
                }, timeout);
            });
        },
    });
    return (
        <TestMemoryRouter initialEntries={['/posts']}>
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
                                    render={record => (
                                        <li>
                                            <Link to={`/posts/${record.id}`}>
                                                {record.title}
                                            </Link>
                                        </li>
                                    )}
                                />
                            </ul>
                        </ListBase>
                    }
                    edit={
                        <EditBase mutationMode={mutationMode}>
                            <Form>
                                <TextInput source="title" />
                                <UpdateMiddleware middleware={middleware} />
                                <button type="submit">Save</button>
                            </Form>
                        </EditBase>
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

const UpdateMiddleware = ({
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

export const InvalidateList = ({
    mutationMode = 'undoable',
}: {
    mutationMode?: MutationModeType;
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
                    list={
                        <ListBase loading={<p>Loading...</p>}>
                            <RecordsIterator
                                render={record => (
                                    <div>
                                        {record.id}: {record.title}
                                    </div>
                                )}
                            />
                            <Notification />
                        </ListBase>
                    }
                    edit={
                        <EditBase mutationMode={mutationMode}>
                            <Form>
                                <TextInput source="title" />
                                <button type="submit">Save</button>
                            </Form>
                        </EditBase>
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
