import * as React from 'react';
import expect from 'expect';
import {
    render,
    screen,
    waitFor,
    fireEvent,
    act,
} from '@testing-library/react';
import {
    CoreAdminContext,
    undoableEventEmitter,
    useRecordContext,
    useSaveContext,
    useEditContext,
    ResourceDefinitionContextProvider,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Edit } from './Edit';

describe('<Edit />', () => {
    const defaultEditProps = {
        id: '123',
        resource: 'foo',
    };

    it('should call dataProvider.getOne() and pass the result to its child as record', async () => {
        const dataProvider = {
            getOne: () =>
                Promise.resolve({ data: { id: 123, title: 'lorem' } }),
        } as any;
        const FakeForm = () => {
            const record = useRecordContext();
            return <>{record.title}</>;
        };
        render(
            <AdminContext dataProvider={dataProvider}>
                <Edit {...defaultEditProps}>
                    <FakeForm />
                </Edit>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryAllByText('lorem')).toHaveLength(1);
        });
    });

    it('should call dataProvider.update() when the child calls the save callback', async () => {
        const update = jest
            .fn()
            .mockImplementationOnce((_, { data }) => Promise.resolve({ data }));
        const dataProvider = {
            getOne: () =>
                Promise.resolve({ data: { id: 1234, title: 'lorem' } }),
            update,
        } as any;
        const FakeForm = () => {
            const record = useRecordContext();
            const { save } = useSaveContext();
            return (
                <>
                    <span>{record.title}</span>
                    <button
                        onClick={() =>
                            save && save({ ...record, title: 'ipsum' })
                        }
                    >
                        Update
                    </button>
                </>
            );
        };

        render(
            <AdminContext dataProvider={dataProvider}>
                <Edit
                    {...defaultEditProps}
                    id="1234"
                    mutationMode="pessimistic"
                >
                    <FakeForm />
                </Edit>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryAllByText('lorem')).toHaveLength(1);
        });
        fireEvent.click(screen.getByText('Update'));
        await waitFor(() => {
            expect(update).toHaveBeenCalledWith('foo', {
                id: '1234',
                data: { id: 1234, title: 'ipsum' },
                previousData: { id: 1234, title: 'lorem' },
            });
        });
    });

    describe('mutationMode prop', () => {
        it('should be undoable by default', async () => {
            let post = { id: 1234, title: 'lorem' };
            const update = jest.fn().mockImplementationOnce((_, { data }) => {
                post = data;
                return Promise.resolve({ data });
            });
            const dataProvider = {
                getOne: () => Promise.resolve({ data: post }),
                update,
            } as any;
            const onSuccess = jest.fn();
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();

                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save && save({ ...record, title: 'ipsum' })
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        id="1234"
                        mutationOptions={{ onSuccess }}
                    >
                        <FakeForm />
                    </Edit>
                </CoreAdminContext>
            );
            await screen.findByText('lorem');
            screen.getByText('Update').click();
            await waitFor(() => {
                // changes applied locally
                expect(screen.queryByText('ipsum')).not.toBeNull();
                // side effects called right away
                expect(onSuccess).toHaveBeenCalledTimes(1);
                // dataProvider not called
                expect(update).toHaveBeenCalledTimes(0);
            });
            act(() => {
                undoableEventEmitter.emit('end', {});
            });
            await waitFor(() =>
                // dataProvider called
                expect(update).toHaveBeenCalledTimes(1)
            );
        });

        it('should accept optimistic mode', async () => {
            let post = { id: 1234, title: 'lorem' };
            const update = jest.fn().mockImplementationOnce((_, { data }) => {
                post = data;
                return Promise.resolve({ data });
            });
            const dataProvider = {
                getOne: () => Promise.resolve({ data: post }),
                update,
            } as any;
            const onSuccess = jest.fn();
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save && save({ ...record, title: 'ipsum' })
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        id="1234"
                        mutationMode="optimistic"
                        mutationOptions={{ onSuccess }}
                    >
                        <FakeForm />
                    </Edit>
                </CoreAdminContext>
            );
            await screen.findByText('lorem');
            screen.getByText('Update').click();
            await waitFor(() => {
                // changes applied locally
                expect(screen.queryByText('ipsum')).not.toBeNull();
                // side effects called right away
                expect(onSuccess).toHaveBeenCalledTimes(1);
                // dataProvider called
                expect(update).toHaveBeenCalledTimes(1);
            });
        });

        it('should accept pessimistic mode', async () => {
            let post = { id: 1234, title: 'lorem' };
            let resolveUpdate;
            const update = jest.fn().mockImplementationOnce((_, { data }) =>
                new Promise(resolve => {
                    resolveUpdate = resolve;
                    post = data;
                }).then(() => ({ data }))
            );
            const dataProvider = {
                getOne: () => Promise.resolve({ data: post }),
                update,
            } as any;
            const onSuccess = jest.fn();
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();

                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save && save({ ...record, title: 'ipsum' })
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        id="1234"
                        mutationMode="pessimistic"
                        mutationOptions={{ onSuccess }}
                    >
                        <FakeForm />
                    </Edit>
                </CoreAdminContext>
            );
            await screen.findByText('lorem');
            screen.getByText('Update').click();
            await waitFor(() => {
                // changes not applied locally
                expect(screen.queryByText('ipsum')).toBeNull();
                // side effects not called right away
                expect(onSuccess).toHaveBeenCalledTimes(0);
                // dataProvider called
                expect(update).toHaveBeenCalledTimes(1);
            });
            act(() => {
                resolveUpdate();
            });
            await waitFor(() => {
                // changes applied locally
                expect(screen.queryByText('ipsum')).not.toBeNull();
                // side effects applied
                expect(onSuccess).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('onSuccess prop', () => {
        it('should allow to override the default success side effects', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update: (_, { data }) => Promise.resolve({ data }),
            } as any;
            const onSuccess = jest.fn();
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save && save({ ...record, title: 'ipsum' })
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        mutationMode="pessimistic"
                        mutationOptions={{ onSuccess }}
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(screen.queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(screen.getByText('Update'));
            await waitFor(() => {
                expect(onSuccess).toHaveBeenCalledWith(
                    {
                        id: 123,
                        title: 'ipsum',
                    },
                    {
                        id: '123',
                        data: { id: 123, title: 'ipsum' },
                        resource: 'foo',
                    },
                    { snapshot: [] }
                );
            });
        });

        it('should be overridden by onSuccess save option', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update: (_, { data }) => Promise.resolve({ data }),
            } as any;
            const onSuccess = jest.fn();
            const onSuccessSave = jest.fn();
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save &&
                                save(
                                    { ...record, title: 'ipsum' },
                                    {
                                        onSuccess: onSuccessSave,
                                    }
                                )
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        mutationMode="pessimistic"
                        mutationOptions={{ onSuccess }}
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(screen.queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(screen.getByText('Update'));
            await waitFor(() => {
                expect(onSuccessSave).toHaveBeenCalledWith(
                    {
                        id: 123,
                        title: 'ipsum',
                    },
                    {
                        id: '123',
                        data: { id: 123, title: 'ipsum' },
                        resource: 'foo',
                    },
                    { snapshot: [] }
                );
                expect(onSuccess).not.toHaveBeenCalled();
            });
        });
    });

    describe('onError prop', () => {
        it('should allow to override the default error side effects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update: () => Promise.reject({ message: 'not good' }),
            } as any;
            const onError = jest.fn();
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save && save({ ...record, title: 'ipsum' })
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        mutationMode="pessimistic"
                        mutationOptions={{ onError }}
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(screen.queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(screen.getByText('Update'));
            await waitFor(() => {
                expect(onError).toHaveBeenCalledWith(
                    { message: 'not good' },
                    {
                        id: '123',
                        data: { id: 123, title: 'ipsum' },
                        resource: 'foo',
                    },
                    { snapshot: [] }
                );
            });
        });

        it('should be overridden by onError save option', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update: () => Promise.reject({ message: 'not good' }),
            } as any;
            const onError = jest.fn();
            const onErrorSave = jest.fn();
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save &&
                                save(
                                    { ...record, title: 'ipsum' },
                                    {
                                        onError: onErrorSave,
                                    }
                                )
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        mutationMode="pessimistic"
                        mutationOptions={{ onError }}
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(screen.queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(screen.getByText('Update'));
            await waitFor(() => {
                expect(onErrorSave).toHaveBeenCalledWith(
                    {
                        message: 'not good',
                    },
                    {
                        id: '123',
                        data: { id: 123, title: 'ipsum' },
                        resource: 'foo',
                    },
                    { snapshot: [] }
                );
                expect(onError).not.toHaveBeenCalled();
            });
        });
    });

    describe('transform prop', () => {
        it('should allow to transform the data before calling update', async () => {
            const update = jest
                .fn()
                .mockImplementationOnce((_, { data }) =>
                    Promise.resolve({ data })
                );
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update,
            } as any;
            const transform = jest.fn().mockImplementationOnce(data => ({
                ...data,
                transformed: true,
            }));
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save && save({ ...record, title: 'ipsum' })
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        transform={transform}
                        mutationMode="pessimistic"
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(screen.queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(screen.getByText('Update'));
            await waitFor(() => {
                expect(transform).toHaveBeenCalledWith(
                    {
                        id: 123,
                        title: 'ipsum',
                    },
                    { previousData: { id: 123, title: 'lorem' } }
                );

                expect(update).toHaveBeenCalledWith('foo', {
                    id: '123',
                    data: { id: 123, title: 'ipsum', transformed: true },
                    previousData: { id: 123, title: 'lorem' },
                });
            });
        });

        it('should be overridden by transform save option', async () => {
            const update = jest
                .fn()
                .mockImplementationOnce((_, { data }) =>
                    Promise.resolve({ data })
                );
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update,
            } as any;
            const transform = jest.fn();
            const transformSave = jest.fn().mockImplementationOnce(data => ({
                ...data,
                transformed: true,
            }));
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save &&
                                save(
                                    { ...record, title: 'ipsum' },
                                    {
                                        transform: transformSave,
                                    }
                                )
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        transform={transform}
                        mutationMode="pessimistic"
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(screen.queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(screen.getByText('Update'));
            await waitFor(() => {
                expect(transform).not.toHaveBeenCalled();
                expect(transformSave).toHaveBeenCalledWith(
                    {
                        id: 123,
                        title: 'ipsum',
                    },
                    { previousData: { id: 123, title: 'lorem' } }
                );
                expect(update).toHaveBeenCalledWith('foo', {
                    id: '123',
                    data: { id: 123, title: 'ipsum', transformed: true },
                    previousData: { id: 123, title: 'lorem' },
                });
            });
        });
        it('should be passed previousData via argument on transform called', async () => {
            const update = jest
                .fn()
                .mockImplementationOnce((_, { data }) =>
                    Promise.resolve({ data })
                );
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update,
            } as any;
            const transform = jest.fn().mockImplementationOnce(data => ({
                ...data,
                transformed: true,
            }));
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save && save({ ...record, title: 'ipsum' })
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            const { queryAllByText, getByText } = render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        transform={transform}
                        mutationMode="pessimistic"
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(transform).toHaveBeenCalledWith(
                    {
                        id: 123,
                        title: 'ipsum',
                    },
                    { previousData: { id: 123, title: 'lorem' } }
                );

                expect(update).toHaveBeenCalledWith('foo', {
                    id: '123',
                    data: { id: 123, title: 'ipsum', transformed: true },
                    previousData: { id: 123, title: 'lorem' },
                });
            });
        });
        it('should be passed previousData via argument on transformSave called', async () => {
            const update = jest
                .fn()
                .mockImplementationOnce((_, { data }) =>
                    Promise.resolve({ data })
                );
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update,
            } as any;
            const transform = jest.fn();
            const transformSave = jest.fn().mockImplementationOnce(data => ({
                ...data,
                transformed: true,
            }));
            const FakeForm = () => {
                const record = useRecordContext();
                const { save } = useSaveContext();
                return (
                    <>
                        <span>{record.title}</span>
                        <button
                            onClick={() =>
                                save &&
                                save(
                                    { ...record, title: 'ipsum' },
                                    {
                                        transform: transformSave,
                                    }
                                )
                            }
                        >
                            Update
                        </button>
                    </>
                );
            };
            const { queryAllByText, getByText } = render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        transform={transform}
                        mutationMode="pessimistic"
                    >
                        <FakeForm />
                    </Edit>
                </AdminContext>
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(transform).not.toHaveBeenCalled();
                expect(transformSave).toHaveBeenCalledWith(
                    {
                        id: 123,
                        title: 'ipsum',
                    },
                    { previousData: { id: 123, title: 'lorem' } }
                );
                expect(update).toHaveBeenCalledWith('foo', {
                    id: '123',
                    data: { id: 123, title: 'ipsum', transformed: true },
                    previousData: { id: 123, title: 'lorem' },
                });
            });
        });
    });

    describe('aside prop', () => {
        it('should display aside component', () => {
            const Aside = () => <div id="aside">Hello</div>;
            const dataProvider = {
                getOne: () => Promise.resolve({ data: { id: 123 } }),
            } as any;
            const Dummy = () => <div />;
            render(
                <AdminContext dataProvider={dataProvider}>
                    <Edit {...defaultEditProps} aside={<Aside />}>
                        <Dummy />
                    </Edit>
                </AdminContext>
            );
            expect(screen.queryAllByText('Hello')).toHaveLength(1);
        });
    });

    describe('defaultTitle', () => {
        it('should use the record id by default', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: 'lorem' } }),
            } as any;
            const Title = () => {
                const { defaultTitle } = useEditContext();
                return <>{defaultTitle}</>;
            };
            const i18nProvider = polyglotI18nProvider(() => englishMessages);
            render(
                <AdminContext
                    dataProvider={dataProvider}
                    i18nProvider={i18nProvider}
                >
                    <Edit {...defaultEditProps}>
                        <Title />
                    </Edit>
                </AdminContext>
            );
            await screen.findByText('Foo #123');
        });
        it('should use the recordRepresentation when defined', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 123, title: 'lorem' } }),
            } as any;
            const Title = () => {
                const { defaultTitle } = useEditContext();
                return <>{defaultTitle}</>;
            };
            const i18nProvider = polyglotI18nProvider(() => englishMessages);
            render(
                <AdminContext
                    dataProvider={dataProvider}
                    i18nProvider={i18nProvider}
                >
                    <ResourceDefinitionContextProvider
                        definitions={{ foo: { recordRepresentation: 'title' } }}
                    >
                        <Edit {...defaultEditProps}>
                            <Title />
                        </Edit>
                    </ResourceDefinitionContextProvider>
                </AdminContext>
            );
            await screen.findByText('Foo lorem');
        });
    });
});
