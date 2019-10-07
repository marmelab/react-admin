import React from 'react';
import expect from 'expect';
import { fireEvent, cleanup } from '@testing-library/react';
import lolex from 'lolex';
import TextField from '@material-ui/core/TextField/TextField';

import ListController from './ListController';
import {
    getListControllerProps,
    sanitizeListRestProps,
} from './useListController';

import renderWithRedux from '../util/renderWithRedux';
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
        },
        resource: 'posts',
        debounce: 200,
    };

    describe('setFilters', () => {
        let clock;
        let fakeComponent = ({ setFilters, filterValues }) => (
            <TextField
                inputProps={{
                    'aria-label': 'search',
                }}
                value={filterValues.q}
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
                <ListController {...props} />,
                {
                    admin: {
                        resources: { posts: { list: { params: {} } } },
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
                <ListController {...props} />,
                {
                    admin: {
                        resources: {
                            posts: {
                                list: {
                                    params: { filter: { q: 'hello' } },
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
        });

        it('should update data if permanent filters change', () => {
            const children = jest.fn().mockReturnValue(<span>children</span>);
            const props = {
                ...defaultProps,
                debounce: 200,
                crudGetList: jest.fn(),
                children,
            };

            const { dispatch, rerender } = renderWithRedux(
                <ListController {...props} filter={{ foo: 1 }} />,
                {
                    admin: {
                        resources: {
                            posts: {
                                list: {
                                    params: {},
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
            expect(children).toBeCalledTimes(3);
            expect(children.mock.calls[0][0].displayedFilters).toEqual({});
            // Check that the permanent filter is not included in the filterValues (passed to Filter form and button)
            expect(children.mock.calls[0][0].filterValues).toEqual({});

            rerender(<ListController {...props} filter={{ foo: 2 }} />);

            const updatedCrudGetListCalls = dispatch.mock.calls.filter(
                call => call[0].type === 'RA/CRUD_GET_LIST'
            );
            expect(updatedCrudGetListCalls).toHaveLength(2);
            // Check that the permanent filter was used in the query
            expect(updatedCrudGetListCalls[1][0].payload.filter).toEqual({
                foo: 2,
            });
            expect(children).toBeCalledTimes(5);
            // Check that the permanent filter is not included in the displayedFilters (passed to Filter form and button)
            expect(children.mock.calls[3][0].displayedFilters).toEqual({});
            // Check that the permanent filter is not included in the filterValues (passed to Filter form and button)
            expect(children.mock.calls[3][0].filterValues).toEqual({});
        });

        afterEach(() => {
            clock.uninstall();
            cleanup();
        });
    });
    describe('showFilter', () => {
        it('Does not remove previously shown filter when adding a new one', () => {
            let currentDisplayedFilters;

            let fakeComponent = ({ showFilter, displayedFilters }) => {
                currentDisplayedFilters = displayedFilters;
                return (
                    <>
                        <button
                            aria-label="Show filter 1"
                            onClick={() => {
                                showFilter('filter1', '');
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
                                    params: { filter: { q: 'hello' } },
                                },
                            },
                        },
                    },
                }
            );

            fireEvent.click(getByLabelText('Show filter 1'));
            expect(currentDisplayedFilters).toEqual({ filter1: true });
            fireEvent.click(getByLabelText('Show filter 2'));
            expect(currentDisplayedFilters).toEqual({
                filter1: true,
                filter2: true,
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
