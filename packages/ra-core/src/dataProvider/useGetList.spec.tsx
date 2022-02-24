import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';
import { QueryClient } from 'react-query';

import { CoreAdminContext } from '../core';
import { useGetList } from './useGetList';

const UseGetList = ({
    resource = 'posts',
    pagination = { page: 1, perPage: 10 },
    sort = { field: 'id', order: 'DESC' },
    filter = {},
    options = {},
    meta = undefined,
    callback = null,
    ...rest
}) => {
    const hookValue = useGetList(
        resource,
        { pagination, sort, filter, meta },
        options
    );
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

describe('useGetList', () => {
    it('should call dataProvider.getList() on mount', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList pagination={{ page: 1, perPage: 20 }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toBeCalledWith('posts', {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
            });
        });
    });

    it('should not call the dataProvider on update', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        };
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
    });

    it('should call the dataProvider on update when the resource changes', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        };
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList resource="comments" />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList
                    pagination={{ page: 1, perPage: 20 }}
                    meta={{ hello: 'world' }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledWith('posts', {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
                meta: { hello: 'world' },
            });
        });
    });

    it('should return initial data based on Query Cache', async () => {
        const callback = jest.fn();
        const queryClient = new QueryClient();
        queryClient.setQueryData(
            [
                'posts',
                'getList',
                {
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
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'live' }], total: 1 })
            ),
        };
        render(
            <CoreAdminContext
                queryClient={queryClient}
                dataProvider={dataProvider}
            >
                <UseGetList callback={callback} />
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
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                    total: 2,
                })
            ),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList callback={callback} />
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
        const dataProvider = {
            getList: jest.fn(() => Promise.reject(new Error('failed'))),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList options={{ retry: false }} callback={callback} />
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
        const dataProvider = {
            getList: jest
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
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList options={{ onSuccess: onSuccess1 }} />
                <UseGetList
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
        const dataProvider = {
            getList: jest.fn(() => Promise.reject(new Error('failed'))),
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseGetList options={{ onError, retry: false }} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(onError).toBeCalledTimes(1);
            expect(onError.mock.calls.pop()[0]).toEqual(new Error('failed'));
        });
    });
});
