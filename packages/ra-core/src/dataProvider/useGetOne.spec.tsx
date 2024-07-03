import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';

import { CoreAdminContext } from '../core';
import { useGetOne } from './useGetOne';
import { testDataProvider } from '../dataProvider';
import { QueryClient } from '@tanstack/react-query';

const UseGetOne = ({
    resource,
    id,
    meta = undefined,
    options = {},
    callback = undefined,
}: {
    resource: string;
    id: string | number;
    meta?: object;
    options?: object;
    callback?: Function;
}) => {
    const hookValue = useGetOne(resource, { id, meta }, options);
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

describe('useGetOne', () => {
    let dataProvider;

    beforeEach(() => {
        dataProvider = testDataProvider({
            getOne: jest
                .fn()
                .mockResolvedValue({ data: { id: 1, title: 'foo' } }),
        });
    });

    it('should call dataProvider.getOne() on mount', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
                id: 1,
                signal: undefined,
            });
        });
    });

    it('should not call dataProvider.getOne() on mount if enabled is false', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    options={{ enabled: false }}
                />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(0);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    options={{ enabled: true }}
                />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    });

    it('should not call dataProvider.getOne() on update', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    });

    it('should recall dataProvider.getOne() when id changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={2} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(2);
        });
    });

    it('should recall dataProvider.getOne() when resource changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="comments" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} meta={{ hello: 'world' }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
                id: 1,
                meta: { hello: 'world' },
                signal: undefined,
            });
        });
    });

    it('should set the error state when the dataProvider fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const hookValue = jest.fn();
        const dataProvider = testDataProvider({
            getOne: jest.fn().mockRejectedValue(new Error('failed')),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    callback={hookValue}
                    options={{ retry: false }}
                />
            </CoreAdminContext>
        );
        expect(hookValue).toHaveBeenCalledWith(
            expect.objectContaining({
                error: null,
            })
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(hookValue).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: new Error('failed'),
                })
            );
        });
    });

    it('should execute success side effects on success', async () => {
        const onSuccess = jest.fn();
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne resource="posts" id={1} options={{ onSuccess }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(onSuccess).toHaveBeenCalledWith({ id: 1, title: 'foo' });
        });
    });

    it('should not execute success side effect on error on refetch', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const onSuccess = jest.fn();
        const onError = jest.fn();
        let index = 0;
        const dataProvider = testDataProvider({
            getOne: jest.fn().mockImplementation(() => {
                if (index === 0) {
                    index++;
                    return Promise.resolve({ data: { id: 1, title: 'foo' } });
                } else {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject(new Error('failed'));
                        }, 100);
                    });
                }
            }),
        });
        let localRefetch;
        const callback = ({ refetch }) => {
            localRefetch = refetch;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    options={{ onSuccess, onError, retry: false }}
                    callback={callback}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledTimes(0);
        });

        await localRefetch();

        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledTimes(1);
        });
        jest.clearAllMocks();
    });

    it('should execute error side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = testDataProvider({
            getOne: jest.fn().mockRejectedValue(new Error('failed')),
        });
        const onError = jest.fn();
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetOne
                    resource="posts"
                    id={1}
                    options={{ onError, retry: false }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(new Error('failed'));
        });
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const dataProvider = testDataProvider({
            getOne: jest.fn(
                (_resource, { signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
        });
        dataProvider.supportAbortSignal = true;
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                dataProvider={dataProvider}
                queryClient={queryClient}
            >
                <UseGetOne resource="posts" id={1} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['posts', 'getOne', { id: '1' }],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
    describe('TypeScript', () => {
        it('should return the parametric type', () => {
            type Foo = { id: number; name: string };
            const _Dummy = () => {
                const { data, error, isPending } = useGetOne<Foo>('posts', {
                    id: 1,
                });
                if (isPending || error) return null;
                return <div>{data.name}</div>;
            };
            // no render needed, only checking types
        });
        it('should accept empty id param', () => {
            const _Dummy = () => {
                type Comment = {
                    id: number;
                    post_id: number;
                };
                const { data: comment } = useGetOne<Comment>('comments', {
                    id: 1,
                });
                type Post = {
                    id: number;
                    title: string;
                };
                const { data, error, isPending } = useGetOne<Post>('posts', {
                    id: comment?.post_id,
                });
                if (isPending || error) return null;
                return <div>{data.title}</div>;
            };
            // no render needed, only checking types
        });
    });
});
