import * as React from 'react';
import expect from 'expect';
import { act, waitFor } from '@testing-library/react';
import { renderWithRedux } from 'ra-test';
import { MemoryRouter, Route } from 'react-router';
import { QueryClientProvider, QueryClient } from 'react-query';

import { EditController } from './EditController';
import { DataProviderContext } from '../../dataProvider';
import { DataProvider } from '../../types';
import { SaveContextProvider } from '..';

describe('useEditController', () => {
    const defaultProps = {
        id: 12,
        resource: 'posts',
        debounce: 200,
    };

    const saveContextValue = {
        save: jest.fn(),
        setOnFailure: jest.fn(),
    };

    it('should call the dataProvider.getOne() function on mount', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        const { queryAllByText, unmount } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController {...defaultProps}>
                            {({ record }) => (
                                <div>{record && record.title}</div>
                            )}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(queryAllByText('hello')).toHaveLength(1);
        });

        unmount();
    });

    it('should decode the id from the route params', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 'test?', title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        const { unmount } = renderWithRedux(
            <MemoryRouter initialEntries={['/posts/test%3F']}>
                <Route path="/posts/:id">
                    <QueryClientProvider client={new QueryClient()}>
                        <DataProviderContext.Provider value={dataProvider}>
                            <SaveContextProvider value={saveContextValue}>
                                <EditController resource="posts">
                                    {({ record }) => (
                                        <div>{record && record.title}</div>
                                    )}
                                </EditController>
                            </SaveContextProvider>
                        </DataProviderContext.Provider>
                    </QueryClientProvider>
                </Route>
            </MemoryRouter>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', { id: 'test?' });
        });

        unmount();
    });

    it('should accept custom client query options', async () => {
        const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const getOne = jest
            .fn()
            .mockImplementationOnce(() => Promise.reject(new Error()));
        const onError = jest.fn();
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <EditController
                        {...defaultProps}
                        resource="posts"
                        queryOptions={{ onError }}
                    >
                        {() => <div />}
                    </EditController>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
        });
        mock.mockRestore();
    });

    it('should call the dataProvider.update() function on save', async () => {
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown) as DataProvider;
        let saveCallback;
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: undefined,
        });
    });

    it('should return an undoable save callback by default', async () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        let saveCallback;
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController {...defaultProps}>
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        const call = dispatch.mock.calls.find(
            params => params[0].type === 'RA/CRUD_UPDATE_OPTIMISTIC'
        );
        expect(call).not.toBeUndefined();
        const crudUpdateAction = call[0];
        expect(crudUpdateAction.payload).toEqual({
            id: 12,
            data: { foo: 'bar' },
            previousData: undefined,
        });
        expect(crudUpdateAction.meta.resource).toEqual('posts');
    });

    it('should return a save callback when mutationMode is pessimistic', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        const call = dispatch.mock.calls.find(
            params => params[0].type === 'RA/CRUD_UPDATE_OPTIMISTIC'
        );
        expect(call).toBeUndefined();
        const call2 = dispatch.mock.calls.find(
            params => params[0].type === 'RA/CRUD_UPDATE'
        );
        expect(call2).not.toBeUndefined();
        const crudUpdateAction = call2[0];
        expect(crudUpdateAction.payload).toEqual({
            id: 12,
            data: { foo: 'bar' },
            previousData: undefined,
        });
        expect(crudUpdateAction.meta.resource).toEqual('posts');
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify).not.toBeUndefined();
    });

    it('should allow onSuccess to override the default success side effects', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            onSuccess={onSuccess}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(onSuccess).toHaveBeenCalled();
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify).toBeUndefined();
    });

    it('should allow the save onSuccess option to override the success side effects override', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const onSuccessSave = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            onSuccess={onSuccess}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, undefined, {
                onSuccess: onSuccessSave,
            })
        );
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onSuccessSave).toHaveBeenCalled();
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify).toBeUndefined();
    });

    it('should allow onFailure to override the default failure side effects', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            onFailure={onFailure}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(onFailure).toHaveBeenCalled();
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify).toBeUndefined();
    });

    it('should allow the save onFailure option to override the failure side effects override', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();
        const onFailureSave = jest.fn();
        const { dispatch } = renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            onFailure={onFailure}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, undefined, {
                onFailure: onFailureSave,
            })
        );
        expect(onFailure).not.toHaveBeenCalled();
        expect(onFailureSave).toHaveBeenCalled();
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify).toBeUndefined();
    });

    it('should allow transform to transform the data before save', async () => {
        let saveCallback;
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data }) =>
                Promise.resolve({ data: { id, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown) as DataProvider;
        const transform = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            transform={transform}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(transform).toHaveBeenCalledWith({
            foo: 'bar',
        });
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar', transformed: true },
            previousData: undefined,
        });
    });

    it('should the save transform option to override the transform side effect', async () => {
        let saveCallback;
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data }) =>
                Promise.resolve({ data: { id, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown) as DataProvider;
        const transform = jest.fn();
        const transformSave = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        renderWithRedux(
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SaveContextProvider value={saveContextValue}>
                        <EditController
                            {...defaultProps}
                            mutationMode="pessimistic"
                            transform={transform}
                        >
                            {({ save }) => {
                                saveCallback = save;
                                return null;
                            }}
                        </EditController>
                    </SaveContextProvider>
                </DataProviderContext.Provider>
            </QueryClientProvider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, undefined, {
                transform: transformSave,
            })
        );
        expect(transform).not.toHaveBeenCalled();
        expect(transformSave).toHaveBeenCalledWith({
            foo: 'bar',
        });
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar', transformed: true },
            previousData: undefined,
        });
    });
});
