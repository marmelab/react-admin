import * as React from 'react';
import expect from 'expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { stringify, parse } from 'query-string';
import { CoreAdminContext } from '../../core';

import { testDataProvider } from '../../dataProvider';
import { useStore } from '../../store/useStore';
import {
    useListParams,
    getQuery,
    getNumberOrDefault,
    ListParamsOptions,
} from './useListParams';
import { SORT_DESC, SORT_ASC } from './queryReducer';
import { TestMemoryRouter } from '../../routing';
import { memoryStore } from '../../store';

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
        it('Sets the values from the store if location does not have them', () => {
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
        it('Extends the values from the store with those from the props', () => {
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
        it('Uses the filterDefaultValues if neither the location or the store have them', () => {
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
            let location;
            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo', 'bar');
                return <span />;
            };
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <TestedComponent />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
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
                        state: { _scrollToTop: false },
                    })
                );
            });
        });
        it('should initialize filters', async () => {
            let location;

            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo', 'bar');
                return <span />;
            };
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <TestedComponent />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
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
                        state: { _scrollToTop: false },
                    })
                );
            });
        });

        it('should initialize displayed filters on compound filters', async () => {
            let location;

            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo.bar', 'baz');
                return <span />;
            };
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <TestedComponent />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
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
                        state: { _scrollToTop: false },
                    })
                );
            });
        });

        it('should initialize filters on compound filters', async () => {
            let location;

            const TestedComponent = () => {
                const [, { showFilter }] = useListParams({
                    resource: 'foo',
                });
                showFilter('foo.bar', 'baz');
                return <span />;
            };
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <TestedComponent />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
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
                        state: { _scrollToTop: false },
                    })
                );
            });
        });
    });
    describe('useListParams', () => {
        const Component = ({
            disableSyncWithLocation = false,
            ...options
        }: Partial<ListParamsOptions>) => {
            const [{ page, perPage, sort, order, filter }, { setPage }] =
                useListParams({
                    resource: 'posts',
                    disableSyncWithLocation,
                    ...options,
                });

            const handleClick = () => {
                setPage(10);
            };

            return (
                <>
                    <p>page: {page}</p>
                    <p>perPage: {perPage}</p>
                    <p>sort: {sort}</p>
                    <p>order: {order}</p>
                    <p>filter: {JSON.stringify(filter)}</p>
                    <button onClick={handleClick}>update</button>
                </>
            );
        };

        it('should synchronize parameters with location and store when sync is enabled', async () => {
            let location;
            let storeValue;
            const StoreReader = () => {
                const [value] = useStore('posts.listParams');
                React.useEffect(() => {
                    storeValue = value;
                }, [value]);
                return null;
            };
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <Component />
                        <StoreReader />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            fireEvent.click(screen.getByText('update'));
            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
                        pathname: '/',
                        search:
                            '?' +
                            stringify({
                                filter: JSON.stringify({}),
                                sort: 'id',
                                order: 'ASC',
                                page: 10,
                                perPage: 10,
                            }),
                    })
                );
            });

            expect(storeValue).toEqual({
                sort: 'id',
                order: 'ASC',
                page: 10,
                perPage: 10,
                filter: {},
            });
        });

        it('should synchronize parameters with location and store when sync is enabled while keeping custom query params', async () => {
            let locationSearchValue;
            let storeValue;
            const ComponentThatSetsCustomQueryString = ({
                disableSyncWithLocation = false,
            }) => {
                const [_, { setFilters }] = useListParams({
                    resource: 'posts',
                    disableSyncWithLocation,
                });

                const handleClick = () => {
                    setFilters({ x: 'y' }, []);
                };

                return (
                    <>
                        <button onClick={handleClick}>set filters</button>
                    </>
                );
            };
            const StoreReader = () => {
                const [value] = useStore('posts.listParams');
                React.useEffect(() => {
                    storeValue = value;
                }, [value]);
                return null;
            };
            render(
                <TestMemoryRouter
                    initialEntries={['/posts?foo=bar']}
                    locationCallback={l => {
                        locationSearchValue = l.search;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <ComponentThatSetsCustomQueryString />
                        <StoreReader />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            fireEvent.click(screen.getByText('set filters'));

            await waitFor(() => {
                expect(parse(locationSearchValue)).toEqual({
                    displayedFilters: '[]',
                    filter: '{"x":"y"}',
                    foo: 'bar',
                    order: 'ASC',
                    page: '1',
                    perPage: '10',
                    sort: 'id',
                });
            });

            expect(storeValue).toEqual({
                displayedFilters: [],
                filter: { x: 'y' },
                foo: 'bar',
                order: 'ASC',
                page: 1,
                perPage: 10,
                sort: 'id',
            });
        });

        it('should synchronize location with store when sync is enabled', async () => {
            let location;
            let storeValue;
            const StoreReader = () => {
                const [value] = useStore('posts.listParams');
                React.useEffect(() => {
                    storeValue = value;
                }, [value]);
                return null;
            };
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext
                        dataProvider={testDataProvider()}
                        store={memoryStore({
                            'posts.listParams': {
                                sort: 'id',
                                order: 'ASC',
                                page: 10,
                                perPage: 10,
                                filter: {},
                            },
                        })}
                    >
                        <Component />
                        <StoreReader />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            await waitFor(() => {
                expect(storeValue).toEqual({
                    sort: 'id',
                    order: 'ASC',
                    page: 10,
                    perPage: 10,
                    filter: {},
                });
            });

            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
                        hash: '',
                        key: expect.any(String),
                        state: null,
                        pathname: '/',
                        search:
                            '?' +
                            stringify({
                                filter: JSON.stringify({}),
                                sort: 'id',
                                order: 'ASC',
                                page: 10,
                                perPage: 10,
                            }),
                    })
                );
            });
        });

        it('should not synchronize parameters with location and store when sync is not enabled', async () => {
            let location;
            let storeValue;
            const StoreReader = () => {
                const [value] = useStore('posts.listParams');
                React.useEffect(() => {
                    storeValue = value;
                }, [value]);
                return null;
            };

            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <Component disableSyncWithLocation />
                        <StoreReader />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            fireEvent.click(screen.getByText('update'));

            await screen.findByText('page: 10');

            expect(location).not.toEqual(
                expect.objectContaining({
                    pathname: '/',
                    search:
                        '?' +
                        stringify({
                            filter: JSON.stringify({}),
                            sort: 'id',
                            order: 'ASC',
                            page: 10,
                            perPage: 10,
                        }),
                })
            );
            expect(storeValue).toBeUndefined();
        });

        it('should not synchronize location with store if the location already contains parameters', async () => {
            let location;
            render(
                <TestMemoryRouter
                    initialEntries={[
                        {
                            search:
                                '?' +
                                stringify({
                                    filter: JSON.stringify({}),
                                    sort: 'id',
                                    order: 'ASC',
                                    page: 5,
                                    perPage: 10,
                                }),
                        },
                    ]}
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext
                        dataProvider={testDataProvider()}
                        store={memoryStore({
                            'posts.listParams': {
                                sort: 'id',
                                order: 'ASC',
                                page: 10,
                                perPage: 10,
                                filter: {},
                            },
                        })}
                    >
                        <Component />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
                        hash: '',
                        key: expect.any(String),
                        state: null,
                        pathname: '/',
                        search:
                            '?' +
                            stringify({
                                filter: JSON.stringify({}),
                                sort: 'id',
                                order: 'ASC',
                                page: 5,
                                perPage: 10,
                            }),
                    })
                );
            });
        });

        it('should not synchronize location with store if the store parameters are the defaults', async () => {
            let location;
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <Component />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            // Let React do its thing
            await new Promise(resolve => setTimeout(resolve, 0));

            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
                        hash: '',
                        key: expect.any(String),
                        state: null,
                        pathname: '/',
                        search: '',
                    })
                );
            });
        });

        it('should not synchronize location with store if the store parameters are the custom defaults provided to the hook', async () => {
            let location;
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <Component
                            perPage={5}
                            sort={{ field: 'title', order: 'DESC' }}
                        />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            // Let React do its thing
            await new Promise(resolve => setTimeout(resolve, 0));

            // The list is using the default set on the component
            await screen.findByText('perPage: 5');
            await screen.findByText('sort: title');
            await screen.findByText('order: DESC');

            // The location is the default for the list (no query parameters)
            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
                        hash: '',
                        key: expect.any(String),
                        state: null,
                        pathname: '/',
                        search: '',
                    })
                );
            });
        });

        it('should not synchronize location with store when sync is not enabled', async () => {
            let location;
            let storeValue;
            const StoreReader = () => {
                const [value] = useStore('posts.listParams');
                React.useEffect(() => {
                    storeValue = value;
                }, [value]);
                return null;
            };
            render(
                <TestMemoryRouter
                    locationCallback={l => {
                        location = l;
                    }}
                >
                    <CoreAdminContext
                        dataProvider={testDataProvider()}
                        store={memoryStore({
                            'posts.listParams': {
                                sort: 'id',
                                order: 'ASC',
                                page: 10,
                                perPage: 10,
                                filter: {},
                            },
                        })}
                    >
                        <Component disableSyncWithLocation />
                        <StoreReader />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            await waitFor(() => {
                expect(storeValue).toEqual({
                    sort: 'id',
                    order: 'ASC',
                    page: 10,
                    perPage: 10,
                    filter: {},
                });
            });

            await waitFor(() => {
                expect(location).toEqual(
                    expect.objectContaining({
                        hash: '',
                        key: expect.any(String),
                        state: null,
                        pathname: '/',
                        search: '',
                    })
                );
            });
        });

        it('should synchronize parameters with store when sync is not enabled and storeKey is passed', async () => {
            let storeValue;
            const Component = ({
                disableSyncWithLocation = false,
                storeKey = undefined,
            }) => {
                const [{ page }, { setPage }] = useListParams({
                    resource: 'posts',
                    disableSyncWithLocation,
                    storeKey,
                });

                const handleClick = () => {
                    setPage(10);
                };

                return (
                    <>
                        <p>page: {page}</p>
                        <button onClick={handleClick}>update</button>
                    </>
                );
            };
            const StoreReader = () => {
                const [value] = useStore('myListParams');
                React.useEffect(() => {
                    storeValue = value;
                }, [value]);
                return null;
            };

            render(
                <TestMemoryRouter>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <Component
                            disableSyncWithLocation
                            storeKey="myListParams"
                        />
                        <StoreReader />
                    </CoreAdminContext>
                </TestMemoryRouter>
            );

            fireEvent.click(screen.getByText('update'));

            await screen.findByText('page: 10');

            expect(storeValue).toEqual({
                filter: {},
                order: 'ASC',
                page: 10,
                perPage: 10,
                sort: 'id',
            });
        });
    });
});
