import * as React from 'react';
import expect from 'expect';
import { waitFor, fireEvent, act } from '@testing-library/react';
import { DataProviderContext, undoableEventEmitter } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { Edit } from './Edit';

describe('<Edit />', () => {
    const defaultEditProps = {
        basePath: '',
        id: '123',
        resource: 'foo',
        location: {},
        match: {},
    };

    it('should call dataProvider.getOne() and pass the result to its child as record', async () => {
        const dataProvider = {
            getOne: () =>
                Promise.resolve({ data: { id: 123, title: 'lorem' } }),
        };
        const FakeForm = ({ record }) => <>{record.title}</>;
        const { queryAllByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Edit {...defaultEditProps}>
                    <FakeForm />
                </Edit>
            </DataProviderContext.Provider>,
            { admin: { resources: { foo: { data: {} } } } }
        );
        await waitFor(() => {
            expect(queryAllByText('lorem')).toHaveLength(1);
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
        };
        const FakeForm = ({ record, save }) => (
            <>
                <span>{record.title}</span>
                <button onClick={() => save({ ...record, title: 'ipsum' })}>
                    Update
                </button>
            </>
        );

        const { queryAllByText, getByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Edit {...defaultEditProps} id="1234" undoable={false}>
                    <FakeForm />
                </Edit>
            </DataProviderContext.Provider>,
            { admin: { resources: { foo: { data: {} } } } }
        );
        await waitFor(() => {
            expect(queryAllByText('lorem')).toHaveLength(1);
        });
        fireEvent.click(getByText('Update'));
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
            const update = jest
                .fn()
                .mockImplementationOnce((_, { data }) =>
                    Promise.resolve({ data })
                );
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 1234, title: 'lorem' } }),
                update,
            };
            const onSuccess = jest.fn();
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button onClick={() => save({ ...record, title: 'ipsum' })}>
                        Update
                    </button>
                </>
            );

            const { queryByText, getByText, findByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit {...defaultEditProps} id="1234" onSuccess={onSuccess}>
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await findByText('lorem');
            fireEvent.click(getByText('Update'));
            // waitFor for the next tick
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve));
            });
            // changes applied locally
            expect(queryByText('ipsum')).not.toBeNull();
            // side effects called right away
            expect(onSuccess).toHaveBeenCalledTimes(1);
            // dataProvider not called
            expect(update).toHaveBeenCalledTimes(0);
            act(() => {
                undoableEventEmitter.emit('end', {});
            });
            // dataProvider called
            expect(update).toHaveBeenCalledTimes(1);
        });

        it('should accept optimistic mode', async () => {
            const update = jest
                .fn()
                .mockImplementationOnce((_, { data }) =>
                    Promise.resolve({ data })
                );
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 1234, title: 'lorem' } }),
                update,
            };
            const onSuccess = jest.fn();
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button onClick={() => save({ ...record, title: 'ipsum' })}>
                        Update
                    </button>
                </>
            );

            const { queryByText, getByText, findByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        id="1234"
                        mutationMode="optimistic"
                        onSuccess={onSuccess}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await findByText('lorem');
            fireEvent.click(getByText('Update'));
            // waitFor for the next tick
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve));
            });
            // changes applied locally
            expect(queryByText('ipsum')).not.toBeNull();
            // side effects called right away
            expect(onSuccess).toHaveBeenCalledTimes(1);
            // dataProvider called
            expect(update).toHaveBeenCalledTimes(1);
        });

        it('should accept pessimistic mode', async () => {
            let resolveUpdate;
            const update = jest.fn().mockImplementationOnce((_, { data }) =>
                new Promise(resolve => {
                    resolveUpdate = resolve;
                }).then(() => ({ data }))
            );
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({ data: { id: 1234, title: 'lorem' } }),
                update,
            };
            const onSuccess = jest.fn();
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button onClick={() => save({ ...record, title: 'ipsum' })}>
                        Update
                    </button>
                </>
            );

            const { queryByText, getByText, findByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        id="1234"
                        mutationMode="pessimistic"
                        onSuccess={onSuccess}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await findByText('lorem');
            fireEvent.click(getByText('Update'));
            // waitFor for the next tick
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve));
            });
            // changes not applied locally
            expect(queryByText('ipsum')).toBeNull();
            // side effects not called right away
            expect(onSuccess).toHaveBeenCalledTimes(0);
            // dataProvider called
            expect(update).toHaveBeenCalledTimes(1);
            act(() => {
                resolveUpdate();
            });
            // changes applied locally
            await findByText('ipsum');
            // side effects applied
            expect(onSuccess).toHaveBeenCalledTimes(1);
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
            };
            const onSuccess = jest.fn();
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button onClick={() => save({ ...record, title: 'ipsum' })}>
                        Update
                    </button>
                </>
            );
            const { queryAllByText, getByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        onSuccess={onSuccess}
                        undoable={false}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(onSuccess).toHaveBeenCalledWith({
                    data: { id: 123, title: 'ipsum' },
                });
            });
        });

        it('should be overridden by onSuccess save option', async () => {
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update: (_, { data }) => Promise.resolve({ data }),
            };
            const onSuccess = jest.fn();
            const onSuccessSave = jest.fn();
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button
                        onClick={() =>
                            save({ ...record, title: 'ipsum' }, undefined, {
                                onSuccess: onSuccessSave,
                            })
                        }
                    >
                        Update
                    </button>
                </>
            );
            const { queryAllByText, getByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        onSuccess={onSuccess}
                        undoable={false}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(onSuccessSave).toHaveBeenCalledWith({
                    data: { id: 123, title: 'ipsum' },
                });
                expect(onSuccess).not.toHaveBeenCalled();
            });
        });
    });

    describe('onFailure prop', () => {
        it('should allow to override the default error side effects', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update: () => Promise.reject({ message: 'not good' }),
            };
            const onFailure = jest.fn();
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button onClick={() => save({ ...record, title: 'ipsum' })}>
                        Update
                    </button>
                </>
            );
            const { queryAllByText, getByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        onFailure={onFailure}
                        undoable={false}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(onFailure).toHaveBeenCalledWith({ message: 'not good' });
            });
        });

        it('should be overridden by onFailure save option', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const dataProvider = {
                getOne: () =>
                    Promise.resolve({
                        data: { id: 123, title: 'lorem' },
                    }),
                update: () => Promise.reject({ message: 'not good' }),
            };
            const onFailure = jest.fn();
            const onFailureSave = jest.fn();
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button
                        onClick={() =>
                            save({ ...record, title: 'ipsum' }, undefined, {
                                onFailure: onFailureSave,
                            })
                        }
                    >
                        Update
                    </button>
                </>
            );
            const { queryAllByText, getByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        onFailure={onFailure}
                        undoable={false}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(onFailureSave).toHaveBeenCalledWith({
                    message: 'not good',
                });
                expect(onFailure).not.toHaveBeenCalled();
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
            };
            const transform = jest.fn().mockImplementationOnce(data => ({
                ...data,
                transformed: true,
            }));
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button onClick={() => save({ ...record, title: 'ipsum' })}>
                        Update
                    </button>
                </>
            );
            const { queryAllByText, getByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        transform={transform}
                        undoable={false}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(transform).toHaveBeenCalledWith({
                    id: 123,
                    title: 'ipsum',
                });
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
            };
            const transform = jest.fn();
            const transformSave = jest.fn().mockImplementationOnce(data => ({
                ...data,
                transformed: true,
            }));
            const FakeForm = ({ record, save }) => (
                <>
                    <span>{record.title}</span>
                    <button
                        onClick={() =>
                            save({ ...record, title: 'ipsum' }, undefined, {
                                transform: transformSave,
                            })
                        }
                    >
                        Update
                    </button>
                </>
            );
            const { queryAllByText, getByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit
                        {...defaultEditProps}
                        transform={transform}
                        undoable={false}
                    >
                        <FakeForm />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            await waitFor(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await waitFor(() => {
                expect(transform).not.toHaveBeenCalled();
                expect(transformSave).toHaveBeenCalledWith({
                    id: 123,
                    title: 'ipsum',
                });
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
            };
            const Dummy = () => <div />;
            const { queryAllByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <Edit {...defaultEditProps} aside={<Aside />}>
                        <Dummy />
                    </Edit>
                </DataProviderContext.Provider>,
                { admin: { resources: { foo: { data: {} } } } }
            );
            expect(queryAllByText('Hello')).toHaveLength(1);
        });
    });
});
