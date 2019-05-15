import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import lolex from 'lolex';
import TextField from '@material-ui/core/TextField/TextField';

import ListController, {
    getListControllerProps,
    getQuery,
    sanitizeListRestProps,
} from './ListController';

import renderWithRedux from '../util/renderWithRedux';
import { CRUD_CHANGE_LIST_PARAMS } from '../actions';

describe('ListController', () => {
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
        },
        resource: 'posts',
        debounce: 200,
    };

    describe('setFilters', () => {
        let clock;
        let fakeComponent;

        beforeEach(() => {
            clock = lolex.install();
            fakeComponent = ({ setFilters }) => (
                <TextField
                    inputProps={{
                        'aria-label': 'search',
                    }}
                    onChange={event => {
                        setFilters({ q: event.target.value });
                    }}
                />
            );
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

        it('should not call filtering function if filters are unchanged', () => {
            expect.assertions(1);

            const props = {
                ...defaultProps,
                location: {
                    ...defaultProps.location,
                    search: `?filter=${JSON.stringify({ q: 'hello' })}`,
                },
                children: fakeComponent,
            };

            const { getByLabelText, dispatch } = renderWithRedux(
                <ListController {...props} />,
                {
                    admin: {
                        resources: { posts: { list: { params: {} } } },
                    },
                }
            );
            const searchInput = getByLabelText('search');

            fireEvent.change(searchInput, { target: { value: 'hello' } });
            clock.tick(210);

            const changeParamsCalls = dispatch.mock.calls.filter(
                call => call[0].type === CRUD_CHANGE_LIST_PARAMS
            );
            expect(changeParamsCalls).toHaveLength(0);
        });

        it.skip('should remove empty filters', () => {
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

            // FIXME: For some reason, trigerring the change event with an empty string
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
    describe('getQuery', () => {
        it('Returns the values from the location first', () => {
            const query = getQuery({
                location: {
                    search: `?page=3&perPage=15&sort=name&order=ASC&filter=${JSON.stringify(
                        { name: 'marmelab' }
                    )}`,
                },
                params: {
                    page: 1,
                    perPage: 10,
                    sort: 'city',
                    order: 'DESC',
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: 'DESC',
                },
            });

            expect(query).toEqual({
                page: '3',
                perPage: '15',
                sort: 'name',
                order: 'ASC',
                filter: {
                    name: 'marmelab',
                },
            });
        });
        it('Extends the values from the location with those from the props', () => {
            const query = getQuery({
                location: {
                    search: `?filter=${JSON.stringify({ name: 'marmelab' })}`,
                },
                params: {
                    page: 1,
                    perPage: 10,
                    sort: 'city',
                    order: 'DESC',
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: 'DESC',
                },
            });

            expect(query).toEqual({
                page: 1,
                perPage: 50,
                sort: 'company',
                order: 'DESC',
                filter: {
                    name: 'marmelab',
                },
            });
        });
        it('Sets the values from the redux store if location does not have them', () => {
            const query = getQuery({
                location: {
                    search: ``,
                },
                params: {
                    page: 2,
                    perPage: 10,
                    sort: 'city',
                    order: 'DESC',
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: 'DESC',
                },
            });

            expect(query).toEqual({
                page: 2,
                perPage: 10,
                sort: 'city',
                order: 'DESC',
                filter: {
                    city: 'Dijon',
                },
            });
        });
        it('Extends the values from the redux store with those from the props', () => {
            const query = getQuery({
                location: {
                    search: ``,
                },
                params: {
                    page: 2,
                    sort: 'city',
                    order: 'DESC',
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: 'DESC',
                },
            });

            expect(query).toEqual({
                page: 2,
                perPage: 50,
                sort: 'city',
                order: 'DESC',
                filter: {
                    city: 'Dijon',
                },
            });
        });
        it('Uses the filterDefaultValues if neither the location or the redux store have them', () => {
            const query = getQuery({
                location: {
                    search: ``,
                },
                params: {},
                filterDefaultValues: { city: 'Nancy' },
                perPage: 50,
                sort: {
                    field: 'company',
                    order: 'DESC',
                },
            });

            expect(query).toEqual({
                page: 1,
                perPage: 50,
                sort: 'company',
                order: 'DESC',
                filter: {
                    city: 'Nancy',
                },
            });
        });
    });
});
