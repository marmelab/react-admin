import * as React from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useUpdateMany } from './useUpdateMany';
import { useGetList } from './useGetList';
import { useState } from 'react';
import { useGetOne } from './useGetOne';
import { useTakeUndoableMutation } from './undo';

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
