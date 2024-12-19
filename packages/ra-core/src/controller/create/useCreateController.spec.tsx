import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import expect from 'expect';
import React from 'react';
import { Location, Route, Routes } from 'react-router-dom';

import {
    CreateContextProvider,
    DataProvider,
    Form,
    InputProps,
    useCreateController,
    useInput,
} from '../..';
import { CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { useNotificationContext } from '../../notification';
import {
    Middleware,
    SaveContextProvider,
    useRegisterMutationMiddleware,
} from '../saveContext';
import { CreateController } from './CreateController';
import { getRecordFromLocation } from './useCreateController';

import { TestMemoryRouter } from '../../routing';
import { CanAccess } from './useCreateController.security.stories';

describe('useCreateController', () => {
    describe('getRecordFromLocation', () => {
        const location: Location = {
            key: 'a_key',
            pathname: '/foo',
            search: '',
            state: undefined,
            hash: '',
        };

        it('should return location state record when set', () => {
            expect(
                getRecordFromLocation({
                    ...location,
                    state: { record: { foo: 'bar' } },
                })
            ).toEqual({ foo: 'bar' });
        });

        it('should return location search when set', () => {
            expect(
                getRecordFromLocation({
                    ...location,
                    search: '?source={"foo":"baz","array":["1","2"]}',
                })
            ).toEqual({ foo: 'baz', array: ['1', '2'] });
        });

        it('should return location state record when both state and search are set', () => {
            expect(
                getRecordFromLocation({
                    ...location,
                    state: { record: { foo: 'bar' } },
                    search: '?foo=baz',
                })
            ).toEqual({ foo: 'bar' });
        });
    });

    const defaultProps = {
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        resource: 'posts',
        debounce: 200,
    };

    it('should call the dataProvider.create() function on save', async () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create: jest
                .fn()
                .mockImplementationOnce((_, { data }) =>
                    Promise.resolve({ data: { id: 123, ...data } })
                ),
        });
        let saveCallback;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(dataProvider.create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar' },
        });
    });

    it('should execute default success side effects on success', async () => {
        let saveCallback;
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            // @ts-ignore
            create: (_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } }),
        });

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
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(notificationsSpy).toEqual([
            {
                message: 'resources.posts.notifications.created',
                type: 'info',
                notificationOptions: {
                    messageArgs: {
                        smart_count: 1,
                        _: 'ra.notification.created',
                    },
                },
            },
        ]);
    });

    it('should execute default failure side effects on failure', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create: () => Promise.reject({ message: 'not good' }),
        });

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
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
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
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create: () => Promise.reject({}),
        });

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
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
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
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create: () =>
                Promise.reject({ body: { errors: { foo: 'invalid' } } }),
        });

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
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(notificationsSpy).toEqual([]);
    });

    it('should allow mutationOptions to override the default success side effects', async () => {
        let saveCallback;
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            // @ts-ignore
            create: (_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } }),
        });
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
                <CreateController
                    {...defaultProps}
                    mutationOptions={{ onSuccess }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(notificationsSpy).toEqual([]);
    });

    it('should allow the save onSuccess option to override the success side effects override', async () => {
        let saveCallback;
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            // @ts-ignore
            create: (_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } }),
        });
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
                <CreateController
                    {...defaultProps}
                    mutationOptions={{ onSuccess }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
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
        expect(onSuccessSave).toHaveBeenCalled();
        expect(notificationsSpy).toEqual([]);
    });

    it('should allow mutationOptions to override the default failure side effects', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create: () => Promise.reject({ message: 'not good' }),
        });
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
                <CreateController
                    {...defaultProps}
                    mutationOptions={{ onError }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(notificationsSpy).toEqual([]);
    });

    it('should accept meta in mutationOptions', async () => {
        let saveCallback;
        const create = jest
            .fn()
            .mockImplementationOnce((_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } })
            );
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create,
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateController
                    {...defaultProps}
                    mutationOptions={{ meta: { lorem: 'ipsum' } }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));
        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar' },
            meta: { lorem: 'ipsum' },
        });
    });

    it('should accept meta as a save option', async () => {
        let saveCallback;
        const create = jest
            .fn()
            .mockImplementationOnce((_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } })
            );
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create,
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () =>
            saveCallback({ foo: 'bar' }, { meta: { lorem: 'ipsum' } })
        );
        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar' },
            meta: { lorem: 'ipsum' },
        });
    });

    it('should allow the save onError option to override the failure side effects override', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        let saveCallback;
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create: () => Promise.reject({ message: 'not good' }),
        });
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
                <CreateController
                    {...defaultProps}
                    mutationOptions={{ onError }}
                >
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
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

    it('should allow transform to transform the data before calling create', async () => {
        let saveCallback;
        const create = jest
            .fn()
            .mockImplementationOnce((_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } })
            );
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create,
        });
        const transform = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateController {...defaultProps} transform={transform}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
            </CoreAdminContext>
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
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            create,
        });
        const transform = jest.fn();
        const transformSave = jest.fn().mockImplementationOnce(data => ({
            ...data,
            transformed: true,
        }));
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateController {...defaultProps} transform={transform}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </CreateController>
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
        expect(transformSave).toHaveBeenCalledWith({ foo: 'bar' });
        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar', transformed: true },
        });
    });

    it('should allow to register middlewares', async () => {
        let saveCallback;
        const create = jest
            .fn()
            .mockImplementationOnce((_, { data }) =>
                Promise.resolve({ data: { id: 123, ...data } })
            );
        const dataProvider = testDataProvider({
            create,
        });
        const middleware: Middleware<DataProvider['create']> = jest.fn(
            (resource, params, next) => {
                return next(resource, {
                    ...params,
                    meta: { addedByMiddleware: true },
                });
            }
        );

        const Child = () => {
            useRegisterMutationMiddleware<DataProvider['create']>(middleware);
            return null;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateController {...defaultProps}>
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
                </CreateController>
            </CoreAdminContext>
        );
        await act(async () => saveCallback({ foo: 'bar' }));

        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar' },
            meta: { addedByMiddleware: true },
        });
        expect(middleware).toHaveBeenCalledWith(
            'posts',
            {
                data: { foo: 'bar' },
            },
            expect.any(Function)
        );
    });

    it('should return errors from the create call', async () => {
        const create = jest.fn().mockImplementationOnce(() => {
            return Promise.reject({ body: { errors: { foo: 'invalid' } } });
        });
        const dataProvider = {
            create,
        } as unknown as DataProvider;
        let saveCallback;
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateController {...defaultProps}>
                    {({ save }) => {
                        saveCallback = save;
                        return <div />;
                    }}
                </CreateController>
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        let errors;
        await act(async () => {
            errors = await saveCallback({ foo: 'bar' });
        });
        expect(errors).toEqual({ foo: 'invalid' });
        expect(create).toHaveBeenCalledWith('posts', {
            data: { foo: 'bar' },
        });
    });

    it('should allow custom redirect with warnWhenUnsavedChanges', async () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 123 } } as any),
            create: (_, { data }) =>
                new Promise(resolve =>
                    setTimeout(
                        // @ts-ignore
                        () => resolve({ data: { id: 123, ...data } }),
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
        const CreateView = () => {
            const controllerProps = useCreateController({
                ...defaultProps,
                redirect: 'show',
            });
            return (
                <CreateContextProvider value={controllerProps}>
                    <Form warnWhenUnsavedChanges>
                        <>
                            <div>Create</div>
                            <Input source="foo" />
                            <input type="submit" value="Submit" />
                        </>
                    </Form>
                </CreateContextProvider>
            );
        };
        const ShowView = () => <div>Show</div>;
        render(
            <TestMemoryRouter initialEntries={['/posts/create']}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route path="/posts/create" element={<CreateView />} />
                        <Route path="/posts/123/show" element={<ShowView />} />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await screen.findByText('Create');
        fireEvent.change(screen.getByLabelText('foo'), {
            target: { value: 'bar' },
        });
        fireEvent.click(screen.getByText('Submit'));
        expect(await screen.findByText('Show')).not.toBeNull();
    });

    describe('Security', () => {
        it('should redirect to the /access-denied page when users do not have access', async () => {
            render(<CanAccess />);
            await screen.findByText('List');
            fireEvent.click(await screen.findByText('posts.create access'));
            fireEvent.click(await screen.findByText('Create'));
            await screen.findByText('Loading...');
            await screen.findByText('Access denied');
        });

        it('should display the create view when users have access', async () => {
            render(<CanAccess />);
            await screen.findByText('List');
            fireEvent.click(await screen.findByText('Create'));
            await screen.findByText('Loading...');
            await screen.findByText('Create view');
        });
    });
});
