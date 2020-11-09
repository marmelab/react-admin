import * as React from 'react';
import expect from 'expect';
import { cleanup, wait, fireEvent } from '@testing-library/react';
import { renderWithRedux, DataProviderContext } from 'ra-core';

import { Edit } from './Edit';

describe('<Edit />', () => {
    afterEach(cleanup);

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
        await wait(() => {
            expect(queryAllByText('lorem')).toHaveLength(1);
        });
    });

    it('should call dataProvider.update() when the child calls the save callback', async () => {
        const update = jest
            .fn()
            .mockImplementationOnce((_, { data }) => Promise.resolve({ data }));
        const dataProvider = {
            getOne: () =>
                Promise.resolve({
                    data: { id: 123, title: 'lorem' },
                }),
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
                <Edit {...defaultEditProps} undoable={false}>
                    <FakeForm />
                </Edit>
            </DataProviderContext.Provider>,
            { admin: { resources: { foo: { data: {} } } } }
        );
        await wait(() => {
            expect(queryAllByText('lorem')).toHaveLength(1);
        });
        fireEvent.click(getByText('Update'));
        await wait(() => {
            expect(update).toHaveBeenCalledWith('foo', {
                id: '123',
                data: { id: 123, title: 'ipsum' },
                previousData: { id: 123, title: 'lorem' },
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
            await wait(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await wait(() => {
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
            await wait(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await wait(() => {
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
            await wait(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await wait(() => {
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
            await wait(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await wait(() => {
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
            await wait(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await wait(() => {
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
            await wait(() => {
                expect(queryAllByText('lorem')).toHaveLength(1);
            });
            fireEvent.click(getByText('Update'));
            await wait(() => {
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
