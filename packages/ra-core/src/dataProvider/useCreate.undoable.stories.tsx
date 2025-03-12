import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useTakeUndoableMutation } from './undo';
import { useCreate } from './useCreate';
import { useGetOne } from './useGetOne';

export default { title: 'ra-core/dataProvider/useCreate/undoable' };

export const SuccessCase = ({ timeout = 1000 }) => {
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
            <SuccessCore />
        </CoreAdminContext>
    );
};

const SuccessCore = () => {
    const isMutating = useIsMutating();
    const [notification, setNotification] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>();
    const takeMutation = useTakeUndoableMutation();
    const { data, error, refetch } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate();
    const handleClick = () => {
        create(
            'posts',
            {
                data: { id: 2, title: 'Hello World' },
            },
            {
                mutationMode: 'undoable',
                onSuccess: () => setSuccess('success'),
            }
        );
        setNotification(true);
    };

    return (
        <>
            {error ? (
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
                        Create post
                    </button>
                )}
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const ErrorCase = ({ timeout = 1000 }) => {
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
        create: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
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
            <ErrorCore />
        </CoreAdminContext>
    );
};

const ErrorCore = () => {
    const isMutating = useIsMutating();
    const [notification, setNotification] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<any>();
    const takeMutation = useTakeUndoableMutation();
    const { data, error: getOneError, refetch } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate();
    const handleClick = () => {
        create(
            'posts',
            {
                data: { id: 2, title: 'Hello World' },
            },
            {
                mutationMode: 'undoable',
                onSuccess: () => setSuccess('success'),
                onError: e => {
                    setError(e);
                    setSuccess('');
                },
            }
        );
        setNotification(true);
    };
    return (
        <>
            {getOneError ? (
                <p>{getOneError.message}</p>
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
                        Create post
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

export const WithMiddlewaresSuccess = ({ timeout = 1000 }) => {
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
            <WithMiddlewaresCore />
        </CoreAdminContext>
    );
};

const WithMiddlewaresCore = () => {
    const isMutating = useIsMutating();
    const [notification, setNotification] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>();
    const takeMutation = useTakeUndoableMutation();
    const { data, error, refetch } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { id: 2, title: 'Hello World' },
        },
        {
            mutationMode: 'undoable',
            // @ts-ignore
            getMutateWithMiddlewares: mutate => async (resource, params) => {
                return mutate(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        title: `${params.data.title} from middleware`,
                    },
                });
            },
        }
    );
    const handleClick = () => {
        create(
            'posts',
            {
                data: { id: 2, title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
            }
        );
        setNotification(true);
    };
    return (
        <>
            {error ? (
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
                        Create post
                    </button>
                )}
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

export const WithMiddlewaresError = ({ timeout = 1000 }) => {
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
        create: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
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
            <WithMiddlewaresErrorCore />
        </CoreAdminContext>
    );
};

const WithMiddlewaresErrorCore = () => {
    const isMutating = useIsMutating();
    const [notification, setNotification] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<any>();
    const takeMutation = useTakeUndoableMutation();
    const { data, error: getOneError, refetch } = useGetOne('posts', { id: 2 });
    const [create, { isPending }] = useCreate(
        'posts',
        {
            data: { id: 2, title: 'Hello World' },
        },
        {
            mutationMode: 'undoable',
            // @ts-ignore
            getMutateWithMiddlewares: mutate => async (resource, params) => {
                return mutate(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        title: `${params.data.title} from middleware`,
                    },
                });
            },
        }
    );
    const handleClick = () => {
        create(
            'posts',
            {
                data: { id: 2, title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
                onError: e => {
                    setError(e);
                    setSuccess('');
                },
            }
        );
        setNotification(true);
    };
    return (
        <>
            {getOneError ? (
                <p>{getOneError.message}</p>
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
                        Create post
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
