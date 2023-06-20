import * as React from 'react';
import expect from 'expect';
import {
    render,
    fireEvent,
    waitFor,
    screen,
    act,
} from '@testing-library/react';
import lolex from 'lolex';
// TODO: we shouldn't import mui components in ra-core
import { TextField } from '@mui/material';
import { createMemoryHistory } from 'history';

import { testDataProvider } from '../../dataProvider';
import { memoryStore } from '../../store';
import {
    useInfiniteListController,
    InfiniteListControllerResult,
    InfiniteListControllerProps,
} from './useInfiniteListController';
import {
    getListControllerProps,
    sanitizeListRestProps,
} from './useListController';
import { CoreAdminContext } from '../../core';

const InfiniteListController = ({
    children,
    ...props
}: {
    children: (params: InfiniteListControllerResult) => JSX.Element;
} & InfiniteListControllerProps) => {
    const controllerProps = useInfiniteListController(props);
    return children(controllerProps);
};

describe('useInfiniteListController', () => {
    const defaultProps = {
        children: jest.fn(),
        resource: 'posts',
        debounce: 200,
    };

    describe('queryOptions', () => {
        it('should accept custom client query options', async () => {
            const mock = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const getList = jest
                .fn()
                .mockImplementationOnce(() => Promise.reject(new Error()));
            const onError = jest.fn();
            const dataProvider = testDataProvider({ getList });
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <InfiniteListController
                        resource="posts"
                        queryOptions={{ onError }}
                    >
                        {() => <div />}
                    </InfiniteListController>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(getList).toHaveBeenCalled();
                expect(onError).toHaveBeenCalled();
            });
            mock.mockRestore();
        });

        it('should accept meta in queryOptions', async () => {
            const getList = jest
                .fn()
                .mockImplementationOnce(() =>
                    Promise.resolve({ data: [], total: 25 })
                );
            const dataProvider = testDataProvider({ getList });
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <InfiniteListController
                        resource="posts"
                        queryOptions={{ meta: { foo: 'bar' } }}
                    >
                        {() => <div />}
                    </InfiniteListController>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(getList).toHaveBeenCalledWith('posts', {
                    filter: {},
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'ASC' },
                    meta: { foo: 'bar' },
                });
            });
        });

        it('should reset page when enabled is set to false', async () => {
            const children = jest.fn().mockReturnValue(<span>children</span>);
            const dataProvider = testDataProvider();
            const props = { ...defaultProps, children };
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <InfiniteListController
                        disableSyncWithLocation
                        queryOptions={{ enabled: false }}
                        {...props}
                    />
                </CoreAdminContext>
            );

            act(() => {
                // @ts-ignore
                children.mock.calls.at(-1)[0].setPage(3);
            });

            await waitFor(() => {
                expect(children).toHaveBeenCalledWith(
                    expect.objectContaining({
                        page: 1,
                    })
                );
            });
        });
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
            // @ts-ignore
            clock = lolex.install();
        });

        it('should take only last change in case of a burst of changes (case of inputs being currently edited)', () => {
            const props = {
                ...defaultProps,
                children: childFunction,
            };
            const store = memoryStore();
            const storeSpy = jest.spyOn(store, 'setItem');

            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    store={store}
                >
                    <InfiniteListController {...props} />
                </CoreAdminContext>
            );
            const searchInput = screen.getByLabelText('search');

            fireEvent.change(searchInput, { target: { value: 'hel' } });
            fireEvent.change(searchInput, { target: { value: 'hell' } });
            fireEvent.change(searchInput, { target: { value: 'hello' } });
            clock.tick(210);

            expect(storeSpy).toHaveBeenCalledTimes(1);
            expect(storeSpy).toHaveBeenCalledWith('posts.listParams', {
                filter: { q: 'hello' },
                order: 'ASC',
                page: 1,
                perPage: 10,
                sort: 'id',
            });
        });

        it('should remove empty filters', () => {
            const props = {
                ...defaultProps,
                children: childFunction,
            };

            const history = createMemoryHistory({
                initialEntries: [
                    `/posts?filter=${JSON.stringify({
                        q: 'hello',
                    })}&displayedFilters=${JSON.stringify({ q: true })}`,
                ],
            });
            const store = memoryStore();
            const storeSpy = jest.spyOn(store, 'setItem');
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    history={history}
                    store={store}
                >
                    <InfiniteListController {...props} />
                </CoreAdminContext>
            );
            expect(storeSpy).toHaveBeenCalledTimes(1);

            const searchInput = screen.getByLabelText('search');
            // FIXME: For some reason, triggering the change event with an empty string
            // does not call the event handler on childFunction
            fireEvent.change(searchInput, { target: { value: '' } });
            clock.tick(210);

            expect(storeSpy).toHaveBeenCalledTimes(2);

            expect(storeSpy).toHaveBeenCalledWith('posts.listParams', {
                filter: {},
                displayedFilters: { q: true },
                order: 'ASC',
                page: 1,
                perPage: 10,
                sort: 'id',
            });
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
                    <InfiniteListController {...props} filter={{ foo: 1 }} />
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
                    <InfiniteListController {...props} filter={{ foo: 2 }} />
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

            let childFunction = ({ showFilter, displayedFilters }) => {
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
                <CoreAdminContext>
                    <InfiniteListController {...props} />
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
                <CoreAdminContext>
                    <InfiniteListController {...defaultProps}>
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
                    </InfiniteListController>
                </CoreAdminContext>
            );

            fireEvent.click(screen.getByLabelText('Show filters'));

            await waitFor(() => {
                expect(screen.queryByText('filter1.subdata')).not.toBeNull();
                expect(screen.queryByText('filter2')).not.toBeNull();
            });
        });
    });

    describe('pagination', () => {
        it('should compute hasNextPage and hasPreviousPage based on total', async () => {
            const getList = jest
                .fn()
                .mockImplementation(() =>
                    Promise.resolve({ data: [], total: 25 })
                );
            const dataProvider = testDataProvider({ getList });
            const children = jest.fn().mockReturnValue(<span>children</span>);
            const props = {
                ...defaultProps,
                children,
            };
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <InfiniteListController
                        disableSyncWithLocation
                        {...props}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(children).toHaveBeenCalledWith(
                    expect.objectContaining({
                        page: 1,
                        total: 25,
                        hasNextPage: true,
                        hasPreviousPage: false,
                    })
                );
            });
            act(() => {
                // @ts-ignore
                children.mock.calls.at(-1)[0].setPage(2);
            });
            await waitFor(() => {
                expect(children).toHaveBeenCalledWith(
                    expect.objectContaining({
                        page: 2,
                        total: 25,
                        hasNextPage: true,
                        hasPreviousPage: true,
                    })
                );
            });
            act(() => {
                // @ts-ignore
                children.mock.calls.at(-1)[0].setPage(3);
            });
            await waitFor(() => {
                expect(children).toHaveBeenCalledWith(
                    expect.objectContaining({
                        page: 3,
                        total: 25,
                        hasNextPage: false,
                        hasPreviousPage: true,
                    })
                );
            });
        });
        it('should compute hasNextPage and hasPreviousPage based on pageInfo', async () => {
            const getList = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    data: [],
                    pageInfo: { hasNextPage: true, hasPreviousPage: false },
                })
            );
            const dataProvider = testDataProvider({ getList });
            const children = jest.fn().mockReturnValue(<span>children</span>);
            const props = {
                ...defaultProps,
                children,
            };
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <InfiniteListController
                        disableSyncWithLocation
                        {...props}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(children).toHaveBeenCalledWith(
                    expect.objectContaining({
                        page: 1,
                        total: undefined,
                        hasNextPage: true,
                        hasPreviousPage: false,
                    })
                );
            });
        });
    });

    describe('getInfiniteListControllerProps', () => {
        it('should only pick the props injected by the InfiniteListController', () => {
            expect(
                getListControllerProps({
                    foo: 1,
                    data: [4, 5],
                    page: 3,
                    bar: 'hello',
                })
            ).toEqual({
                sort: undefined,
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
            });
        });
    });

    describe('sanitizeListRestProps', () => {
        it('should omit the props injected by the InfiniteListController', () => {
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
