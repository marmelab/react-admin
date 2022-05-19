import * as React from 'react';
import expect from 'expect';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { createMemoryHistory } from 'history';

import { EditController } from './EditController';
import { DataProvider } from '../../types';
import { CoreAdminContext } from '../../core';
import { useNotificationContext } from '../../notification';
import { SaveContextProvider } from '..';
import undoableEventEmitter from '../../dataProvider/undoableEventEmitter';
import { Middleware, useRegisterMutationMiddleware } from '../saveContext';
import { testDataProvider, useUpdate } from '../../dataProvider';

describe('useEditController', () => {
    const defaultProps = {
        id: 12,
        resource: 'posts',
    };

    it('should call the dataProvider.getOne() function on mount', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps}>
                    {({ record }) => <div>{record && record.title}</div>}
                </EditController>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalled();
            expect(screen.queryAllByText('hello')).toHaveLength(1);
        });
    });

    it('should decode the id from the route params', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 'test?', title: 'hello' } })
            );
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        const history = createMemoryHistory({
            initialEntries: ['/posts/test%3F'],
        });

        render(
            <CoreAdminContext dataProvider={dataProvider} history={history}>
                <Routes>
                    <Route
                        path="/posts/:id"
                        element={
                            <EditController resource="posts">
                                {({ record }) => (
                                    <div>{record && record.title}</div>
                                )}
                            </EditController>
                        }
                    />
                </Routes>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', { id: 'test?' });
        });
    });

    it('should accept custom client query options', async () => {
        const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const getOne = jest
            .fn()
            .mockImplementationOnce(() => Promise.reject(new Error()));
        const onError = jest.fn();
        const dataProvider = ({ getOne } as unknown) as DataProvider;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController
                    {...defaultProps}
                    resource="posts"
                    queryOptions={{ onError }}
                >
                    {() => <div />}
                </EditController>
            </CoreAdminContext>
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
            getOne: () =>
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update,
        } as unknown) as DataProvider;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps} mutationMode="pessimistic">
                    {({ record, save, saving }) => {
                        return (
                            <>
                                <p>{record?.test}</p>
                                <button
                                    aria-label="save"
                                    onClick={() => save({ test: 'updated' })}
                                />
                            </>
                        );
                    }}
                </EditController>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        screen.getByLabelText('save').click();

        await waitFor(() => {
            expect(update).toHaveBeenCalledWith('posts', {
                id: 12,
                data: { test: 'updated' },
                previousData: { id: 12, test: 'previous' },
            });
        });
    });

    it('should return an undoable save callback by default', async () => {
        let post = { id: 12, test: 'previous' };
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) => {
                post = { ...previousData, ...data };
                return Promise.resolve({ data: post });
            });
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: post }),
            update,
        } as unknown) as DataProvider;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps}>
                    {({ save, record }) => {
                        return (
                            <>
                                <p>{record?.test}</p>
                                <button
                                    aria-label="save"
                                    onClick={() => save({ test: 'updated' })}
                                />
                            </>
                        );
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await waitFor(() => {
            screen.getByText('previous');
        });
        screen.getByLabelText('save').click();
        await waitFor(() => {
            screen.getByText('updated');
        });
        expect(update).not.toHaveBeenCalledWith('posts', {
            id: 12,
            data: { test: 'updated' },
            previousData: { id: 12, test: 'previous' },
        });
        undoableEventEmitter.emit('end', { isUndo: false });
        await waitFor(() => {
            screen.getByText('updated');
        });
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { test: 'updated' },
            previousData: { id: 12, test: 'previous' },
        });
    });

    it('should return an immediate save callback when mutationMode is pessimistic', async () => {
        let post = { id: 12 };
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) => {
                post = { ...previousData, ...data };
                return Promise.resolve({ data: post });
            });
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: post }),
            update,
        } as unknown) as DataProvider;
        let saveCallback;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps} mutationMode="pessimistic">
                    {({ save, record }) => {
                        saveCallback = save;
                        return <>{JSON.stringify(record)}</>;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByText('{"id":12}');
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByText('{"id":12,"foo":"bar"}');
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: { id: 12 },
        });
    });

    it('should execute success side effects on success in pessimistic mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController {...defaultProps} mutationMode="pessimistic">
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await waitFor(() =>
            expect(notificationsSpy).toEqual([
                {
                    message: 'ra.notification.updated',
                    type: 'info',
                    notificationOptions: {
                        messageArgs: {
                            smart_count: 1,
                        },
                        undoable: false,
                    },
                },
            ])
        );
    });

    it('should allow mutationOptions to override the default success side effects in pessimistic mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onSuccess }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(notificationsSpy).toEqual([]);
    });

    it('should allow mutationOptions to override the default success side effects in optimistic mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController
                    {...defaultProps}
                    mutationMode="optimistic"
                    mutationOptions={{ onSuccess }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(notificationsSpy).toEqual([]);
    });

    it('should allow mutationOptions to override the default success side effects in undoable mode', async () => {
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController
                    {...defaultProps}
                    mutationOptions={{ onSuccess }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(notificationsSpy).toEqual([]);
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

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onSuccess }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () =>
            saveCallback(
                { foo: 'bar' },
                {
                    onSuccess: onSuccessSave,
                }
            )
        );
        expect(onSuccess).not.toHaveBeenCalled();
        await waitFor(() => expect(onSuccessSave).toHaveBeenCalled());
        expect(notificationsSpy).toEqual([]);
    });

    it('should execute error side effects on error in pessimistic mode', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController {...defaultProps} mutationMode="pessimistic">
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(notificationsSpy).toEqual([
            {
                message: 'not good',
                type: 'warning',
                notificationOptions: { messageArgs: { _: 'not good' } },
            },
        ]);
    });

    it('should allow mutationOptions to override the default failure side effects in pessimistic mode', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onError = jest.fn();

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onError }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(notificationsSpy).toEqual([]);
    });

    it('should allow mutationOptions to override the default failure side effects in optimistic mode', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onError = jest.fn();

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController
                    {...defaultProps}
                    mutationMode="optimistic"
                    mutationOptions={{ onError }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await waitFor(() => expect(saveCallback).toBeDefined());
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        await waitFor(() => expect(onError).toHaveBeenCalled());
        // we get the (optimistic) success notification but not the error notification
        expect(notificationsSpy).toEqual([
            {
                message: 'ra.notification.updated',
                type: 'info',
                notificationOptions: {
                    messageArgs: {
                        smart_count: 1,
                    },
                    undoable: false,
                },
            },
        ]);
    });

    it('should allow the save onError option to override the failure side effects override', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown) as DataProvider;
        const onError = jest.fn();
        const onErrorSave = jest.fn();

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Notification />
                <EditController
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onError }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () =>
            saveCallback(
                { foo: 'bar' },
                {
                    onError: onErrorSave,
                }
            )
        );
        expect(onError).not.toHaveBeenCalled();
        expect(onErrorSave).toHaveBeenCalled();
        expect(notificationsSpy).toEqual([]);
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
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController
                    {...defaultProps}
                    mutationMode="pessimistic"
                    transform={transform}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(transform).toHaveBeenCalledWith(
            { foo: 'bar' },
            { previousData: undefined }
        );

        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar', transformed: true },
            previousData: undefined,
        });
    });

    it('should allow the save transform option to override the transform side effect', async () => {
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
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController
                    {...defaultProps}
                    mutationMode="pessimistic"
                    transform={transform}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () =>
            saveCallback(
                { foo: 'bar' },
                {
                    transform: transformSave,
                }
            )
        );
        expect(transform).not.toHaveBeenCalled();
        expect(transformSave).toHaveBeenCalledWith(
            { foo: 'bar' },
            { previousData: undefined }
        );
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar', transformed: true },
            previousData: undefined,
        });
    });

    it('should allow to register middlewares', async () => {
        let saveCallback;
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data }) =>
                Promise.resolve({ data: { id, ...data } })
            );
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        });
        const middleware: Middleware<ReturnType<typeof useUpdate>[0]> = jest.fn(
            (resource, params, options, next) => {
                return next(
                    resource,
                    { ...params, meta: { addedByMiddleware: true } },
                    options
                );
            }
        );

        const Child = () => {
            useRegisterMutationMiddleware<ReturnType<typeof useUpdate>[0]>(
                middleware
            );
            return null;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps} mutationMode="pessimistic">
                    {({
                        save,
                        saving,
                        registerMutationMiddleware,
                        unregisterMutationMiddleware,
                    }) => {
                        saveCallback = save;
                        return (
                            <SaveContextProvider
                                value={{
                                    save,
                                    saving,
                                    registerMutationMiddleware,
                                    unregisterMutationMiddleware,
                                }}
                            >
                                <Child />
                            </SaveContextProvider>
                        );
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));

        await waitFor(() => {
            expect(update).toHaveBeenCalledWith('posts', {
                id: 12,
                data: { foo: 'bar' },
                meta: { addedByMiddleware: true },
                previousData: undefined,
            });
        });
        expect(middleware).toHaveBeenCalledWith(
            'posts',
            {
                id: 12,
                data: { foo: 'bar' },
            },
            expect.any(Object),
            expect.any(Function)
        );
    });
});
