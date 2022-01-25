import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { stringify } from 'query-string';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { fireEvent, waitFor } from '@testing-library/react';

import { CoreAdminContext, createAdminStore } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { useListParams, getQuery, getNumberOrDefault } from './useListParams';
import { SORT_DESC, SORT_ASC } from './queryReducer';

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
            const history = createMemoryHistory();
            const navigate = jest.spyOn(history, 'push');
            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo', 'bar');
                return <span />;
            };
            render(
                <CoreAdminContext
                    history={history}
                    dataProvider={testDataProvider()}
                >
                    <TestedComponent />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(navigate).toHaveBeenCalledWith(
                    {
                        hash: '',
                        pathname: '/',
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
                    },
                    { _scrollToTop: false }
                );
            });
        });
        it('should initialize filters', async () => {
            const history = createMemoryHistory();
            const navigate = jest.spyOn(history, 'push');

            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo', 'bar');
                return <span />;
            };
            render(
                <CoreAdminContext
                    history={history}
                    dataProvider={testDataProvider()}
                >
                    <TestedComponent />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(navigate).toBeCalledWith(
                    {
                        hash: '',
                        pathname: '/',
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
                    },
                    { _scrollToTop: false }
                );
            });
        });

        it('should initialize displayed filters on compound filters', async () => {
            const history = createMemoryHistory();
            const navigate = jest.spyOn(history, 'push');

            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo.bar', 'baz');
                return <span />;
            };
            render(
                <CoreAdminContext
                    history={history}
                    dataProvider={testDataProvider()}
                >
                    <TestedComponent />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(navigate).toBeCalledWith(
                    {
                        hash: '',
                        pathname: '/',
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
                    },
                    { _scrollToTop: false }
                );
            });
        });

        it('should initialize filters on compound filters', async () => {
            const history = createMemoryHistory();
            const navigate = jest.spyOn(history, 'push');

            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo.bar', 'baz');
                return <span />;
            };
            render(
                <CoreAdminContext
                    history={history}
                    dataProvider={testDataProvider()}
                >
                    <TestedComponent />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(navigate).toBeCalledWith(
                    {
                        hash: '',
                        pathname: '/',
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
                    },
                    { _scrollToTop: false }
                );
            });
        });
    });
    describe('useListParams', () => {
        const Component = ({ disableSyncWithLocation = false }) => {
            const [, { setPage }] = useListParams({
                resource: 'posts',
                disableSyncWithLocation,
            });

            const handleClick = () => {
                setPage(10);
            };

            return <button onClick={handleClick}>update</button>;
        };

        it('should synchronize parameters with location and redux state when sync is enabled', async () => {
            const history = createMemoryHistory();
            const navigate = jest.spyOn(history, 'push');
            const store = createAdminStore({});
            const dispatch = jest.spyOn(store, 'dispatch');

            render(
                <Provider store={store}>
                    <CoreAdminContext
                        history={history}
                        dataProvider={testDataProvider()}
                    >
                        <Component />
                    </CoreAdminContext>
                </Provider>
            );

            fireEvent.click(screen.getByText('update'));
            await waitFor(() => {
                expect(navigate).toHaveBeenCalled();
            });
            await waitFor(() => {
                expect(dispatch).toHaveBeenCalled();
            });
        });

        test('should not synchronize parameters with location and redux state when sync is not enabled', async () => {
            const history = createMemoryHistory();
            const navigate = jest.spyOn(history, 'push');
            const store = createAdminStore({});
            const dispatch = jest.spyOn(store, 'dispatch');

            render(
                <Provider store={store}>
                    <CoreAdminContext
                        history={history}
                        dataProvider={testDataProvider()}
                    >
                        <Component />
                    </CoreAdminContext>
                </Provider>
            );

            fireEvent.click(screen.getByText('update'));

            await waitFor(() => {
                expect(navigate).not.toHaveBeenCalled();
                expect(dispatch).not.toHaveBeenCalled();
            });
        });
    });
});
