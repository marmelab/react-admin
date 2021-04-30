import * as React from 'react';
import expect from 'expect';
import { fireEvent, waitFor, act } from '@testing-library/react';
import lolex from 'lolex';
import TextField from '@material-ui/core/TextField/TextField';

import { DataProviderContext } from '../dataProvider';
import ListController from './ListController';
import {
    getListControllerProps,
    sanitizeListRestProps,
} from './useListController';

import { renderWithRedux } from 'ra-test';
import { CRUD_CHANGE_LIST_PARAMS } from '../actions';
import { SORT_ASC } from '../reducer/admin/resource/list/queryReducer';

describe('useListController', () => {
    const defaultProps = {
        basePath: '',
        children: jest.fn(),
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        ids: [],
        location: {
            pathname: '/posts',
            search: undefined,
            state: undefined,
            hash: undefined,
        },
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

    describe('data', () => {
        it('should be synchronized with ids after delete', async () => {
            const FooField = ({ record }) => <span>{record.foo}</span>;
            const dataProvider = {
                getList: () =>
                    Promise.resolve({
                        data: [
                            { id: 1, foo: 'foo1' },
                            { id: 2, foo: 'foo2' },
                        ],
                        total: 2,
                    }),
            };
            const { dispatch, queryByText } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <ListController
                        {...defaultProps}
                        resource="comments"
                        filter={{ foo: 1 }}
                    >
                        {({ data, ids }) => (
                            <>
                                {ids.map(id => (
                                    <FooField key={id} record={data[id]} />
                                ))}
                            </>
                        )}
                    </ListController>
                </DataProviderContext.Provider>,
                {
                    admin: {
                        resources: {
                            comments: {
                                list: {
                                    params: {},
                                    cachedRequests: {},
                                    ids: [],
                                    selectedIds: [],
                                    total: null,
                                },
                                data: {},
                            },
                        },
                    },
                }
            );
            await act(async () => await new Promise(r => setTimeout(r)));

            // delete one post
            act(() => {
                dispatch({
                    type: 'RA/CRUD_DELETE_OPTIMISTIC',
                    payload: { id: 1 },
                    meta: {
                        resource: 'comments',
                        fetch: 'DELETE',
                        optimistic: true,
                    },
                });
            });
            await act(async () => await new Promise(r => setTimeout(r)));

            expect(queryByText('foo1')).toBeNull();
            expect(queryByText('foo2')).not.toBeNull();
        });
    });

    describe('setFilters', () => {
        let clock;
        let fakeComponent = ({ setFilters, filterValues }) => (
            <TextField
                inputProps={{
                    'aria-label': 'search',
                }}
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
                children: fakeComponent,
            };

            const { getByLabelText, dispatch, reduxStore } = renderWithRedux(
                <ListController syncWithLocation {...props} />,
                {
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
                }
            );
            const searchInput = getByLabelText('search');

            fireEvent.change(searchInput, { target: { value: 'hel' } });
            fireEvent.change(searchInput, { target: { value: 'hell' } });
            fireEvent.change(searchInput, { target: { value: 'hello' } });

            clock.tick(210);

            const changeParamsCalls = dispatch.mock.calls.filter(
                call => call[0].type === CRUD_CHANGE_LIST_PARAMS
            );
            expect(changeParamsCalls).toHaveLength(1);

            const state = reduxStore.getState();
            expect(state.admin.resources.posts.list.params.filter).toEqual({
                q: 'hello',
            });
        });

        it('should remove empty filters', () => {
            const props = {
                ...defaultProps,
                location: {
                    ...defaultProps.location,
                    search: `?filter=${JSON.stringify({ q: 'hello' })}`,
                },
                children: fakeComponent,
            };

            const { getByLabelText, dispatch, reduxStore } = renderWithRedux(
                <ListController syncWithLocation {...props} />,
                {
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
                }
            );
            const searchInput = getByLabelText('search');

            // FIXME: For some reason, triggering the change event with an empty string
            // does not call the event handler on fakeComponent
            fireEvent.change(searchInput, { target: { value: '' } });
            clock.tick(210);

            const changeParamsCalls = dispatch.mock.calls.filter(
                call => call[0].type === CRUD_CHANGE_LIST_PARAMS
            );
            expect(changeParamsCalls).toHaveLength(1);

            const state = reduxStore.getState();
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

            const { dispatch, rerender } = renderWithRedux(
                <ListController
                    syncWithLocation
                    {...props}
                    filter={{ foo: 1 }}
                />,
                {
                    admin: {
                        resources: {
                            posts: {
                                list: {
                                    params: {},
                                    cachedRequests: {},
                                    ids: [],
                                    selectedIds: [],
                                    total: null,
                                },
                            },
                        },
                    },
                }
            );
            const crudGetListCalls = dispatch.mock.calls.filter(
                call => call[0].type === 'RA/CRUD_GET_LIST'
            );
            expect(crudGetListCalls).toHaveLength(1);
            // Check that the permanent filter was used in the query
            expect(crudGetListCalls[0][0].payload.filter).toEqual({ foo: 1 });
            // Check that the permanent filter is not included in the displayedFilters (passed to Filter form and button)
            expect(children).toBeCalledTimes(2);
            expect(children.mock.calls[0][0].displayedFilters).toEqual({});
            // Check that the permanent filter is not included in the filterValues (passed to Filter form and button)
            expect(children.mock.calls[0][0].filterValues).toEqual({});

            rerender(
                <ListController
                    syncWithLocation
                    {...props}
                    filter={{ foo: 2 }}
                />
            );

            const updatedCrudGetListCalls = dispatch.mock.calls.filter(
                call => call[0].type === 'RA/CRUD_GET_LIST'
            );
            expect(updatedCrudGetListCalls).toHaveLength(2);
            // Check that the permanent filter was used in the query
            expect(updatedCrudGetListCalls[1][0].payload.filter).toEqual({
                foo: 2,
            });
            expect(children).toBeCalledTimes(4);
            // Check that the permanent filter is not included in the displayedFilters (passed to Filter form and button)
            expect(children.mock.calls[2][0].displayedFilters).toEqual({});
            // Check that the permanent filter is not included in the filterValues (passed to Filter form and button)
            expect(children.mock.calls[2][0].filterValues).toEqual({});
        });

        afterEach(() => {
            clock.uninstall();
        });
    });
    describe('showFilter', () => {
        it('Does not remove previously shown filter when adding a new one', async () => {
            let currentDisplayedFilters;

            let fakeComponent = ({
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
                children: fakeComponent,
            };

            const { getByLabelText } = renderWithRedux(
                <ListController {...props} />,
                {
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
                }
            );

            fireEvent.click(getByLabelText('Show filter 1'));
            await waitFor(() => {
                expect(currentDisplayedFilters).toEqual({
                    'filter1.subdata': true,
                });
            });
            fireEvent.click(getByLabelText('Show filter 2'));
            await waitFor(() => {
                expect(currentDisplayedFilters).toEqual({
                    'filter1.subdata': true,
                    filter2: true,
                });
            });
        });

        it('should support to sync calls', async () => {
            const { getByLabelText, queryByText } = renderWithRedux(
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
                </ListController>,
                {
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
                }
            );

            fireEvent.click(getByLabelText('Show filters'));

            await waitFor(() => {
                expect(queryByText('filter1.subdata')).not.toBeNull();
                expect(queryByText('filter2')).not.toBeNull();
            });
        });
    });

    describe('getListControllerProps', () => {
        it('should only pick the props injected by the ListController', () => {
            expect(
                getListControllerProps({
                    foo: 1,
                    data: [4, 5],
                    ids: [1, 2],
                    page: 3,
                    bar: 'hello',
                })
            ).toEqual({
                data: [4, 5],
                ids: [1, 2],
                page: 3,
            });
        });
    });
    describe('sanitizeListRestProps', () => {
        it('should omit the props injected by the ListController', () => {
            expect(
                sanitizeListRestProps({
                    foo: 1,
                    data: [4, 5],
                    ids: [1, 2],
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
