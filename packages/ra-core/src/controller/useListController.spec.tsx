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

        afterEach(() => {
            clock.uninstall();
            cleanup();
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
