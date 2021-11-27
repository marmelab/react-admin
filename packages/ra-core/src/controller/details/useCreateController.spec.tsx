import React from 'react';
import expect from 'expect';
import { act } from '@testing-library/react';

import { getRecord } from './useCreateController';
import { CreateController } from './CreateController';
import { renderWithRedux } from 'ra-test';
import { DataProviderContext } from '../../dataProvider';
import { DataProvider } from '../../types';

describe('useCreateController', () => {
    describe('getRecord', () => {
        const location = {
            pathname: '/foo',
            search: undefined,
            state: undefined,
            hash: undefined,
        };

        it('should return an empty record by default', () => {
            expect(getRecord(location, undefined)).toEqual({});
        });

        it('should return location state record when set', () => {
            expect(
                getRecord(
                    {
                        ...location,
                        state: { record: { foo: 'bar' } },
                    },
                    undefined
                )
            ).toEqual({ foo: 'bar' });
        });

        it('should return location search when set', () => {
            expect(
                getRecord(
                    {
                        ...location,
                        search: '?source={"foo":"baz","array":["1","2"]}',
                    },
                    undefined
                )
            ).toEqual({ foo: 'baz', array: ['1', '2'] });
        });

        it('should return location state record when both state and search are set', () => {
            expect(
                getRecord(
                    {
                        ...location,
                        state: { record: { foo: 'bar' } },
                        search: '?foo=baz',
                    },
                    undefined
                )
            ).toEqual({ foo: 'bar' });
        });
    });

    const defaultProps = {
        basePath: '',
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        resource: 'posts',
        debounce: 200,
    };

    it('should call the dataProvider.create() function on save', async () => {
        const create = jest
            .fn()
            .mockImplementationOnce((_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            create,
        } as unknown) as DataProvider;
        let saveCallback;
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar' },
        });
    });

    it('should execute default success side effects on success', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            create: (_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } }),
        } as unknown) as DataProvider;
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify[0]).toEqual({
            type: 'RA/SHOW_NOTIFICATION',
            payload: {
                messageArgs: { smart_count: 1 },
                type: 'info',
                message: 'ra.notification.created',
            },
        });
    });

    it('should execute default failure side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            create: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        const notify = dispatch.mock.calls.find(
            params => params[0].type === 'RA/SHOW_NOTIFICATION'
        );
        expect(notify[0]).toEqual({
            type: 'RA/SHOW_NOTIFICATION',
            payload: {
                messageArgs: { _: 'not good' },
                type: 'warning',
                message: 'not good',
            },
        });
    });

    it('should allow onSuccess to override the default success side effects', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            create: (_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps} onSuccess={onSuccess}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
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
            create: (_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const onSuccessSave = jest.fn();
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps} onSuccess={onSuccess}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
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
            create: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps} onFailure={onFailure}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
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
            create: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();
        const onFailureSave = jest.fn();
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps} onFailure={onFailure}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
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

    it('should allow transform to transform the data before calling create', async () => {
        let saveCallback;
        const create = jest
            .fn()
            .mockImplementationOnce((_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            create,
        } as unknown) as DataProvider;
        const transform = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps} transform={transform}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(transform).toHaveBeenCalledWith({ foo: 'bar' });
        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar', transformed: true },
        });
    });

    it('should allow the save transform option to override the controller transform option', async () => {
        let saveCallback;
        const create = jest
            .fn()
            .mockImplementationOnce((_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } })
            );
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            create,
        } as unknown) as DataProvider;
        const transform = jest.fn();
        const transformSave = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateController {...defaultProps} transform={transform}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, undefined, {
                transform: transformSave,
            })
        );
        expect(transform).not.toHaveBeenCalled();
        expect(transformSave).toHaveBeenCalledWith({ foo: 'bar' });
        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar', transformed: true },
        });
    });
});
