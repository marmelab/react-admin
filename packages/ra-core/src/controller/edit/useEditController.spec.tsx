import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import expect from 'expect';
import * as React from 'react';
import { Route, Routes } from 'react-router';

import {
    EditContextProvider,
    SaveContextProvider,
    useEditController,
} from '..';
import { CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { useTakeUndoableMutation } from '../../dataProvider/undo/useTakeUndoableMutation';
import { Form, InputProps, useInput } from '../../form';
import { useNotificationContext } from '../../notification';
import { AuthProvider, DataProvider } from '../../types';
import { Middleware, useRegisterMutationMiddleware } from '../saveContext';
import { EditController } from './EditController';
import { RedirectionSideEffect, TestMemoryRouter } from '../../routing';
import {
    Authenticated,
    CanAccess,
    DisableAuthentication,
} from './useEditController.security.stories';
import { EncodedId } from './useEditController.stories';

const Confirm = () => {
    const takeMutation = useTakeUndoableMutation();
    return (
        <button
            aria-label="confirm"
            onClick={() => {
                const mutation = takeMutation();
                if (!mutation) return;
                mutation({ isUndo: false });
            }}
        />
    );
};

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
        const dataProvider = { getOne } as unknown as DataProvider;
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

    it.each([
        { id: 'test?', url: '/posts/test%3F' },
        { id: 'test%', url: '/posts/test%25' },
    ])(
        'should decode the id $id from the route params',
        async ({ id, url }) => {
            const getOne = jest
                .fn()
                .mockImplementationOnce(() =>
                    Promise.resolve({ data: { id, title: 'hello' } })
                );
            const dataProvider = { getOne } as unknown as DataProvider;

            render(<EncodedId id={id} url={url} dataProvider={dataProvider} />);
            await waitFor(() => {
                expect(getOne).toHaveBeenCalledWith('posts', {
                    id,
                    signal: undefined,
                });
            });
            await waitFor(() => {
                expect(screen.queryAllByText('Title: hello')).toHaveLength(1);
            });
        }
    );

    it('should use the id provided through props if any', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 0, title: 'hello' } })
            );
        const dataProvider = { getOne } as unknown as DataProvider;

        render(
            <TestMemoryRouter initialEntries={['/posts/test%3F']}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route
                            path="/posts/:id"
                            element={
                                <EditController id={0} resource="posts">
                                    {({ record }) => (
                                        <div>{record && record.title}</div>
                                    )}
                                </EditController>
                            }
                        />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await waitFor(() => {
            expect(getOne).toHaveBeenCalledWith('posts', {
                id: 0,
                signal: undefined,
            });
        });
        await waitFor(() => {
            expect(screen.queryAllByText('hello')).toHaveLength(1);
        });
    });

    it('should return the `redirect` provided through props or the default', async () => {
        const getOne = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: { id: 12, title: 'hello' } })
            );
        const dataProvider = { getOne } as unknown as DataProvider;
        const Component = ({
            redirect = undefined,
        }: {
            redirect?: RedirectionSideEffect;
        }) => (
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps} redirect={redirect}>
                    {({ redirect }) => <div>{redirect.toString()}</div>}
                </EditController>
            </CoreAdminContext>
        );
        const { rerender } = render(<Component />);
        await waitFor(() => {
            expect(screen.queryAllByText('list')).toHaveLength(1);
        });

        rerender(<Component redirect="show" />);
        await waitFor(() => {
            expect(screen.queryAllByText('show')).toHaveLength(1);
        });
    });

    describe('queryOptions', () => {
        it('should accept custom client query options', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const getOne = jest
                .fn()
                .mockImplementationOnce(() => Promise.reject(new Error()));
            const onError = jest.fn();
            const dataProvider = { getOne } as unknown as DataProvider;

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
        });

        it('should accept a meta in query options', async () => {
            const getOne = jest
                .fn()
                .mockImplementationOnce(() =>
                    Promise.resolve({ data: { id: 0, title: 'hello' } })
                );
            const dataProvider = { getOne } as unknown as DataProvider;
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <EditController
                        {...defaultProps}
                        resource="posts"
                        queryOptions={{ meta: { foo: 'bar' } }}
                    >
                        {() => <div />}
                    </EditController>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(getOne).toHaveBeenCalledWith('posts', {
                    id: 12,
                    meta: { foo: 'bar' },
                    signal: undefined,
                });
            });
        });
    });

    it('should call the dataProvider.update() function on save', async () => {
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            );
        const dataProvider = {
            getOne: () =>
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update,
        } as unknown as DataProvider;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps} mutationMode="pessimistic">
                    {({ record, save }) => {
                        return (
                            <>
                                <p>{record?.test}</p>
                                <button
                                    aria-label="save"
                                    onClick={() => save!({ test: 'updated' })}
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
            .mockImplementationOnce((_, { data, previousData }) => {
                post = { ...previousData, ...data };
                return Promise.resolve({ data: post });
            });
        const dataProvider = {
            getOne: () => Promise.resolve({ data: post }),
            update,
        } as unknown as DataProvider;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps}>
                    {({ save, record }) => {
                        return (
                            <>
                                <p>{record?.test}</p>
                                <button
                                    aria-label="save"
                                    onClick={() => save!({ test: 'updated' })}
                                />
                                <Confirm />
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
        screen.getByLabelText('confirm').click();
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
            .mockImplementationOnce((_, { data, previousData }) => {
                post = { ...previousData, ...data };
                return Promise.resolve({ data: post });
            });
        const dataProvider = {
            getOne: () => Promise.resolve({ data: post }),
            update,
        } as unknown as DataProvider;
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
        await screen.findByText('{"id":12,"foo":"bar"}');
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: { id: 12 },
        });
    });

    it('should execute success side effects on success in pessimistic mode', async () => {
        let saveCallback;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown as DataProvider;

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
                    message: 'resources.posts.notifications.updated',
                    type: 'info',
                    notificationOptions: {
                        messageArgs: {
                            smart_count: 1,
                            _: 'ra.notification.updated',
                        },
                        undoable: false,
                    },
                },
            ])
        );
    });

    describe('mutationOptions', () => {
        it('should allow mutationOptions to override the default success side effects in pessimistic mode', async () => {
            let saveCallback;
            const dataProvider = {
                getOne: () => Promise.resolve({ data: { id: 12 } }),
                update: (_, { id, data, previousData }) =>
                    Promise.resolve({ data: { id, ...previousData, ...data } }),
            } as unknown as DataProvider;
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
            const dataProvider = {
                getOne: () => Promise.resolve({ data: { id: 12 } }),
                update: (_, { id, data, previousData }) =>
                    Promise.resolve({ data: { id, ...previousData, ...data } }),
            } as unknown as DataProvider;
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
            const dataProvider = {
                getOne: () => Promise.resolve({ data: { id: 12 } }),
                update: (_, { id, data, previousData }) =>
                    Promise.resolve({ data: { id, ...previousData, ...data } }),
            } as unknown as DataProvider;
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

        it('should allow mutationOptions to override the default failure side effects in pessimistic mode', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            let saveCallback;
            const dataProvider = {
                getOne: () => Promise.resolve({ data: { id: 12 } }),
                update: () => Promise.reject({ message: 'not good' }),
            } as unknown as DataProvider;
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
            const dataProvider = {
                getOne: () => Promise.resolve({ data: { id: 12 } }),
                update: () => Promise.reject({ message: 'not good' }),
            } as unknown as DataProvider;
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
                    message: 'resources.posts.notifications.updated',
                    type: 'info',
                    notificationOptions: {
                        messageArgs: {
                            smart_count: 1,
                            _: 'ra.notification.updated',
                        },
                        undoable: false,
                    },
                },
            ]);
        });

        it('should accept meta in mutationOptions', async () => {
            let saveCallback;
            const update = jest
                .fn()
                .mockImplementationOnce((_, { id, data, previousData }) =>
                    Promise.resolve({ data: { id, ...previousData, ...data } })
                );
            const dataProvider = {
                getOne: () => Promise.resolve({ data: { id: 12 } }),
                update,
            } as unknown as DataProvider;

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <EditController
                        {...defaultProps}
                        mutationMode="pessimistic"
                        mutationOptions={{ meta: { lorem: 'ipsum' } }}
                    >
                        {({ save }) => {
                            saveCallback = save;
                            return <div />;
                        }}
                    </EditController>
                </CoreAdminContext>
            );
            await act(async () => saveCallback({ foo: 'bar' }));
            await waitFor(() => {
                expect(update).toHaveBeenCalledWith('posts', {
                    id: 12,
                    data: { foo: 'bar' },
                    previousData: undefined,
                    meta: { lorem: 'ipsum' },
                });
            });
        });
    });

    it('should accept meta as a save option', async () => {
        let saveCallback;
        const update = jest
            .fn()
            .mockImplementationOnce((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            );
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown as DataProvider;

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditController {...defaultProps} mutationMode="pessimistic">
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, { meta: { lorem: 'ipsum' } })
        );
        await waitFor(() => {
            expect(update).toHaveBeenCalledWith('posts', {
                id: 12,
                data: { foo: 'bar' },
                previousData: undefined,
                meta: { lorem: 'ipsum' },
            });
        });
    });

    it('should allow the save onSuccess option to override the success side effects override', async () => {
        let saveCallback;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown as DataProvider;
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
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown as DataProvider;

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
                type: 'error',
                notificationOptions: { messageArgs: { _: 'not good' } },
            },
        ]);
    });

    it('should use the default error message in case no message was provided', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({}),
        } as unknown as DataProvider;

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
                message: 'ra.notification.http_error',
                type: 'error',
                notificationOptions: { messageArgs: { _: undefined } },
            },
        ]);
    });

    it('should not trigger a notification in case of a validation error (handled by useNotifyIsFormInvalid)', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () =>
                Promise.reject({ body: { errors: { foo: 'invalid' } } }),
        } as unknown as DataProvider;

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
        expect(notificationsSpy).toEqual([]);
    });

    it('should trigger a notification even in case of a validation error in optimistic mode', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () =>
                Promise.reject({ body: { errors: { foo: 'invalid' } } }),
        } as unknown as DataProvider;

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
                <EditController {...defaultProps} mutationMode="optimistic">
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(notificationsSpy).toContainEqual({
            message: 'ra.notification.http_error',
            type: 'error',
            notificationOptions: { messageArgs: { _: undefined } },
        });
    });

    it('should trigger a notification even in case of a validation error in undoable mode', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () =>
                Promise.reject({ body: { errors: { foo: 'invalid' } } }),
        } as unknown as DataProvider;

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
                <EditController {...defaultProps} mutationMode="undoable">
                    {({ save }) => {
                        saveCallback = save;
                        return <Confirm />;
                    }}
                </EditController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await new Promise(resolve => setTimeout(resolve, 10));
        screen.getByLabelText('confirm').click();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(notificationsSpy).toContainEqual({
            message: 'ra.notification.http_error',
            type: 'error',
            notificationOptions: { messageArgs: { _: undefined } },
        });
    });

    it('should allow the save onError option to override the failure side effects override', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: () => Promise.reject({ message: 'not good' }),
        } as unknown as DataProvider;
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
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown as DataProvider;
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
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update,
        } as unknown as DataProvider;
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
        const middleware: Middleware<DataProvider['update']> = jest.fn(
            (resource, params, next) => {
                return next(resource, {
                    ...params,
                    meta: { addedByMiddleware: true },
                });
            }
        );

        const Child = () => {
            useRegisterMutationMiddleware<DataProvider['update']>(middleware);
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
            expect.any(Function)
        );
    });

    it('should return errors from the update call in pessimistic mode', async () => {
        let post = { id: 12 };
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const update = jest.fn().mockImplementationOnce(() => {
            return Promise.reject({ body: { errors: { foo: 'invalid' } } });
        });
        const dataProvider = {
            getOne: () => Promise.resolve({ data: post }),
            update,
        } as unknown as DataProvider;
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
        await screen.findByText('{"id":12}');
        let errors;
        await act(async () => {
            errors = await saveCallback({ foo: 'bar' });
        });
        expect(errors).toEqual({ foo: 'invalid' });
        screen.getByText('{"id":12}');
        expect(update).toHaveBeenCalledWith('posts', {
            id: 12,
            data: { foo: 'bar' },
            previousData: { id: 12 },
        });
    });

    it('should allow custom redirect with warnWhenUnsavedChanges in pessimistic mode', async () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 123 } } as any),
            update: (_, { id, data }) =>
                new Promise(resolve =>
                    setTimeout(
                        () => resolve({ data: { id, ...data } } as any),
                        300
                    )
                ),
        });
        const Input = (props: InputProps) => {
            const name = props.source;
            const { field } = useInput(props);
            return (
                <>
                    <label htmlFor={name}>{name}</label>
                    <input id={name} type="text" {...field} />
                </>
            );
        };
        const EditView = () => {
            const controllerProps = useEditController({
                ...defaultProps,
                id: 123,
                redirect: 'show',
                mutationMode: 'pessimistic',
            });
            return (
                <EditContextProvider value={controllerProps}>
                    <Form warnWhenUnsavedChanges>
                        <>
                            <div>Edit</div>
                            <Input source="foo" />
                            <input type="submit" value="Submit" />
                        </>
                    </Form>
                </EditContextProvider>
            );
        };
        const ShowView = () => <div>Show</div>;
        render(
            <TestMemoryRouter initialEntries={['/posts/123']}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route path="/posts/123" element={<EditView />} />
                        <Route path="/posts/123/show" element={<ShowView />} />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await screen.findByText('Edit');
        fireEvent.change(await screen.findByLabelText('foo'), {
            target: { value: 'bar' },
        });
        fireEvent.click(screen.getByText('Submit'));
        expect(await screen.findByText('Show')).not.toBeNull();
    });

    describe('security', () => {
        it('should not call the dataProvider until the authentication check passes', async () => {
            let resolveAuthCheck: () => void;
            const authProvider: AuthProvider = {
                checkAuth: jest.fn(
                    () =>
                        new Promise(resolve => {
                            resolveAuthCheck = resolve;
                        })
                ),
                login: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                getPermissions: () => Promise.resolve(),
            };
            const dataProvider = testDataProvider({
                // @ts-ignore
                getOne: jest.fn(() =>
                    Promise.resolve({
                        data: { id: 1, title: 'A post', votes: 0 },
                    })
                ),
            });

            render(
                <Authenticated
                    authProvider={authProvider}
                    dataProvider={dataProvider}
                />
            );
            await waitFor(() => {
                expect(authProvider.checkAuth).toHaveBeenCalled();
            });
            expect(dataProvider.getOne).not.toHaveBeenCalled();
            resolveAuthCheck!();
            await screen.findByText('A post - 0 votes');
        });

        it('should redirect to the /access-denied page when users do not have access', async () => {
            render(<CanAccess />);
            await screen.findByText('List');
            fireEvent.click(await screen.findByText('posts.edit access'));
            fireEvent.click(await screen.findByText('Edit'));
            await screen.findByText('Loading...');
            await screen.findByText('Access denied');
        });

        it('should display the edit view when users have access', async () => {
            render(<CanAccess />);
            await screen.findByText('List');
            fireEvent.click(await screen.findByText('Edit'));
            await screen.findByText('Loading...');
            await screen.findByText('Post #1 - 90 votes');
        });

        it('should call the dataProvider if disableAuthentication is true', async () => {
            const authProvider: AuthProvider = {
                checkAuth: jest.fn(),
                login: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                getPermissions: () => Promise.resolve(),
            };
            const dataProvider = testDataProvider({
                // @ts-ignore
                getOne: jest.fn(() =>
                    Promise.resolve({
                        data: { id: 1, title: 'A post', votes: 0 },
                    })
                ),
            });

            render(
                <DisableAuthentication
                    authProvider={authProvider}
                    dataProvider={dataProvider}
                />
            );
            await screen.findByText('A post - 0 votes');
            expect(dataProvider.getOne).toHaveBeenCalled();
            expect(authProvider.checkAuth).not.toHaveBeenCalled();
        });
    });
});
