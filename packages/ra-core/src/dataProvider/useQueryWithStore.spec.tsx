import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import expect from 'expect';

import { renderWithRedux } from 'ra-test';
import { useQueryWithStore } from './useQueryWithStore';
import { DataProviderContext } from '../dataProvider';

const UseQueryWithStore = ({
    query = { type: 'getOne', resource: 'posts', payload: { id: 1 } },
    options = {},
    dataSelector = state => state.admin?.resources.posts.data[query.payload.id],
    totalSelector = state => null,
    callback = null,
    ...rest
}) => {
    const hookValue = useQueryWithStore(
        query,
        options,
        dataSelector,
        totalSelector
    );
    if (callback) callback(hookValue);
    return (
        <>
            <div>hello</div>
            <button onClick={() => hookValue.refetch()}>refetch</button>
        </>
    );
};

describe('useQueryWithStore', () => {
    it('should not call the dataProvider if options.enabled is set to false and run when it changes to true', async () => {
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 1, title: 'titleFromDataProvider' },
                })
            ),
        };
        const callback = jest.fn();
        const { rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore
                    callback={callback}
                    options={{ enabled: false }}
                />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        let callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toBeUndefined();
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(false);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();

        await new Promise(resolve => setImmediate(resolve)); // wait for useEffect
        callArgs = callback.mock.calls[1][0];
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(false);

        callback.mockClear();
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore
                    callback={callback}
                    options={{ enabled: true }}
                />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toBeUndefined();
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(false);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();

        callback.mockClear();
        await new Promise(resolve => setImmediate(resolve)); // wait for useEffect
        callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toBeUndefined();
        expect(callArgs.loading).toEqual(true);
        expect(callArgs.loaded).toEqual(false);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();

        callArgs = callback.mock.calls[1][0];
        expect(callArgs.data).toEqual({
            id: 1,
            title: 'titleFromDataProvider',
        });
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(true);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();

        callback.mockClear();
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore
                    callback={callback}
                    options={{ enabled: false }}
                />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toEqual({
            id: 1,
            title: 'titleFromDataProvider',
        });
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(true);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();

        callback.mockClear();
        await new Promise(resolve => setImmediate(resolve)); // wait for useEffect
        callArgs = callback.mock.calls[0][0];
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(false);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();
    });

    it('should return data from dataProvider', async () => {
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 1, title: 'titleFromDataProvider' },
                })
            ),
        };
        const callback = jest.fn();
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore callback={callback} />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        let callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toBeUndefined();
        expect(callArgs.loading).toEqual(true);
        expect(callArgs.loaded).toEqual(false);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();
        callback.mockClear();
        await new Promise(resolve => setImmediate(resolve)); // dataProvider Promise returns result on next tick
        callArgs = callback.mock.calls[1][0];
        expect(callArgs.data).toEqual({
            id: 1,
            title: 'titleFromDataProvider',
        });
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(true);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();
    });

    it('should return data from the store first, then data from dataProvider', async () => {
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 2, title: 'titleFromDataProvider' },
                })
            ),
        };
        const callback = jest.fn();
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore
                    query={{
                        type: 'getOne',
                        resource: 'posts',
                        payload: { id: 2 },
                    }}
                    callback={callback}
                />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: {
                                2: { id: 2, title: 'titleFromReduxStore' },
                            },
                        },
                    },
                },
            }
        );
        let callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toEqual({ id: 2, title: 'titleFromReduxStore' });
        expect(callArgs.loading).toEqual(true);
        expect(callArgs.loaded).toEqual(true);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();
        callback.mockClear();
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalled();
        });
        // dataProvider Promise returns result on next tick
        await waitFor(() => {
            callArgs = callback.mock.calls[1][0];
            expect(callArgs.data).toEqual({
                id: 2,
                title: 'titleFromDataProvider',
            });
            expect(callArgs.loading).toEqual(false);
            expect(callArgs.loaded).toEqual(true);
            expect(callArgs.error).toBeNull();
            expect(callArgs.total).toBeNull();
        });
    });

    it('should return an error when dataProvider returns a rejected Promise', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.reject({
                    message: 'error',
                })
            ),
        };
        const callback = jest.fn();
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore callback={callback} />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        let callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toBeUndefined();
        expect(callArgs.loading).toEqual(true);
        expect(callArgs.loaded).toEqual(false);
        expect(callArgs.error).toBeNull();
        expect(callArgs.total).toBeNull();
        callback.mockClear();
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalled();
        });
        callArgs = callback.mock.calls[0][0];
        expect(callArgs.data).toBeUndefined();
        expect(callArgs.loading).toEqual(false);
        expect(callArgs.loaded).toEqual(false);
        expect(callArgs.error).toEqual({ message: 'error' });
        expect(callArgs.total).toBeNull();
    });

    it('should refetch the dataProvider on refresh', async () => {
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 3, title: 'titleFromDataProvider' },
                })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore
                    query={{
                        type: 'getOne',
                        resource: 'posts',
                        payload: { id: 3 },
                    }}
                />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: {
                                3: { id: 3, title: 'titleFromReduxStore' },
                            },
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toBeCalledTimes(1);
        });
        dispatch({ type: 'RA/REFRESH_VIEW' });
        await waitFor(() => {
            expect(dataProvider.getOne).toBeCalledTimes(2);
        });
    });

    it('should refetch the dataProvider when refetch is called', async () => {
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 3, title: 'titleFromDataProvider' },
                })
            ),
        };
        const { getByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore
                    query={{
                        type: 'getOne',
                        resource: 'posts',
                        payload: { id: 3 },
                    }}
                />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: {
                                3: { id: 3, title: 'titleFromReduxStore' },
                            },
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toBeCalledTimes(1);
        });
        fireEvent.click(getByText('refetch'));
        await waitFor(() => {
            expect(dataProvider.getOne).toBeCalledTimes(2);
        });
    });

    it('should call the dataProvider twice for different requests in the same tick', async () => {
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 1, title: 'titleFromDataProvider' },
                })
            ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore />
                <UseQueryWithStore
                    query={{
                        type: 'getOne',
                        resource: 'posts',
                        payload: { id: 2 },
                    }}
                />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toBeCalledTimes(2);
        });
    });

    it('should not call the dataProvider twice for the same request in the same tick', async () => {
        const dataProvider = {
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 1, title: 'titleFromDataProvider' },
                })
            ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseQueryWithStore />
                <UseQueryWithStore />
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toBeCalledTimes(1);
        });
    });
});
