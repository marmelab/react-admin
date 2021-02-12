import * as React from 'react';
import { waitFor } from '@testing-library/react';
import expect from 'expect';

import renderWithRedux from '../util/renderWithRedux';
import useQueryWithStore from './useQueryWithStore';
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
    return <div>hello</div>;
};

describe('useQueryWithStore', () => {
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
        expect(callback).toBeCalledWith({
            data: undefined,
            loading: true,
            loaded: false,
            error: null,
            total: null,
        });
        callback.mockClear();
        await new Promise(resolve => setImmediate(resolve)); // dataProvider Promise returns result on next tick
        expect(callback).toBeCalledWith({
            data: { id: 1, title: 'titleFromDataProvider' },
            loading: false,
            loaded: true,
            error: null,
            total: null,
        });
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
        expect(callback).toBeCalledWith({
            data: { id: 2, title: 'titleFromReduxStore' },
            loading: true,
            loaded: true,
            error: null,
            total: null,
        });
        callback.mockClear();
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalled();
        });
        // dataProvider Promise returns result on next tick
        await waitFor(() => {
            expect(callback).toBeCalledWith({
                data: { id: 2, title: 'titleFromDataProvider' },
                loading: false,
                loaded: true,
                error: null,
                total: null,
            });
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
        expect(callback).toBeCalledWith({
            data: undefined,
            loading: true,
            loaded: false,
            error: null,
            total: null,
        });
        callback.mockClear();
        await new Promise(resolve => setImmediate(resolve)); // dataProvider Promise returns result on next tick
        expect(callback).toBeCalledWith({
            data: undefined,
            loading: false,
            loaded: false,
            error: { message: 'error' },
            total: null,
        });
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
        await new Promise(resolve => setTimeout(resolve, 100)); // dataProvider Promise returns result on next tick
        expect(dataProvider.getOne).toBeCalledTimes(1);
        dispatch({ type: 'RA/REFRESH_VIEW' });
        await new Promise(resolve => setTimeout(resolve, 100)); // dataProvider Promise returns result on next tick
        expect(dataProvider.getOne).toBeCalledTimes(2);
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
        await new Promise(resolve => setImmediate(resolve)); // dataProvider Promise returns result on next tick
        expect(dataProvider.getOne).toBeCalledTimes(2);
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
        await new Promise(resolve => setImmediate(resolve)); // dataProvider Promise returns result on next tick
        expect(dataProvider.getOne).toBeCalledTimes(1);
    });
});
