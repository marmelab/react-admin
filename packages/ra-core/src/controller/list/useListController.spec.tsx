import * as React from 'react';
import expect from 'expect';
import {
    render,
    fireEvent,
    waitFor,
    screen,
    act,
} from '@testing-library/react';
import { testDataProvider } from '../../dataProvider';
import { memoryStore } from '../../store';
import { CoreAdminContext } from '../../core';
import { TestMemoryRouter } from '../../routing';
import { AuthProvider } from '../../types';
import { ListController } from './ListController';
import {
    getListControllerProps,
    sanitizeListRestProps,
} from './useListController';
import {
    Authenticated,
    CanAccess,
    DisableAuthentication,
} from './useListController.security.stories';
import { Basic, defaultDataProvider } from './useListController.stories';

describe('useListController', () => {
    const defaultProps = {
        children: jest.fn(),
        resource: 'posts',
        debounce: 200,
    };

    describe('queryOptions', () => {
        it('should accept custom client query options', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
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
                    <ListController
                        resource="posts"
                        queryOptions={{ meta: { foo: 'bar' } }}
                    >
                        {() => <div />}
                    </ListController>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(getList).toHaveBeenCalledWith('posts', {
                    filter: {},
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'id', order: 'ASC' },
                    meta: { foo: 'bar' },
                    signal: undefined,
                });
            });
        });

        it('should reset page when enabled is set to false', async () => {
            const children = jest.fn().mockReturnValue(<span>children</span>);
            const dataProvider = testDataProvider({
                getList: () => Promise.resolve({ data: [], total: 0 }),
            });
            const props = { ...defaultProps, children };
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ListController
                        disableSyncWithLocation
                        queryOptions={{ enabled: false }}
                        {...props}
                        resource="posts"
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
        let childFunction = ({ setFilters, filterValues }) => (
            <input
                aria-label="search"
                type="text"
                value={filterValues.q || ''}
                onChange={event => {
                    setFilters({ q: event.target.value });
                }}
            />
        );

        it('should take only last change in case of a burst of changes (case of inputs being currently edited)', async () => {
            const props = {
                ...defaultProps,
                children: childFunction,
            };
            const store = memoryStore();
            const storeSpy = jest.spyOn(store, 'setItem');

            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.resolve({ data: [], total: 0 }),
                    })}
                    store={store}
                >
                    <ListController {...props} />
                </CoreAdminContext>
            );
            const searchInput = screen.getByLabelText('search');

            fireEvent.change(searchInput, { target: { value: 'hel' } });
            fireEvent.change(searchInput, { target: { value: 'hell' } });
            fireEvent.change(searchInput, { target: { value: 'hello' } });
            await new Promise(resolve => setTimeout(resolve, 210));

            await waitFor(() => {
                expect(storeSpy).toHaveBeenCalledTimes(1);
            });
            expect(storeSpy).toHaveBeenCalledWith('posts.listParams', {
                filter: { q: 'hello' },
                order: 'ASC',
                page: 1,
                perPage: 10,
                sort: 'id',
            });
        });

        it('should remove empty filters', async () => {
            const props = {
                ...defaultProps,
                children: childFunction,
            };

            const store = memoryStore();
            const storeSpy = jest.spyOn(store, 'setItem');
            render(
                <TestMemoryRouter
                    initialEntries={[
                        `/posts?filter=${JSON.stringify({
                            q: 'hello',
                        })}&displayedFilters=${JSON.stringify({ q: true })}`,
                    ]}
                >
                    <CoreAdminContext
                        dataProvider={testDataProvider({
                            getList: () =>
                                Promise.resolve({ data: [], total: 0 }),
                        })}
                        store={store}
                    >
                        <ListController {...props} />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            expect(storeSpy).toHaveBeenCalledTimes(1);

            const searchInput = screen.getByLabelText('search');
            // FIXME: For some reason, triggering the change event with an empty string
            // does not call the event handler on childFunction
            fireEvent.change(searchInput, { target: { value: '' } });
            await new Promise(resolve => setTimeout(resolve, 210));

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

        it('should update data if permanent filters change', async () => {
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

            const { rerender } = render(
                <TestMemoryRouter initialEntries={[`/posts`]}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ListController {...props} filter={{ foo: 1 }} />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            // Check that the permanent filter was used in the query
            await waitFor(() => {
                expect(getList).toHaveBeenCalledTimes(1);
            });
            expect(getList).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({ filter: { foo: 1 } })
            );

            // Check that the permanent filter is not included in the displayedFilters and filterValues (passed to Filter form and button)
            expect(children).toHaveBeenCalledTimes(2);
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    displayedFilters: {},
                    filterValues: {},
                })
            );

            rerender(
                <TestMemoryRouter initialEntries={[`/posts`]}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ListController {...props} filter={{ foo: 2 }} />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            // Check that the permanent filter was used in the query
            await waitFor(() => {
                expect(getList).toHaveBeenCalledTimes(2);
            });
            expect(getList).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({ filter: { foo: 2 } })
            );
            expect(children).toHaveBeenCalledTimes(4);
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
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.resolve({ data: [], total: 0 }),
                    })}
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
                    dataProvider={testDataProvider({
                        getList: () => Promise.resolve({ data: [], total: 0 }),
                    })}
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
                    <ListController {...props} />
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
                    <ListController {...props} />
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

    describe('security', () => {
        it('should not call the dataProvider until the authentication check passes', async () => {
            let resolveAuthCheck: () => void;
            const authProvider: AuthProvider = {
                checkAuth: jest.fn(
                    () =>
                        new Promise(resolve => {
                            resolveAuthCheck = resolve;
                        })
                ),
                login: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                getPermissions: () => Promise.resolve(),
            };
            const dataProvider = testDataProvider({
                // @ts-ignore
                getList: jest.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'A post', votes: 0 }],
                        total: 0,
                    })
                ),
            });

            render(
                <Authenticated
                    authProvider={authProvider}
                    dataProvider={dataProvider}
                />
            );
            await waitFor(() => {
                expect(authProvider.checkAuth).toHaveBeenCalled();
            });
            expect(dataProvider.getList).not.toHaveBeenCalled();
            resolveAuthCheck!();
            await screen.findByText('A post - 0 votes');
        });

        it('should redirect to the /access-denied page when users do not have access', async () => {
            render(<CanAccess />);
            await screen.findByText('Loading...');
            await screen.findByText('Post #1 - 90 votes');
            fireEvent.click(await screen.findByText('posts.list access'));
            await screen.findByText('Access denied');
        });

        it('should display the show view when users have access', async () => {
            render(<CanAccess />);
            await screen.findByText('Loading...');
            await screen.findByText('Post #1 - 90 votes');
        });

        it('should call the dataProvider if disableAuthentication is true', async () => {
            const authProvider: AuthProvider = {
                checkAuth: jest.fn(),
                login: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                getPermissions: () => Promise.resolve(),
            };
            const dataProvider = testDataProvider({
                // @ts-ignore
                getList: jest.fn(() =>
                    Promise.resolve({
                        data: [{ id: 1, title: 'A post', votes: 0 }],
                        total: 0,
                    })
                ),
            });

            render(
                <DisableAuthentication
                    authProvider={authProvider}
                    dataProvider={dataProvider}
                />
            );
            await screen.findByText('A post - 0 votes');
            expect(dataProvider.getList).toHaveBeenCalled();
            expect(authProvider.checkAuth).not.toHaveBeenCalled();
        });
    });

    describe('onSelectAll', () => {
        it('should select all records', async () => {
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: []'
                );
            });
            fireEvent.click(screen.getByText('Select All'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1,2,3,4,5,6,7]'
                );
            });
        });
        it('should select all records even though some records are already selected', async () => {
            render(<Basic />);
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: []'
                );
            });
            fireEvent.click(screen.getByText('Select item 1'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1]'
                );
            });
            fireEvent.click(screen.getByText('Select All'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1,2,3,4,5,6,7]'
                );
            });
        });
        it('should not select more records than the provided limit', async () => {
            const dataProvider = defaultDataProvider;
            const getList = jest.spyOn(dataProvider, 'getList');
            render(<Basic dataProvider={dataProvider} />);
            fireEvent.click(await screen.findByText('Limited Select All'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: []'
                );
            });
            fireEvent.click(screen.getByText('Limited Select All'));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1,2,3]'
                );
            });
            await waitFor(() => {
                expect(getList).toHaveBeenCalledWith(
                    'posts',
                    expect.objectContaining({
                        pagination: { page: 1, perPage: 3 },
                    })
                );
            });
        });
    });
});
