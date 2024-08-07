import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { Identifier, PaginationPayload, SortPayload } from '../types';
import { testDataProvider } from './testDataProvider';
import { useGetManyReference } from './useGetManyReference';

const UseGetManyReference = ({
    resource = 'posts',
    target = 'comments',
    id = 1,
    pagination = { page: 1, perPage: 10 },
    sort = { field: 'id', order: 'DESC' } as const,
    filter = {},
    options = {},
    meta = undefined,
    callback = null,
}: {
    resource?: string;
    target?: string;
    id?: Identifier;
    pagination?: PaginationPayload;
    sort?: SortPayload;
    filter?: any;
    options?: any;
    meta?: any;
    callback?: any;
}) => {
    const hookValue = useGetManyReference(
        resource,
        { target, id, pagination, sort, filter, meta },
        options
    );
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

describe('useGetManyReference', () => {
    it('should call dataProvider.getManyReference() on mount', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 1, title: 'foo' }],
                    total: 1,
                })
            ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledTimes(1);
            expect(dataProvider.getManyReference).toBeCalledWith('posts', {
                target: 'comments',
                id: 1,
                filter: {},
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'DESC' },
                signal: undefined,
            });
        });
    });

    it('should not call the dataProvider on update', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        });
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledTimes(1);
        });
    });

    it('should call the dataProvider on update when the resource changes', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        });
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference resource="comments" />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference meta={{ hello: 'world' }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledWith('posts', {
                target: 'comments',
                id: 1,
                filter: {},
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'DESC' },
                meta: { hello: 'world' },
                signal: undefined,
            });
        });
    });

    it('should return initial data based on Query Cache', async () => {
        const callback = jest.fn();
        const queryClient = new QueryClient();
        queryClient.setQueryData(
            [
                'posts',
                'getManyReference',
                {
                    target: 'comments',
                    id: 1,
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'DESC' },
                    filter: {},
                },
            ],
            {
                data: [{ id: 1, title: 'cached' }],
                total: 1,
            }
        );
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'live' }], total: 1 })
            ),
        });
        render(
            <CoreAdminContext
                queryClient={queryClient}
                dataProvider={dataProvider}
            >
                <UseGetManyReference callback={callback} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ data: [{ id: 1, title: 'cached' }] })
            );
        });
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ data: [{ id: 1, title: 'live' }] })
            );
        });
    });

    it('should return isFetching false once the dataProvider returns', async () => {
        const callback = jest.fn();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                    total: 2,
                })
            ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference callback={callback} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ isFetching: true })
            );
        });
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ isFetching: false })
            );
        });
    });

    it('should set the error state when the dataProvider fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const callback = jest.fn();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.reject(new Error('failed'))
            ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference
                    options={{ retry: false }}
                    callback={callback}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ error: null })
            );
        });
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ error: new Error('failed') })
            );
        });
    });

    it('should execute success side effects on success', async () => {
        const onSuccess1 = jest.fn();
        const onSuccess2 = jest.fn();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest
                .fn()
                .mockReturnValueOnce(
                    Promise.resolve({
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'bar' },
                        ],
                        total: 2,
                    })
                )
                .mockReturnValueOnce(
                    Promise.resolve({
                        data: [
                            { id: 3, foo: 1 },
                            { id: 4, foo: 2 },
                        ],
                        total: 2,
                    })
                ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference options={{ onSuccess: onSuccess1 }} />
                <UseGetManyReference
                    resource="comments"
                    options={{ onSuccess: onSuccess2 }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(onSuccess1).toBeCalledTimes(1);
            expect(onSuccess1.mock.calls.pop()[0]).toEqual({
                data: [
                    { id: 1, title: 'foo' },
                    { id: 2, title: 'bar' },
                ],
                total: 2,
            });
            expect(onSuccess2).toBeCalledTimes(1);
            expect(onSuccess2.mock.calls.pop()[0]).toEqual({
                data: [
                    { id: 3, foo: 1 },
                    { id: 4, foo: 2 },
                ],
                total: 2,
            });
        });
    });

    it('should execute error side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const onError = jest.fn();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.reject(new Error('failed'))
            ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetManyReference options={{ onError, retry: false }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(onError).toBeCalledTimes(1);
            expect(onError.mock.calls.pop()[0]).toEqual(new Error('failed'));
        });
    });

    it('should pre-populate getOne Query Cache', async () => {
        const callback = jest.fn();
        const queryClient = new QueryClient();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'live' }], total: 1 })
            ),
        });
        render(
            <CoreAdminContext
                queryClient={queryClient}
                dataProvider={dataProvider}
            >
                <UseGetManyReference callback={callback} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ data: [{ id: 1, title: 'live' }] })
            );
        });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toEqual({ id: 1, title: 'live' });
    });

    it('should still pre-populate getOne Query Cache with custom onSuccess', async () => {
        const callback = jest.fn();
        const onSuccess = jest.fn();
        const queryClient = new QueryClient();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getManyReference: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'live' }], total: 1 })
            ),
        });
        render(
            <CoreAdminContext
                queryClient={queryClient}
                dataProvider={dataProvider}
            >
                <UseGetManyReference
                    callback={callback}
                    options={{ onSuccess }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ data: [{ id: 1, title: 'live' }] })
            );
        });
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                expect.objectContaining({ data: [{ id: 1, title: 'live' }] })
            );
        });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toEqual({ id: 1, title: 'live' });
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const dataProvider = testDataProvider({
            getManyReference: jest.fn(
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
                <UseGetManyReference />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['posts', 'getManyReference'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });

    it('should discriminate result type', () => {
        // this is a TypeScript verification. It should compile.
        const _ComponentToTest = () => {
            const { data, error, isPending } = useGetManyReference<{
                id: number;
                title: string;
            }>('posts', {
                target: 'comments',
                id: 1,
            });
            if (isPending) {
                return <>Loading</>;
            }
            if (error) {
                return <>Error</>;
            }
            return (
                <ul>
                    {data.map(post => (
                        <li key={post.id}>{post.title}</li>
                    ))}
                </ul>
            );
        };
        expect(_ComponentToTest).toBeDefined();
    });
});
