import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
    Resource,
    useListContext,
    useInfinitePaginationContext,
    TestMemoryRouter,
    IsOffline,
    GetListResult,
} from 'ra-core';
import {
    Alert,
    Box,
    Button,
    Card,
    Stack,
    ThemeOptions,
    Typography,
} from '@mui/material';
import { InfiniteList } from './InfiniteList';
import { SimpleList } from './SimpleList';
import { DataTable, type DataTableProps } from './datatable';
import {
    InfinitePagination,
    Pagination as DefaultPagination,
} from './pagination';
import { AdminUI } from '../AdminUI';
import { AdminContext } from '../AdminContext';
import { SearchInput } from '../input';
import { BulkDeleteButton, SelectAllButton, SortButton } from '../button';
import { TopToolbar, Layout } from '../layout';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { deepmerge } from '@mui/utils';
import { defaultLightTheme } from '../theme';
import { onlineManager } from '@tanstack/react-query';
import { useRef } from 'react';

export default {
    title: 'ra-ui-materialui/list/InfiniteList',
};

const data = {
    books: [
        { id: 1, title: 'War and Peace', author: 'Leo Tolstoy' },
        {
            id: 2,
            title: 'The Little Prince',
            author: 'Antoine de Saint-Exupéry',
        },
        { id: 3, title: "Swann's Way", author: 'Marcel Proust' },
        { id: 4, title: 'A Tale of Two Cities', author: 'Charles Dickens' },
        { id: 5, title: 'The Lord of the Rings', author: 'J. R. R. Tolkien' },
        { id: 6, title: 'And Then There Were None', author: 'Agatha Christie' },
        { id: 7, title: 'Dream of the Red Chamber', author: 'Cao Xueqin' },
        { id: 8, title: 'The Hobbit', author: 'J. R. R. Tolkien' },
        {
            id: 9,
            title: 'She: A History of Adventure',
            author: 'H. Rider Haggard',
        },
        {
            id: 10,
            title: 'The Lion, the Witch and the Wardrobe',
            author: 'C. S. Lewis',
        },
        { id: 11, title: 'The Chronicles of Narnia', author: 'C. S. Lewis' },
        { id: 12, title: 'Pride and Prejudice', author: 'Jane Austen' },
        { id: 13, title: 'Ulysses', author: 'James Joyce' },
        { id: 14, title: 'The Catcher in the Rye', author: 'J. D. Salinger' },
        {
            id: 15,
            title: 'The Little Mermaid',
            author: 'Hans Christian Andersen',
        },
        {
            id: 16,
            title: 'The Secret Garden',
            author: 'Frances Hodgson Burnett',
        },
        { id: 17, title: 'The Wind in the Willows', author: 'Kenneth Grahame' },
        { id: 18, title: 'The Wizard of Oz', author: 'L. Frank Baum' },
        { id: 19, title: 'Madam Bovary', author: 'Gustave Flaubert' },
        { id: 20, title: 'The Little House', author: 'Louisa May Alcott' },
        { id: 21, title: 'The Phantom of the Opera', author: 'Gaston Leroux' },
        { id: 22, title: 'The Adventures of Tom Sawyer', author: 'Mark Twain' },
        {
            id: 23,
            title: 'The Adventures of Huckleberry Finn',
            author: 'Mark Twain',
        },
        { id: 24, title: 'The Time Machine', author: 'H. G. Wells' },
        { id: 25, title: 'The War of the Worlds', author: 'H. G. Wells' },
    ],
};

const dataProvider = fakeRestProvider(
    data,
    process.env.NODE_ENV === 'development',
    500
);

const Admin = ({ children, dataProvider, layout, ...props }: any) => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
            {...props}
        >
            <AdminUI layout={layout}>{children}</AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const bookFilters = [<SearchInput source="q" alwaysOn />];

export const Aside = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList aside={<div>Aside</div>}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Filter = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList filter={{ author: 'H. G. Wells' }}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Filters = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList filters={bookFilters}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const PaginationClassic = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList pagination={<DefaultPagination />}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const PaginationInfinite = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList
                    pagination={<InfinitePagination sx={{ py: 5 }} />}
                >
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

const LoadMore = () => {
    const { hasNextPage, fetchNextPage, isFetchingNextPage } =
        useInfinitePaginationContext();
    return hasNextPage ? (
        <Box mt={1} textAlign="center">
            <Button
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
            >
                Load more
            </Button>
        </Box>
    ) : null;
};

export const PaginationLoadMore = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList pagination={<LoadMore />}>
                    <DataTable>
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col source="author" />
                    </DataTable>
                </InfiniteList>
            )}
        />
    </Admin>
);

const CustomPagination = () => {
    const { total } = useListContext();
    return (
        <>
            <InfinitePagination />
            {total && total > 0 && (
                <Box position="sticky" bottom={0} textAlign="center">
                    <Card
                        elevation={2}
                        sx={{
                            px: 2,
                            py: 1,
                            mb: 1,
                            display: 'inline-block',
                        }}
                    >
                        <Typography variant="body2">{total} results</Typography>
                    </Card>
                </Box>
            )}
        </>
    );
};

export const PaginationCustom = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList pagination={<CustomPagination />}>
                    <DataTable>
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col source="author" />
                    </DataTable>
                </InfiniteList>
            )}
        />
    </Admin>
);

export const PerPage = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList perPage={5}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

// Useful to check that on a large window, the list fetches beyond page 2
export const PerPageSmall = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList perPage={1}>
                    <DataTable>
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col source="author" />
                    </DataTable>
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Sort = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList sort={{ field: 'title', order: 'ASC' }}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Title = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList title="The Books">
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

const LayoutWithFooter = ({ children }) => (
    <>
        <Layout>{children}</Layout>
        <div style={{ height: '100px', backgroundColor: 'red' }}>Footer</div>
    </>
);

export const WithFooter = () => (
    <Admin dataProvider={dataProvider} layout={LayoutWithFooter}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const WithDatagrid = ({
    bulkActionsToolbar,
}: {
    bulkActionsToolbar?: DataTableProps['bulkActionsToolbar'];
}) => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList>
                    <DataTable bulkActionsToolbar={bulkActionsToolbar}>
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col source="author" />
                    </DataTable>
                </InfiniteList>
            )}
        />
    </Admin>
);

export const WithDatagridAndSelectAllLimit = ({
    limit = 23,
}: {
    limit?: number;
}) => (
    <WithDatagrid
        bulkActionsToolbar={
            <BulkActionsToolbar
                selectAllButton={<SelectAllButton limit={limit} />}
            >
                <BulkDeleteButton />
            </BulkActionsToolbar>
        }
    />
);

const BookActions = () => (
    <TopToolbar>
        <SortButton fields={['id', 'title']} />
    </TopToolbar>
);

export const WithSimpleList = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList filters={bookFilters} actions={<BookActions />}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const PartialPagination = () => (
    <Admin
        dataProvider={{
            ...dataProvider,
            getList: (resource, params) =>
                dataProvider
                    .getList(resource, params)
                    .then(({ data, total }) => ({
                        data,
                        pageInfo: {
                            hasNextPage:
                                total! >
                                params.pagination.page *
                                    params.pagination.perPage,
                            hasPreviousPage: params.pagination.page > 1,
                        },
                    })),
        }}
    >
        <Resource
            name="books"
            list={() => (
                <InfiniteList>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Themed = () => (
    <Admin
        dataProvider={dataProvider}
        theme={deepmerge(defaultLightTheme, {
            components: {
                RaInfiniteList: {
                    defaultProps: {
                        className: 'custom-class',
                        perPage: 5,
                    },
                },
                RaList: {
                    styleOverrides: {
                        root: {
                            background: 'pink',

                            ['& .MuiListItemText-primary']: {
                                color: 'hotpink',
                                fontWeight: 'bold',
                            },
                        },
                    },
                },
            },
        } as ThemeOptions)}
    >
        <Resource
            name="books"
            list={() => (
                <InfiniteList data-testid={'themed-list'}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const WithRenderProp = () => (
    <Admin
        dataProvider={{
            ...dataProvider,
            getList: (resource, params) =>
                dataProvider
                    .getList(resource, params)
                    .then(({ data, total }) => ({
                        data,
                        pageInfo: {
                            hasNextPage:
                                total! >
                                params.pagination.page *
                                    params.pagination.perPage,
                            hasPreviousPage: params.pagination.page > 1,
                        },
                    })),
        }}
    >
        <Resource
            name="books"
            list={() => (
                <InfiniteList
                    render={({ error, isPending }) => {
                        if (isPending) {
                            return <div>Loading...</div>;
                        }
                        if (error) {
                            return <div>Error: {error.message}</div>;
                        }
                        return (
                            <SimpleList
                                primaryText="%{title}"
                                secondaryText="%{author}"
                                tertiaryText={record => record.year}
                            />
                        );
                    }}
                />
            )}
        />
    </Admin>
);

export const Offline = ({
    isOnline = true,
    offline,
    pagination,
}: {
    isOnline?: boolean;
    offline?: React.ReactNode;
    pagination?: React.ReactNode;
}) => {
    React.useEffect(() => {
        onlineManager.setOnline(isOnline);
    }, [isOnline]);
    return (
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <InfiniteList offline={offline} pagination={pagination}>
                        <BookListOffline />
                    </InfiniteList>
                )}
            />
        </Admin>
    );
};

const BookListOffline = () => {
    const { error, isPending } = useListContext();
    if (isPending) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <>
            <IsOffline>
                <Alert severity="warning">
                    You are offline, the data may be outdated
                </Alert>
            </IsOffline>
            <SimpleList primaryText="%{title}" secondaryText="%{author}" />
        </>
    );
};

const CustomOffline = () => {
    return <Alert severity="warning">You are offline!</Alert>;
};

Offline.args = {
    isOnline: true,
    offline: 'default',
    pagination: 'infinite',
};

Offline.argTypes = {
    isOnline: {
        control: { type: 'boolean' },
    },
    pagination: {
        control: { type: 'radio' },
        options: ['infinite', 'classic'],
        mapping: {
            infinite: <InfinitePagination />,
            classic: <DefaultPagination />,
        },
    },
    offline: {
        name: 'Offline component',
        control: { type: 'radio' },
        options: ['default', 'custom'],
        mapping: {
            default: undefined,
            custom: <CustomOffline />,
        },
    },
};

export const FetchError = ({ error }: { error?: React.ReactNode }) => {
    const resolveGetList = useRef<(() => void) | null>(null);
    const rejectGetList = useRef<(() => void) | null>(null);
    const errorDataProvider = {
        ...dataProvider,
        getList: (resource, params) => {
            return new Promise<GetListResult>((resolve, reject) => {
                resolveGetList.current = () => {
                    resolve(dataProvider.getList(resource, params));
                    resolveGetList.current = null;
                    rejectGetList.current = null;
                };
                rejectGetList.current = () => {
                    reject(new Error('Expected error.'));
                    resolveGetList.current = null;
                    rejectGetList.current = null;
                };
            });
        },
    };

    return (
        <Admin
            dataProvider={errorDataProvider}
            layout={({ children }) => (
                <Layout>
                    <Stack direction="row">
                        {rejectGetList.current && (
                            <Button
                                onClick={() => {
                                    rejectGetList.current &&
                                        rejectGetList.current();
                                }}
                                sx={{ flex: 1 }}
                            >
                                Reject loading
                            </Button>
                        )}
                        {resolveGetList.current && (
                            <Button
                                onClick={() => {
                                    resolveGetList.current &&
                                        resolveGetList.current();
                                }}
                                sx={{ flex: 1 }}
                            >
                                Resolve loading
                            </Button>
                        )}
                    </Stack>
                    {children}
                </Layout>
            )}
        >
            <Resource
                name="books"
                list={() => (
                    <InfiniteList
                        loading={<div>Loading...</div>}
                        error={error}
                        pagination={<InfinitePagination />}
                    >
                        <SimpleList
                            primaryText="%{title}"
                            secondaryText="%{author}"
                        />
                    </InfiniteList>
                )}
            />
        </Admin>
    );
};

const CustomError = () => {
    return <Alert severity="error">Something went wrong!</Alert>;
};

FetchError.args = {
    error: 'custom',
};

FetchError.argTypes = {
    error: {
        name: 'Error component',
        control: { type: 'radio' },
        options: ['default', 'custom'],
        mapping: {
            default: undefined,
            custom: <CustomError />,
        },
    },
};
