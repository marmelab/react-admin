import * as React from 'react';
import expect from 'expect';

import { renderWithRedux } from 'ra-test';
import useGetList from './useGetList';
import { DataProviderContext } from '../dataProvider';
import { waitFor } from '@testing-library/react';

const UseGetList = ({
    resource = 'posts',
    pagination = { page: 1, perPage: 10 },
    sort = { field: 'id', order: 'DESC' },
    filter = {},
    options = {},
    callback = null,
    ...rest
}) => {
    const hookValue = useGetList(resource, pagination, sort, filter, options);
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
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList pagination={{ page: 1, perPage: 20 }} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
        expect(dispatch.mock.calls[0][0].type).toBe('CUSTOM_FETCH');
        expect(dataProvider.getList).toBeCalledTimes(1);
        expect(dataProvider.getList.mock.calls[0]).toEqual([
            'posts',
            {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
            },
        ]);
    });

    it('should not call the dataProvider on update', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList />
            </DataProviderContext.Provider>
        );
        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(5);
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
    });

    it('should call the dataProvider on update when the resource changes', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }], total: 1 })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList resource="comments" />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(10);
        expect(dataProvider.getList).toBeCalledTimes(2);
    });

    it('should retrieve results from redux state on mount', () => {
        const hookValue = jest.fn();
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 })
            ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList callback={hookValue} />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: { 1: { id: 1 }, 2: { id: 2 } },
                            list: {
                                cachedRequests: {
                                    '{"pagination":{"page":1,"perPage":10},"sort":{"field":"id","order":"DESC"},"filter":{}}': {
                                        ids: [1, 2],
                                        total: 2,
                                    },
                                },
                            },
                        },
                    },
                },
            }
        );
        expect(hookValue.mock.calls[0][0]).toMatchObject({
            data: { 1: { id: 1 }, 2: { id: 2 } },
            ids: [1, 2],
            total: 2,
            loading: true,
            loaded: true,
            error: null,
        });
    });

    it('should replace redux data with dataProvider data', async () => {
        const hookValue = jest.fn();
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
        await new Promise(resolve => setTimeout(resolve)); // empty the query deduplication in useQueryWithStore
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList callback={hookValue} />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: { 1: { id: 1 }, 2: { id: 2 } },
                            list: {
                                cachedRequests: {
                                    '{}': {
                                        ids: [1, 2],
                                        total: 2,
                                    },
                                },
                            },
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(hookValue.mock.calls.pop()[0]).toMatchObject({
                data: {
                    1: { id: 1, title: 'foo' },
                    2: { id: 2, title: 'bar' },
                },
                ids: [1, 2],
                total: 2,
                loading: false,
                loaded: true,
                error: null,
            });
        });
    });

    it('should return loading state false once the dataProvider returns', async () => {
        const hookValue = jest.fn();
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
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList callback={hookValue} />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: { 1: { id: 1 }, 2: { id: 2 } },
                            list: {
                                cachedRequests: {
                                    '{}': {
                                        ids: [1, 2],
                                        total: 2,
                                    },
                                },
                            },
                        },
                    },
                },
            }
        );
        expect(hookValue.mock.calls.pop()[0].loading).toBe(true);
        await waitFor(() => {
            expect(hookValue.mock.calls.pop()[0].loading).toBe(false);
        });
    });

    it('should set the loading state depending on the availability of the data in the redux store', () => {
        const hookValue = jest.fn();
        renderWithRedux(<UseGetList callback={hookValue} />, {
            admin: {
                resources: { posts: { data: {}, cachedRequests: {} } },
            },
        });
        expect(hookValue.mock.calls[0][0]).toMatchObject({
            data: {},
            ids: [],
            total: undefined,
            loading: true,
            loaded: false,
            error: null,
        });
    });

    it('should set the error state when the dataProvider fails', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const hookValue = jest.fn();
        const dataProvider = {
            getList: jest.fn(() => Promise.reject(new Error('failed'))),
        };
        await new Promise(resolve => setTimeout(resolve)); // empty the query deduplication in useQueryWithStore
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList callback={hookValue} />
            </DataProviderContext.Provider>
        );
        expect(hookValue.mock.calls.pop()[0].error).toBe(null);
        await waitFor(() => {
            expect(hookValue.mock.calls.pop()[0].error).toEqual(
                new Error('failed')
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
        await new Promise(resolve => setTimeout(resolve)); // empty the query deduplication in useQueryWithStore
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList options={{ onSuccess: onSuccess1 }} />
                <UseGetList
                    resource="comments"
                    options={{ onSuccess: onSuccess2 }}
                />
            </DataProviderContext.Provider>
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

    it('should execute failure side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const onFailure = jest.fn();
        const dataProvider = {
            getList: jest.fn(() => Promise.reject(new Error('failed'))),
        };
        await new Promise(resolve => setTimeout(resolve)); // empty the query deduplication in useQueryWithStore
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetList options={{ onFailure }} />
            </DataProviderContext.Provider>
        );
        await waitFor(() => {
            expect(onFailure).toBeCalledTimes(1);
            expect(onFailure.mock.calls.pop()[0]).toEqual(new Error('failed'));
        });
    });
});
