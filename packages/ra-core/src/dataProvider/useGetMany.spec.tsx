import * as React from 'react';
import expect from 'expect';

import { renderWithRedux } from 'ra-test';
import useGetMany from './useGetMany';
import { DataProviderContext } from '../dataProvider';
import { waitFor } from '@testing-library/react';

const UseGetMany = ({
    resource,
    ids,
    options = {},
    callback = null,
    ...rest
}) => {
    const hookValue = useGetMany(resource, ids, options);
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

describe('useGetMany', () => {
    it('should call the dataProvider with a GET_MANY on mount', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
        expect(dispatch.mock.calls[0][0].type).toBe('RA/CRUD_GET_MANY');
        expect(dataProvider.getMany).toBeCalledTimes(1);
        expect(dataProvider.getMany.mock.calls[0]).toEqual([
            'posts',
            { ids: [1] },
        ]);
    });

    it('should not call the dataProvider with a GET_MANY on mount if enabled is false', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    options={{ enabled: false }}
                />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(0);
        expect(dataProvider.getMany).toBeCalledTimes(0);

        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    options={{ enabled: true }}
                />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
        expect(dispatch.mock.calls[0][0].type).toBe('RA/CRUD_GET_MANY');
        expect(dataProvider.getMany).toBeCalledTimes(1);
        expect(dataProvider.getMany.mock.calls[0]).toEqual([
            'posts',
            { ids: [1] },
        ]);
    });

    it('should aggregate multiple queries into a single call', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
                <UseGetMany resource="posts" ids={[2, 3]} />
                <UseGetMany resource="posts" ids={[4]} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
        expect(dataProvider.getMany).toBeCalledTimes(1);
        expect(dataProvider.getMany.mock.calls[0]).toEqual([
            'posts',
            { ids: [1, 2, 3, 4] },
        ]);
    });

    it('should deduplicate repeated ids', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
                <UseGetMany resource="posts" ids={[1, 2]} />
                <UseGetMany resource="posts" ids={[2, 3]} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
        expect(dataProvider.getMany).toBeCalledTimes(1);
        expect(dataProvider.getMany.mock.calls[0]).toEqual([
            'posts',
            { ids: [1, 2, 3] },
        ]);
    });

    it('should not aggregate or deduplicate calls for different resources', async () => {
        const dataProvider = {
            getMany: jest
                .fn()
                .mockReturnValueOnce(
                    Promise.resolve({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })
                )
                .mockReturnValueOnce(
                    Promise.resolve({ data: [{ id: 5 }, { id: 6 }, { id: 7 }] })
                ),
        };

        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="posts" ids={[1, 2]} />
                <UseGetMany resource="posts" ids={[2, 3]} />
                <UseGetMany resource="comments" ids={[5, 6]} />
                <UseGetMany resource="comments" ids={[6, 7]} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toBeCalledTimes(2);
        expect(dataProvider.getMany.mock.calls[0]).toEqual([
            'posts',
            { ids: [1, 2, 3] },
        ]);
        expect(dataProvider.getMany.mock.calls[1]).toEqual([
            'comments',
            { ids: [5, 6, 7] },
        ]);
    });

    it('should not call the dataProvider on update', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </DataProviderContext.Provider>
        );
        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(5);
            expect(dataProvider.getMany).toBeCalledTimes(1);
        });
    });

    it('should call the dataProvider on update when the resource changes', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="posts" ids={[1]} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany resource="comments" ids={[1]} />
            </DataProviderContext.Provider>
        );
        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(10);
            expect(dataProvider.getMany).toBeCalledTimes(2);
        });
    });

    it('should retrieve results from redux state on mount', () => {
        const hookValue = jest.fn();
        renderWithRedux(
            <UseGetMany resource="posts" ids={[1, 2]} callback={hookValue} />,
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                    },
                },
            }
        );
        expect(hookValue.mock.calls[0][0]).toEqual({
            data: [{ id: 1 }, { id: 2 }],
            loading: true,
            loaded: true,
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should replace redux data with dataProvider data', async () => {
        const hookValue = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                })
            ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1, 2]}
                    callback={hookValue}
                />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                    },
                },
            }
        );
        await waitFor(() => {
            if (hookValue.mock.calls.length > 0) {
                expect(hookValue.mock.calls.pop()[0]).toEqual({
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                    loading: false,
                    loaded: true,
                    error: null,
                    refetch: expect.any(Function),
                });
            }
        });
    });

    it('should return loading state false once the dataProvider returns', async () => {
        const hookValue = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                })
            ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1, 2]}
                    callback={hookValue}
                />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
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
        renderWithRedux(
            <UseGetMany resource="posts" ids={[1, 2]} callback={hookValue} />,
            {
                admin: {
                    resources: { posts: { data: {} } },
                },
            }
        );
        expect(hookValue.mock.calls[0][0]).toEqual({
            data: [undefined, undefined],
            loading: true,
            loaded: false,
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should set the error state when the dataProvider fails', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const hookValue = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() => Promise.reject(new Error('failed'))),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1, 2]}
                    callback={hookValue}
                />
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
            getMany: jest
                .fn()
                .mockReturnValueOnce(
                    Promise.resolve({
                        data: [
                            { id: 1, title: 'foo' },
                            { id: 2, title: 'bar' },
                        ],
                    })
                )
                .mockReturnValueOnce(
                    Promise.resolve({
                        data: [
                            { id: 3, foo: 1 },
                            { id: 4, foo: 2 },
                        ],
                    })
                ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1, 2]}
                    options={{ onSuccess: onSuccess1 }}
                />
                <UseGetMany
                    resource="comments"
                    ids={[3, 4]}
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
            });
            expect(onSuccess2).toBeCalledTimes(1);
            expect(onSuccess2.mock.calls.pop()[0]).toEqual({
                data: [
                    { id: 3, foo: 1 },
                    { id: 4, foo: 2 },
                ],
            });
        });
    });

    it('should execute success side effects once for each hook call', async () => {
        const onSuccess = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'foo' },
                        { id: 2, title: 'bar' },
                    ],
                })
            ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    options={{ onSuccess }}
                />
                <UseGetMany
                    resource="posts"
                    ids={[2]}
                    options={{ onSuccess }}
                />
            </DataProviderContext.Provider>
        );
        await waitFor(() => {
            expect(onSuccess).toBeCalledTimes(2);
            expect(onSuccess.mock.calls.shift()[0]).toEqual({
                data: [{ id: 1, title: 'foo' }],
            });
            expect(onSuccess.mock.calls.shift()[0]).toEqual({
                data: [{ id: 2, title: 'bar' }],
            });
        });
    });

    it('should execute failure side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const onFailure = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() => Promise.reject(new Error('failed'))),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1, 2]}
                    options={{ onFailure }}
                />
            </DataProviderContext.Provider>
        );
        await waitFor(() => {
            expect(onFailure).toBeCalledTimes(1);
            expect(onFailure.mock.calls.pop()[0]).toEqual(new Error('failed'));
        });
    });

    it('should execute failure side effects once for each hook call', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const onFailure = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() => Promise.reject(new Error('failed'))),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseGetMany
                    resource="posts"
                    ids={[1]}
                    options={{ onFailure }}
                />
                <UseGetMany
                    resource="posts"
                    ids={[2]}
                    options={{ onFailure }}
                />
            </DataProviderContext.Provider>
        );
        await waitFor(() => {
            expect(onFailure).toBeCalledTimes(2);
            expect(onFailure.mock.calls.shift()[0]).toEqual(
                new Error('failed')
            );
            expect(onFailure.mock.calls.shift()[0]).toEqual(
                new Error('failed')
            );
        });
    });
});
