import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { InfiniteListBase, InfiniteListBaseProps } from './InfiniteListBase';
import { CoreAdminContext } from '../../core';
import { useListContext } from './useListContext';
import { useInfinitePaginationContext } from './useInfinitePaginationContext';
import {
    AuthProvider,
    DataProvider,
    GetListResult,
    I18nProvider,
    IsOffline,
    mergeTranslations,
    TestMemoryRouter,
    useLocaleState,
} from '../..';
import { onlineManager } from '@tanstack/react-query';

export default {
    title: 'ra-core/controller/list/InfiniteListBase',
};

const data = {
    books: [
        { id: 1, title: 'War and Peace' },
        { id: 2, title: 'The Little Prince' },
        { id: 3, title: "Swann's Way" },
        { id: 4, title: 'A Tale of Two Cities' },
        { id: 5, title: 'The Lord of the Rings' },
        { id: 6, title: 'And Then There Were None' },
        { id: 7, title: 'Dream of the Red Chamber' },
        { id: 8, title: 'The Hobbit' },
        { id: 9, title: 'She: A History of Adventure' },
        { id: 10, title: 'The Lion, the Witch and the Wardrobe' },
        { id: 11, title: 'The Chronicles of Narnia' },
        { id: 12, title: 'Pride and Prejudice' },
        { id: 13, title: 'Ulysses' },
        { id: 14, title: 'The Catcher in the Rye' },
        { id: 15, title: 'The Little Mermaid' },
        { id: 16, title: 'The Secret Garden' },
        { id: 17, title: 'The Wind in the Willows' },
        { id: 18, title: 'The Wizard of Oz' },
        { id: 19, title: 'Madam Bovary' },
        { id: 20, title: 'The Little House' },
        { id: 21, title: 'The Phantom of the Opera' },
        { id: 22, title: 'The Adventures of Tom Sawyer' },
        { id: 23, title: 'The Adventures of Huckleberry Finn' },
        { id: 24, title: 'The Time Machine' },
        { id: 25, title: 'The War of the Worlds' },
    ],
};

const defaultDataProvider = fakeRestProvider(data, undefined, 300);

const BookListView = () => {
    const { data, isPending, sort, setSort, filterValues, setFilters } =
        useListContext();
    if (isPending) {
        return <div>Loading...</div>;
    }
    const toggleSort = () => {
        setSort({
            field: sort.field === 'title' ? 'id' : 'title',
            order: 'ASC',
        });
    };
    const toggleFilter = () => {
        setFilters(filterValues.q ? {} : { q: 'The ' });
    };

    return (
        <div>
            <button onClick={toggleSort}>Toggle Sort</button>
            <button onClick={toggleFilter}>Toggle Filter</button>
            <ul>
                {data?.map((record: any) => (
                    <li key={record.id}>{record.title}</li>
                ))}
            </ul>
        </div>
    );
};

const InfinitePagination = () => {
    const {
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        hasPreviousPage,
        fetchPreviousPage,
        isFetchingPreviousPage,
    } = useInfinitePaginationContext();
    return (
        <div>
            {hasPreviousPage && (
                <button
                    onClick={() => fetchPreviousPage()}
                    disabled={isFetchingPreviousPage}
                >
                    Previous
                </button>
            )}
            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    Next
                </button>
            )}
        </div>
    );
};

export const Basic = () => (
    <CoreAdminContext dataProvider={defaultDataProvider}>
        <InfiniteListBase resource="books" perPage={5}>
            <BookListView />
            <InfinitePagination />
        </InfiniteListBase>
    </CoreAdminContext>
);

export const NoAuthProvider = ({
    dataProvider = defaultDataProvider,
}: {
    dataProvider?: DataProvider;
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <InfiniteListBase resource="books" perPage={5}>
            <BookListView />
        </InfiniteListBase>
    </CoreAdminContext>
);

export const WithAuthProviderNoAccessControl = ({
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => new Promise(resolve => setTimeout(resolve, 300)),
        checkError: () => Promise.resolve(),
    },
    dataProvider = defaultDataProvider,
    InfiniteListProps,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
    InfiniteListProps?: Partial<InfiniteListBaseProps>;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <InfiniteListBase
            resource="books"
            perPage={5}
            authLoading={<div>Authentication loading...</div>}
            {...InfiniteListProps}
        >
            <BookListView />
        </InfiniteListBase>
    </CoreAdminContext>
);

export const AccessControl = ({
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => new Promise(resolve => setTimeout(resolve, 300)),
        checkError: () => Promise.resolve(),
        canAccess: () => new Promise(resolve => setTimeout(resolve, 300, true)),
    },
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <InfiniteListBase
            resource="books"
            perPage={5}
            authLoading={<div>Authentication loading...</div>}
        >
            <BookListView />
        </InfiniteListBase>
    </CoreAdminContext>
);

export const Loading = () => {
    let resolveGetList: (() => void) | null = null;
    const dataProvider = {
        ...defaultDataProvider,
        getList: (resource, params) => {
            return new Promise<GetListResult>(resolve => {
                resolveGetList = () =>
                    resolve(defaultDataProvider.getList(resource, params));
            });
        },
    };

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <button
                onClick={() => {
                    resolveGetList && resolveGetList();
                }}
            >
                Resolve books loading
            </button>
            <InfiniteListBase
                resource="books"
                perPage={5}
                loading={<p>Loading books...</p>}
            >
                <BookListView />
                <InfinitePagination />
            </InfiniteListBase>
        </CoreAdminContext>
    );
};

export const FetchError = () => {
    let rejectGetList: (() => void) | null = null;
    const dataProvider = {
        ...defaultDataProvider,
        getList: () => {
            return new Promise<GetListResult>((_, reject) => {
                rejectGetList = () => reject(new Error('Expected error.'));
            });
        },
    };

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <button
                onClick={() => {
                    rejectGetList && rejectGetList();
                }}
            >
                Reject books loading
            </button>

            <InfiniteListBase
                resource="books"
                perPage={5}
                error={<p>Cannot load books.</p>}
            >
                <BookListView />
                <InfinitePagination />
            </InfiniteListBase>
        </CoreAdminContext>
    );
};

export const Empty = () => {
    let resolveGetList: (() => void) | null = null;
    const dataProvider = {
        ...defaultDataProvider,
        getList: () => {
            return new Promise<GetListResult>(resolve => {
                resolveGetList = () => resolve({ data: [], total: 0 });
            });
        },
    };

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <button
                onClick={() => {
                    resolveGetList && resolveGetList();
                }}
            >
                Resolve books loading
            </button>
            <InfiniteListBase
                resource="books"
                perPage={5}
                loading={<p>Loading...</p>}
                empty={<p>No books</p>}
            >
                <BookListView />
                <InfinitePagination />
            </InfiniteListBase>
        </CoreAdminContext>
    );
};

const defaultI18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? mergeTranslations(frenchMessages, {
                  resources: {
                      books: {
                          name: 'Livre |||| Livres',
                      },
                  },
              })
            : englishMessages,
    'en'
);

const customI18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? mergeTranslations(frenchMessages, {
                  resources: {
                      books: {
                          page: {
                              list: 'Liste des livres',
                          },
                      },
                  },
              })
            : mergeTranslations(englishMessages, {
                  resources: {
                      books: {
                          page: {
                              list: 'Book list',
                          },
                      },
                  },
              }),
    'en'
);

export const DefaultTitle = ({
    translations = 'default',
    i18nProvider = translations === 'default'
        ? defaultI18nProvider
        : customI18nProvider,
}: {
    i18nProvider?: I18nProvider;
    translations?: 'default' | 'resource specific';
}) => (
    <CoreAdminContext
        dataProvider={defaultDataProvider}
        i18nProvider={i18nProvider}
    >
        <InfiniteListBase resource="books" perPage={5}>
            <Title />
        </InfiniteListBase>
    </CoreAdminContext>
);

DefaultTitle.args = {
    translations: 'default',
};
DefaultTitle.argTypes = {
    translations: {
        options: ['default', 'resource specific'],
        control: { type: 'radio' },
    },
};

export const WithRenderProps = () => (
    <CoreAdminContext dataProvider={defaultDataProvider}>
        <InfiniteListBase
            resource="books"
            perPage={5}
            render={context => {
                const {
                    hasNextPage,
                    fetchNextPage,
                    isFetchingNextPage,
                    hasPreviousPage,
                    fetchPreviousPage,
                    isFetchingPreviousPage,
                    setFilters,
                    isPending,
                    setSort,
                    sort,
                    filterValues,
                    data,
                } = context;

                if (isPending) {
                    return <div>Loading...</div>;
                }
                const toggleSort = () => {
                    setSort({
                        field: sort.field === 'title' ? 'id' : 'title',
                        order: 'ASC',
                    });
                };
                const toggleFilter = () => {
                    setFilters(filterValues.q ? {} : { q: 'The ' });
                };

                return (
                    <div>
                        <div>
                            {hasPreviousPage && (
                                <button
                                    onClick={() => fetchPreviousPage()}
                                    disabled={isFetchingPreviousPage}
                                >
                                    Previous
                                </button>
                            )}
                            {hasNextPage && (
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                        <button onClick={toggleSort}>Toggle Sort</button>
                        <button onClick={toggleFilter}>Toggle Filter</button>
                        <ul>
                            {data?.map((record: any) => (
                                <li key={record.id}>{record.title}</li>
                            ))}
                        </ul>
                    </div>
                );
            }}
        />
    </CoreAdminContext>
);

export const Offline = ({
    dataProvider = defaultDataProvider,
    isOnline = true,
    ...props
}: {
    dataProvider?: DataProvider;
    isOnline?: boolean;
} & Partial<InfiniteListBaseProps>) => {
    React.useEffect(() => {
        onlineManager.setOnline(isOnline);
    }, [isOnline]);
    return (
        <TestMemoryRouter>
            <CoreAdminContext dataProvider={dataProvider}>
                <InfiniteListBase
                    resource="books"
                    perPage={5}
                    {...props}
                    offline={<p>You are offline, cannot load data</p>}
                    render={controllerProps => {
                        const {
                            data,
                            error,
                            isPending,
                            page,
                            perPage,
                            setPage,
                            total,
                        } = controllerProps;
                        if (isPending) {
                            return <div>Loading...</div>;
                        }
                        if (error) {
                            return <div>Error...</div>;
                        }

                        return (
                            <div>
                                <p>
                                    Use the story controls to simulate offline
                                    mode:
                                </p>
                                <IsOffline>
                                    <p style={{ color: 'orange' }}>
                                        You are offline, the data may be
                                        outdated
                                    </p>
                                </IsOffline>
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    previous
                                </button>
                                <span>
                                    Page {page} of {Math.ceil(total / perPage)}
                                </span>
                                <button
                                    disabled={page >= total / perPage}
                                    onClick={() => setPage(page + 1)}
                                >
                                    next
                                </button>
                                <ul>
                                    {data.map((record: any) => (
                                        <li key={record.id}>{record.title}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    }}
                />
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

Offline.args = {
    isOnline: true,
};

Offline.argTypes = {
    isOnline: {
        control: { type: 'boolean' },
    },
};

const Title = () => {
    const { defaultTitle } = useListContext();
    const [locale, setLocale] = useLocaleState();
    return (
        <div>
            <strong>
                {defaultTitle} ({locale})
            </strong>
            <div>
                <button onClick={() => setLocale('en')}>EN</button>
                <button onClick={() => setLocale('fr')}>FR</button>
            </div>
        </div>
    );
};
