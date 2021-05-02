import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { stringify } from 'query-string';
import { createMemoryHistory } from 'history';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithRedux, TestContext } from 'ra-test';

import useListParams, { getQuery, getNumberOrDefault } from './useListParams';
import {
    SORT_DESC,
    SORT_ASC,
} from '../reducer/admin/resource/list/queryReducer';

describe('useListParams', () => {
    describe('getQuery', () => {
        it('Returns the values from the location first', () => {
            const query = getQuery({
                queryFromLocation: {
                    page: 3,
                    perPage: 15,
                    sort: 'name',
                    order: SORT_ASC,
                    filter: { name: 'marmelab' },
                },
                params: {
                    page: 1,
                    perPage: 10,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 3,
                perPage: 15,
                sort: 'name',
                order: SORT_ASC,
                filter: {
                    name: 'marmelab',
                },
            });
        });
        it('Extends the values from the location with those from the props', () => {
            const query = getQuery({
                queryFromLocation: {
                    filter: { name: 'marmelab' },
                },
                params: {
                    page: 1,
                    perPage: 10,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 1,
                perPage: 50,
                sort: 'company',
                order: SORT_DESC,
                filter: {
                    name: 'marmelab',
                },
            });
        });
        it('Sets the values from the redux store if location does not have them', () => {
            const query = getQuery({
                queryFromLocation: {},
                params: {
                    page: 2,
                    perPage: 10,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 2,
                perPage: 10,
                sort: 'city',
                order: SORT_DESC,
                filter: {
                    city: 'Dijon',
                },
            });
        });
        it('Extends the values from the redux store with those from the props', () => {
            const query = getQuery({
                queryFromLocation: {},
                params: {
                    page: 2,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 2,
                perPage: 50,
                sort: 'city',
                order: SORT_DESC,
                filter: {
                    city: 'Dijon',
                },
            });
        });
        it('Uses the filterDefaultValues if neither the location or the redux store have them', () => {
            const query = getQuery({
                queryFromLocation: {},
                params: {},
                filterDefaultValues: { city: 'Nancy' },
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 1,
                perPage: 50,
                sort: 'company',
                order: SORT_DESC,
                filter: {
                    city: 'Nancy',
                },
            });
        });
    });

    describe('getNumberOrDefault', () => {
        it('should return the parsed number', () => {
            const result = getNumberOrDefault('29', 2);

            expect(result).toEqual(29);
        });

        it('should return the default number when passing a not valid number', () => {
            const result = getNumberOrDefault('covfefe', 2);

            expect(result).toEqual(2);
        });

        it('should return the default number when passing an undefined number', () => {
            const result = getNumberOrDefault(undefined, 2);

            expect(result).toEqual(2);
        });

        it('should not return the default number when passing "0"', () => {
            const result = getNumberOrDefault('0', 2);

            expect(result).toEqual(0);
        });
    });
    describe('showFilter', () => {
        it('should initialize displayed filters', async () => {
            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                    syncWithLocation: true,
                });
                showFilter('foo', 'bar');
                return <span />;
            };
            const history = {
                listen: jest.fn(),
                push: jest.fn(),
                location: { pathname: '', search: '' },
            } as any;
            render(
                <Router history={history}>
                    <TestContext history={history}>
                        <TestedComponent />
                    </TestContext>
                </Router>
            );
            await waitFor(() => {
                expect(history.push).toBeCalledWith({
                    search:
                        '?' +
                        stringify({
                            displayedFilters: JSON.stringify({ foo: true }),
                            filter: JSON.stringify({ foo: 'bar' }),
                            sort: 'id',
                            order: 'ASC',
                            page: 1,
                            perPage: 10,
                        }),
                    state: { _scrollToTop: false },
                });
            });
        });
        it('should initialize filters', async () => {
            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                    syncWithLocation: true,
                });
                showFilter('foo', 'bar');
                return <span />;
            };
            const history = {
                listen: jest.fn(),
                push: jest.fn(),
                location: { pathname: '', search: '' },
            } as any;
            render(
                <Router history={history}>
                    <TestContext history={history}>
                        <TestedComponent />
                    </TestContext>
                </Router>
            );
            await waitFor(() => {
                expect(history.push).toBeCalledWith({
                    search:
                        '?' +
                        stringify({
                            displayedFilters: JSON.stringify({ foo: true }),
                            filter: JSON.stringify({ foo: 'bar' }),
                            sort: 'id',
                            order: 'ASC',
                            page: 1,
                            perPage: 10,
                        }),
                    state: { _scrollToTop: false },
                });
            });
        });

        it('should initialize displayed filters on compound filters', async () => {
            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                    syncWithLocation: true,
                });
                showFilter('foo.bar', 'baz');
                return <span />;
            };
            const history = {
                listen: jest.fn(),
                push: jest.fn(),
                location: { pathname: '', search: '' },
            } as any;
            render(
                <Router history={history}>
                    <TestContext history={history}>
                        <TestedComponent />
                    </TestContext>
                </Router>
            );
            await waitFor(() => {
                expect(history.push).toBeCalledWith({
                    search:
                        '?' +
                        stringify({
                            displayedFilters: JSON.stringify({
                                'foo.bar': true,
                            }),
                            filter: JSON.stringify({ foo: { bar: 'baz' } }),
                            sort: 'id',
                            order: 'ASC',
                            page: 1,
                            perPage: 10,
                        }),
                    state: { _scrollToTop: false },
                });
            });
        });

        it('should initialize filters on compound filters', async () => {
            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                    syncWithLocation: true,
                });
                showFilter('foo.bar', 'baz');
                return <span />;
            };
            const history = {
                listen: jest.fn(),
                push: jest.fn(),
                location: { pathname: '', search: '' },
            } as any;
            render(
                <Router history={history}>
                    <TestContext history={history}>
                        <TestedComponent />
                    </TestContext>
                </Router>
            );
            await waitFor(() => {
                expect(history.push).toBeCalledWith({
                    search:
                        '?' +
                        stringify({
                            displayedFilters: JSON.stringify({
                                'foo.bar': true,
                            }),
                            filter: JSON.stringify({ foo: { bar: 'baz' } }),
                            sort: 'id',
                            order: 'ASC',
                            page: 1,
                            perPage: 10,
                        }),
                    state: { _scrollToTop: false },
                });
            });
        });
    });
    describe('useListParams', () => {
        const Component = ({ syncWithLocation = false }) => {
            const [, { setPage }] = useListParams({
                resource: 'posts',
                syncWithLocation,
            });

            const handleClick = () => {
                setPage(10);
            };

            return <button onClick={handleClick}>update</button>;
        };

        it('should synchronize parameters with location and redux state when sync is enabled', async () => {
            const history = createMemoryHistory();
            jest.spyOn(history, 'push');
            let dispatch;

            const { getByText } = renderWithRedux(
                <TestContext enableReducers history={history}>
                    {({ store }) => {
                        dispatch = jest.spyOn(store, 'dispatch');
                        return <Component syncWithLocation />;
                    }}
                </TestContext>
            );

            fireEvent.click(getByText('update'));
            await waitFor(() => {
                expect(history.push).toHaveBeenCalled();
                expect(dispatch).toHaveBeenCalled();
            });
        });

        test('should not synchronize parameters with location and redux state when sync is not enabled', async () => {
            const history = createMemoryHistory();
            jest.spyOn(history, 'push');
            let dispatch;

            const { getByText } = renderWithRedux(
                <TestContext enableReducers history={history}>
                    {({ store }) => {
                        dispatch = jest.spyOn(store, 'dispatch');
                        return <Component />;
                    }}
                </TestContext>
            );

            fireEvent.click(getByText('update'));

            await waitFor(() => {
                expect(history.push).not.toHaveBeenCalled();
                expect(dispatch).not.toHaveBeenCalled();
            });
        });
    });
});
