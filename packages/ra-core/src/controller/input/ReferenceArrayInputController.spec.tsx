import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import { renderWithRedux } from 'ra-test';

import ReferenceArrayInputController, {
    ReferenceArrayInputControllerChildrenFuncParams,
} from './ReferenceArrayInputController';
import { CoreAdminContext, createAdminStore } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { CRUD_GET_MANY } from '../../actions';
import { SORT_ASC } from '../../reducer/admin/resource/list/queryReducer';

describe('<ReferenceArrayInputController />', () => {
    const defaultProps = {
        input: { value: undefined },
        record: undefined,
        reference: 'tags',
        basePath: '/posts',
        resource: 'posts',
        source: 'tag_ids',
    };

    it('should set loading to true as long as there are no references fetched and no selected references', () => {
        const children = jest.fn(({ loading }) => (
            <div>{loading.toString()}</div>
        ));
        const store = createAdminStore({
            initialState: { admin: { resources: { tags: { data: {} } } } },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        expect(screen.queryByText('true')).not.toBeNull();
    });

    it('should set loading to true as long as there are no references fetched and there are no data found for the references already selected', () => {
        const children = jest.fn(({ loading }) => (
            <div>{loading.toString()}</div>
        ));
        const store = createAdminStore({
            initialState: { admin: { resources: { tags: { data: {} } } } },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        expect(screen.queryByText('true')).not.toBeNull();
    });

    it('should set loading to false if the references are being searched but data from at least one selected reference was found', () => {
        const children = jest.fn(({ loading }) => (
            <div>{loading.toString()}</div>
        ));
        const store = createAdminStore({
            initialState: {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {},
                        },
                    },
                },
            },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        expect(screen.queryByText('false')).not.toBeNull();
    });

    it('should set error in case of references fetch error and there are no selected reference in the input value', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const children = jest.fn(({ error }) => <div>{error}</div>);

        const store = createAdminStore({
            initialState: { admin: { resources: { tags: { data: {} } } } },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                    })}
                >
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController {...defaultProps}>
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(
                screen.getByText('ra.input.references.all_missing')
            ).not.toBeNull();
        });
    });

    it('should set error in case of references fetch error and there are no data found for the references already selected', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const children = jest.fn(({ error }) => <div>{error}</div>);
        const store = createAdminStore({
            initialState: { admin: { resources: { tags: { data: {} } } } },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                    })}
                >
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [1] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => {
            expect(
                screen.queryByText('ra.input.references.all_missing')
            ).not.toBeNull();
        });
    });

    it.skip('should not display an error in case of references fetch error but data from at least one selected reference was found', async () => {
        const children = jest.fn(({ error }) => <div>{error}</div>);
        const store = createAdminStore({
            initialState: {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                },
            },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                    })}
                >
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
        expect(
            screen.queryByText('ra.input.references.all_missing')
        ).toBeNull();
    });

    it.skip('should set warning if references fetch fails but selected references are not empty', async () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <ReferenceArrayInputController
                        {...defaultProps}
                        // Avoid global collision in useGetMany with queriesToCall
                        basePath="/articles"
                        resource="articles"
                        input={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                )}
            />,
            {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                    references: {
                        possibleValues: {
                            'articles@tag_ids': { error: 'boom' },
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            expect(
                screen.queryByText('ra.input.references.many_missing')
            ).not.toBeNull();
        });
    });

    it('should set warning if references were found but selected references are not complete', async () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        const store = createAdminStore({
            initialState: {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                            },
                            list: {
                                total: 42,
                            },
                        },
                    },
                },
            },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                // Avoid global collision in useGetMany with queriesToCall
                                basePath="/products"
                                resource="products"
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => {
            expect(
                screen.queryByText('ra.input.references.many_missing')
            ).not.toBeNull();
        });
    });

    it('should set warning if references were found but selected references are empty', async () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: { 5: {}, 6: {} } } } },
            },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.resolve({ data: [], total: 0 }),
                    })}
                >
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                // Avoid global collision in useGetMany with queriesToCall
                                basePath="/posters"
                                resource="posters"
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => {
            expect(
                screen.queryByText('ra.input.references.many_missing')
            ).not.toBeNull();
        });
    });

    it('should not set warning if all references were found', async () => {
        const children = jest.fn(({ warning }) => <div>{warning}</div>);
        const store = createAdminStore({
            initialState: {
                admin: {
                    resources: {
                        tags: {
                            data: {
                                1: {
                                    id: 1,
                                },
                                2: {
                                    id: 2,
                                },
                            },
                        },
                    },
                },
            },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.resolve({ data: [], total: 0 }),
                    })}
                >
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => {
            expect(
                screen.queryByText('ra.input.references.many_missing')
            ).toBeNull();
        });
    });

    it('should call getList on mount with default fetch values', async () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            allowEmpty
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );
        expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
            pagination: {
                page: 1,
                perPage: 25,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: { q: '' },
        });
    });

    it('should allow to customize getList arguments with perPage, sort, and filter props', () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            sort={{ field: 'foo', order: 'ASC' }}
                            perPage={5}
                            filter={{ permanentFilter: 'foo' }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );
        expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
            pagination: {
                page: 1,
                perPage: 5,
            },
            sort: {
                field: 'foo',
                order: 'ASC',
            },
            filter: { permanentFilter: 'foo', q: '' },
        });
    });

    it('should call getList when setFilter is called', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));
        const dataProvider = testDataProvider({
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController {...defaultProps}>
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('Filter'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: 'bar' },
            });
        });
    });

    it('should use custom filterToQuery function prop', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));

        const dataProvider = testDataProvider({
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            filterToQuery={searchText => ({
                                foo: searchText,
                            })}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('Filter'));

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { foo: 'bar' },
            });
        });
    });

    it('should call crudGetMany on mount if value is set', async () => {
        const children = jest.fn(() => <div />);
        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: { 5: {}, 6: {} } } } },
            },
        });
        const dispatch = jest.spyOn(store, 'dispatch');
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5, 6] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [5, 6] },
            });
        });
    });

    it('should not call crudGetMany when calling setFilter', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));
        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: { 5: {} } } } },
            },
        });
        const dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('Filter'));

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(2);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });
    });

    it('should not call crudGetMany when props other than input are changed from outside', async () => {
        const children = jest.fn(() => <div />);
        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: { 5: {} } } } },
            },
        });
        const dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        const { rerender } = render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        rerender(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5] }}
                                filter={{ permanentFilter: 'bar' }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(2);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });

        rerender(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5] }}
                                filter={{ permanentFilter: 'bar' }}
                                sort={{ field: 'foo', order: 'ASC' }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(3);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });

        rerender(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5] }}
                                filter={{ permanentFilter: 'bar' }}
                                sort={{ field: 'foo', order: 'ASC' }}
                                perPage={42}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(4);
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });
    });

    it('should call crudGetMany when input value changes only with the additional input values', async () => {
        const children = jest.fn(() => <div />);
        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: {} } } },
            },
        });
        const dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        const { rerender } = render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [5] },
            });
        });
        rerender(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5, 6] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [6] },
            });
        });
    });

    it('should not call crudGetMany when already fetched input value changes', async () => {
        const children = jest.fn(() => <div />);
        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: { 5: {}, 6: {} } } } },
            },
        });
        const dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        const { rerender } = render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5, 6] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: CRUD_GET_MANY,
                meta: {
                    resource: 'tags',
                },
                payload: { ids: [5, 6] },
            });
        });
        rerender(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5, 6] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_GET_MANY
                ).length
            ).toEqual(1);
        });
    });

    it('should have props compatible with the ListContext', async () => {
        const children = ({
            setPage,
            setPerPage,
            setSortForList,
        }: ReferenceArrayInputControllerChildrenFuncParams): React.ReactElement => {
            const handleSetPage = () => {
                setPage(2);
            };
            const handleSetPerPage = () => {
                setPerPage(50);
            };
            const handleSetSort = () => {
                setSortForList('name', SORT_ASC);
            };

            return (
                <>
                    <button aria-label="setPage" onClick={handleSetPage} />
                    <button
                        aria-label="setPerPage"
                        onClick={handleSetPerPage}
                    />
                    <button aria-label="setSort" onClick={handleSetSort} />
                </>
            );
        };

        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: { 5: {}, 6: {} } } } },
            },
        });
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [5, 6] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('setPage'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 2,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: '' },
            });
        });

        fireEvent.click(screen.getByLabelText('setPerPage'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 2,
                    perPage: 50,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: '' },
            });
        });

        fireEvent.click(screen.getByLabelText('setSort'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 50,
                },
                sort: {
                    field: 'name',
                    order: 'ASC',
                },
                filter: { q: '' },
            });
        });
    });

    it('should call its children with the correct resource and basePath', () => {
        const children = jest.fn(() => null);
        const store = createAdminStore({
            initialState: {
                admin: { resources: { tags: { data: { 1: {}, 2: {} } } } },
            },
        });
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                input={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            </Provider>
        );

        expect(children.mock.calls[0][0].resource).toEqual('posts');
        expect(children.mock.calls[0][0].basePath).toEqual('/posts');
    });

    describe('enableGetChoices', () => {
        it('should not fetch possible values using getList on load but only when enableGetChoices returns true', async () => {
            const children = jest.fn().mockReturnValue(<div />);
            await new Promise(resolve => setTimeout(resolve, 100)); // empty the query deduplication in useQueryWithStore
            const enableGetChoices = jest.fn().mockImplementation(({ q }) => {
                return q ? q.length > 2 : false;
            });
            const store = createAdminStore({
                initialState: {
                    admin: { resources: { tags: { data: {} } } },
                },
            });
            const dataProvider = testDataProvider({
                getList: jest
                    .fn()
                    .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
            });
            render(
                <Provider store={store}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <Form
                            onSubmit={jest.fn()}
                            render={() => (
                                <ReferenceArrayInputController
                                    {...defaultProps}
                                    allowEmpty
                                    enableGetChoices={enableGetChoices}
                                >
                                    {children}
                                </ReferenceArrayInputController>
                            )}
                        />
                    </CoreAdminContext>
                </Provider>
            );

            // not call on start
            await waitFor(() => {
                expect(dataProvider.getList).not.toHaveBeenCalled();
            });
            expect(enableGetChoices).toHaveBeenCalledWith({ q: '' });

            const { setFilter } = children.mock.calls[0][0];
            setFilter('hello world');

            await waitFor(() => {
                expect(dataProvider.getList).toHaveBeenCalledTimes(1);
            });
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: 'hello world' },
            });
            expect(enableGetChoices).toHaveBeenCalledWith({ q: 'hello world' });
        });

        it('should fetch current value using getMany even if enableGetChoices is returning false', async () => {
            const children = jest.fn(() => <div />);

            const store = createAdminStore({
                initialState: {
                    admin: { resources: { tags: { data: { 5: {}, 6: {} } } } },
                },
            });
            const dispatch = jest.spyOn(store, 'dispatch');
            render(
                <Provider store={store}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <Form
                            onSubmit={jest.fn()}
                            render={() => (
                                <ReferenceArrayInputController
                                    {...defaultProps}
                                    input={{ value: [5, 6] }}
                                    enableGetChoices={() => false}
                                >
                                    {children}
                                </ReferenceArrayInputController>
                            )}
                        />
                    </CoreAdminContext>
                </Provider>
            );
            await waitFor(() => {
                expect(dispatch).toHaveBeenCalledWith({
                    type: CRUD_GET_MANY,
                    meta: {
                        resource: 'tags',
                    },
                    payload: { ids: [5, 6] },
                });
            });
            expect(dispatch).toHaveBeenCalledTimes(5);
        });

        it.skip('should set loading to false if enableGetChoices returns false', async () => {
            const children = jest.fn().mockReturnValue(<div />);
            await new Promise(resolve => setTimeout(resolve, 100)); // empty the query deduplication in useQueryWithStore
            const enableGetChoices = jest.fn().mockImplementation(({ q }) => {
                return false;
            });
            renderWithRedux(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            allowEmpty
                            enableGetChoices={enableGetChoices}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />,
                { admin: { resources: { tags: { data: {} } } } }
            );

            await waitFor(() => {
                expect(children.mock.calls[0][0].loading).toEqual(false);
            });
        });
    });
});
