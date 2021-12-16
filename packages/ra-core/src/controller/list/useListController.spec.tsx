import * as React from 'react';
import expect from 'expect';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import lolex from 'lolex';
// TODO: we shouldn't import mui components in ra-core
import { TextField } from '@mui/material';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';

import { testDataProvider } from '../../dataProvider';
import { ListController } from './ListController';
import {
    getListControllerProps,
    sanitizeListRestProps,
} from './useListController';
import { CoreAdminContext, createAdminStore } from '../../core';
import { CRUD_CHANGE_LIST_PARAMS } from '../../actions';
import { SORT_ASC } from '../../reducer/admin/resource/list/queryReducer';

describe('useListController', () => {
    const defaultProps = {
        basePath: '',
        children: jest.fn(),
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        query: {
            page: 1,
            perPage: 10,
            sort: 'id',
            order: SORT_ASC,
            filter: {},
            displayedFilters: {},
        },
        resource: 'posts',
        debounce: 200,
    };

    it('should accept custom client query options', async () => {
        const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const getList = jest
            .fn()
            .mockImplementationOnce(() => Promise.reject(new Error()));
        const onError = jest.fn();
        const dataProvider = testDataProvider({ getList });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ListController resource="posts" queryOptions={{ onError }}>
                    {() => <div />}
                </ListController>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getList).toHaveBeenCalled();
            expect(onError).toHaveBeenCalled();
        });
        mock.mockRestore();
    });

    describe('setFilters', () => {
        let clock;
        let childFunction = ({ setFilters, filterValues }) => (
            // TODO: we shouldn't import mui components in ra-core
            <TextField
                inputProps={{
                    'aria-label': 'search',
                }}
                type="text"
                value={filterValues.q || ''}
                onChange={event => {
                    setFilters({ q: event.target.value });
                }}
            />
        );

        beforeEach(() => {
            clock = lolex.install();
        });

        it('should take only last change in case of a burst of changes (case of inputs being currently edited)', () => {
            expect.assertions(2);

            const props = {
                ...defaultProps,
                children: childFunction,
            };

            const store = createAdminStore({
                initialState: {
                    admin: {
                        resources: {
                            posts: {
                                list: {
                                    params: {},
                                    cachedRequests: {},
                                },
                            },
                        },
                    },
                },
            });
            const dispatch = jest.spyOn(store, 'dispatch');
            render(
                <Provider store={store}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <ListController {...props} />
                    </CoreAdminContext>
                </Provider>
            );
            const searchInput = screen.getByLabelText('search');

            fireEvent.change(searchInput, { target: { value: 'hel' } });
            fireEvent.change(searchInput, { target: { value: 'hell' } });
            fireEvent.change(searchInput, { target: { value: 'hello' } });

            clock.tick(210);

            const changeParamsCalls = dispatch.mock.calls.filter(
                call => call[0].type === CRUD_CHANGE_LIST_PARAMS
            );
            expect(changeParamsCalls).toHaveLength(1);

            const state = store.getState();
            expect(state.admin.resources.posts.list.params.filter).toEqual({
                q: 'hello',
            });
        });

        it('should remove empty filters', () => {
            const props = {
                ...defaultProps,
                children: childFunction,
            };

            const store = createAdminStore({
                initialState: {
                    admin: {
                        resources: {
                            posts: {
                                list: {
                                    params: {
                                        filter: { q: 'hello' },
                                        displayedFilters: { q: true },
                                    },
                                    cachedRequests: {},
                                },
                            },
                        },
                    },
                },
            });
            const dispatch = jest.spyOn(store, 'dispatch');
            const history = createMemoryHistory({
                initialEntries: [
                    `/posts?filter=${JSON.stringify({
                        q: 'hello',
                    })}&displayedFilters=${JSON.stringify({ q: true })}`,
                ],
            });
            render(
                <Provider store={store}>
                    <CoreAdminContext
                        dataProvider={testDataProvider()}
                        history={history}
                    >
                        <ListController {...props} />
                    </CoreAdminContext>
                </Provider>
            );
            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_CHANGE_LIST_PARAMS
                )
            ).toHaveLength(1);

            const searchInput = screen.getByLabelText('search');
            // FIXME: For some reason, triggering the change event with an empty string
            // does not call the event handler on childFunction
            fireEvent.change(searchInput, { target: { value: '' } });
            clock.tick(210);

            expect(
                dispatch.mock.calls.filter(
                    call => call[0].type === CRUD_CHANGE_LIST_PARAMS
                )
            ).toHaveLength(2);

            const state = store.getState();
            expect(state.admin.resources.posts.list.params.filter).toEqual({});
            expect(
                state.admin.resources.posts.list.params.displayedFilters
            ).toEqual({ q: true });
        });

        it('should update data if permanent filters change', () => {
            const children = jest.fn().mockReturnValue(<span>children</span>);
            const props = {
                ...defaultProps,
                debounce: 200,
                children,
            };
            const getList = jest
                .fn()
                .mockImplementation(() =>
                    Promise.resolve({ data: [], total: 0 })
                );
            const dataProvider = testDataProvider({ getList });
            const history = createMemoryHistory({
                initialEntries: [`/posts`],
            });

            const { rerender } = render(
                <CoreAdminContext dataProvider={dataProvider} history={history}>
                    <ListController {...props} filter={{ foo: 1 }} />
                </CoreAdminContext>
            );

            // Check that the permanent filter was used in the query
            expect(getList).toHaveBeenCalledTimes(1);
            expect(getList).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({ filter: { foo: 1 } })
            );

            // Check that the permanent filter is not included in the displayedFilters and filterValues (passed to Filter form and button)
            expect(children).toHaveBeenCalledTimes(1);
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    displayedFilters: {},
                    filterValues: {},
                })
            );

            rerender(
                <CoreAdminContext dataProvider={dataProvider} history={history}>
                    <ListController {...props} filter={{ foo: 2 }} />
                </CoreAdminContext>
            );

            // Check that the permanent filter was used in the query
            expect(getList).toHaveBeenCalledTimes(2);
            expect(getList).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({ filter: { foo: 2 } })
            );
            expect(children).toHaveBeenCalledTimes(2);
        });

        afterEach(() => {
            clock.uninstall();
        });
    });
    describe('showFilter', () => {
        it('Does not remove previously shown filter when adding a new one', async () => {
            let currentDisplayedFilters;

            let childFunction = ({
                showFilter,
                displayedFilters,
                filterValues,
            }) => {
                currentDisplayedFilters = displayedFilters;
                return (
                    <>
                        <button
                            aria-label="Show filter 1"
                            onClick={() => {
                                showFilter('filter1.subdata', 'bob');
                            }}
                        />
                        <button
                            aria-label="Show filter 2"
                            onClick={() => {
                                showFilter('filter2', '');
                            }}
                        />
                    </>
                );
            };

            const props = {
                ...defaultProps,
                children: childFunction,
            };

            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    initialState={{
                        admin: {
                            resources: {
                                posts: {
                                    list: {
                                        params: {
                                            filter: { q: 'hello' },
                                        },
                                        cachedRequests: {},
                                    },
                                },
                            },
                        },
                    }}
                >
                    <ListController {...props} />
                </CoreAdminContext>
            );

            fireEvent.click(screen.getByLabelText('Show filter 1'));
            await waitFor(() => {
                expect(currentDisplayedFilters).toEqual({
                    'filter1.subdata': true,
                });
            });
            fireEvent.click(screen.getByLabelText('Show filter 2'));
            await waitFor(() => {
                expect(currentDisplayedFilters).toEqual({
                    'filter1.subdata': true,
                    filter2: true,
                });
            });
        });

        it('should support to sync calls', async () => {
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    initialState={{
                        admin: {
                            resources: {
                                posts: {
                                    list: {
                                        params: {
                                            filter: { q: 'hello' },
                                        },
                                        cachedRequests: {},
                                    },
                                },
                            },
                        },
                    }}
                >
                    <ListController {...defaultProps}>
                        {({ displayedFilters, showFilter }) => (
                            <>
                                <button
                                    aria-label="Show filters"
                                    onClick={() => {
                                        showFilter('filter1.subdata', 'bob');
                                        showFilter('filter2', '');
                                    }}
                                />
                                {Object.keys(displayedFilters).map(
                                    (displayedFilter, index) => (
                                        <div key={index}>{displayedFilter}</div>
                                    )
                                )}
                            </>
                        )}
                    </ListController>
                </CoreAdminContext>
            );

            fireEvent.click(screen.getByLabelText('Show filters'));

            await waitFor(() => {
                expect(screen.queryByText('filter1.subdata')).not.toBeNull();
                expect(screen.queryByText('filter2')).not.toBeNull();
            });
        });
    });

    describe('getListControllerProps', () => {
        it('should only pick the props injected by the ListController', () => {
            expect(
                getListControllerProps({
                    foo: 1,
                    data: [4, 5],
                    page: 3,
                    bar: 'hello',
                })
            ).toEqual({
                basePath: undefined,
                currentSort: undefined,
                data: [4, 5],
                defaultTitle: undefined,
                displayedFilters: undefined,
                error: undefined,
                exporter: undefined,
                filterValues: undefined,
                hasCreate: undefined,
                hideFilter: undefined,
                isFetching: undefined,
                isLoading: undefined,
                onSelect: undefined,
                onToggleItem: undefined,
                onUnselectItems: undefined,
                page: 3,
                perPage: undefined,
                refetch: undefined,
                refresh: undefined,
                resource: undefined,
                selectedIds: undefined,
                setFilters: undefined,
                setPage: undefined,
                setPerPage: undefined,
                setSort: undefined,
                showFilter: undefined,
                total: undefined,
                totalPages: undefined,
                version: undefined,
            });
        });
    });
    describe('sanitizeListRestProps', () => {
        it('should omit the props injected by the ListController', () => {
            expect(
                sanitizeListRestProps({
                    foo: 1,
                    data: [4, 5],
                    page: 3,
                    bar: 'hello',
                })
            ).toEqual({
                foo: 1,
                bar: 'hello',
            });
        });
    });
});
