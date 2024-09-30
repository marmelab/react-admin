import * as React from 'react';
import { Admin, AutocompleteInput } from 'react-admin';
import {
    CustomRoutes,
    Resource,
    useListContext,
    TestMemoryRouter,
    DataProvider,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Box, Card, Typography, Button, Link as MuiLink } from '@mui/material';

import { List } from './List';
import { SimpleList } from './SimpleList';
import { ListActions } from './ListActions';
import { Datagrid } from './datagrid';
import { TextField } from '../field';
import { SearchInput, TextInput } from '../input';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { ListButton } from '../button';
import { ShowGuesser } from '../detail';
import TopToolbar from '../layout/TopToolbar';

export default { title: 'ra-ui-materialui/list/List' };

const data = {
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            year: 1869,
            summary:
                'A historical novel that intertwines the lives of Russian aristocrats with the events of the Napoleonic wars.',
        },
        {
            id: 2,
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            year: 1813,
            summary:
                'A romantic novel exploring the themes of class, family, and societal expectations through the story of Elizabeth Bennet and Mr. Darcy.',
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
            year: 1890,
            summary:
                'A philosophical tale about a man who remains youthful while a portrait of him ages, reflecting his moral corruption.',
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
            year: 1943,
            summary:
                'A poetic and philosophical story about a young prince’s journey across planets, exploring themes of innocence and human nature.',
        },
        {
            id: 5,
            title: "Alice's Adventures in Wonderland",
            author: 'Lewis Carroll',
            year: 1865,
            summary:
                'A fantasy tale where Alice falls into a whimsical world, encountering strange creatures and exploring absurd adventures.',
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            year: 1856,
            summary:
                'A story of a dissatisfied woman trapped in provincial life, leading her to pursue romantic fantasies with tragic consequences.',
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            year: 1954,
            summary:
                'An epic fantasy novel following a group of heroes as they attempt to destroy a powerful ring and defeat the dark lord Sauron.',
        },
        {
            id: 8,
            title: "Harry Potter and the Philosopher's Stone",
            author: 'J. K. Rowling',
            year: 1997,
            summary:
                'The beginning of Harry Potter’s magical journey at Hogwarts, where he uncovers secrets about his past and faces dark forces.',
        },
        {
            id: 9,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            year: 1988,
            summary:
                'A spiritual novel that follows a young shepherd on a journey to find treasure, exploring themes of destiny and self-discovery.',
        },
        {
            id: 10,
            title: 'The Catcher in the Rye',
            author: 'J. D. Salinger',
            year: 1951,
            summary:
                'A coming-of-age story about Holden Caulfield, a rebellious teenager navigating feelings of alienation and identity in post-war America.',
        },
        {
            id: 11,
            title: 'Ulysses',
            author: 'James Joyce',
            year: 1922,
            summary:
                'A modernist novel that chronicles the experiences of Leopold Bloom in Dublin, reflecting the complexity of human thought and life.',
        },
        {
            id: 12,
            title: 'One Hundred Years of Solitude',
            author: 'Gabriel García Márquez',
            year: 1967,
            summary:
                'A multi-generational tale of the Buendía family, blending reality and magic in the fictional town of Macondo.',
        },
        {
            id: 13,
            title: 'Snow Country',
            author: 'Yasunari Kawabata',
            year: 1956,
            summary:
                'A tragic love story set in Japan’s remote snowy regions, exploring beauty, isolation, and fleeting relationships.',
        },
    ],
    authors: [],
};

const dataProvider = fakeRestDataProvider(data);

const BookList = () => {
    const { error, isPending } = useListContext();
    if (isPending) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <SimpleList
            primaryText="%{title} (%{year})"
            secondaryText="%{summary}"
            tertiaryText={record => record.year}
        />
    );
};

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List
                        actions={
                            <Box sx={{ backgroundColor: 'info.main' }}>
                                Actions
                            </Box>
                        }
                    >
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Filters = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List
                        filters={[
                            <SearchInput source="q" alwaysOn />,
                            <AutocompleteInput
                                source="title"
                                optionValue="title"
                                optionText="title"
                                choices={data.books}
                            />,
                            <AutocompleteInput
                                source="author"
                                optionValue="author"
                                optionText="author"
                                choices={data.books}
                            />,
                            <TextInput source="year" />,
                        ]}
                    >
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Filter = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List filter={{ id: 2 }}>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List title="Custom list title">
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleElement = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List title={<span>Custom list title</span>}>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleFalse = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List title={false}>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const HasCreate = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List actions={<ListActions hasCreate />}>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List aside={<AsideComponent />}>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const CustomWrapper = ({ children }) => (
    <Box
        sx={{ padding: 2, width: 200, border: 'solid 1px black' }}
        data-testid="custom-component"
    >
        {children}
    </Box>
);

export const Component = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List component={CustomWrapper}>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const PartialPagination = () => (
    <TestMemoryRouter initialEntries={['/authors']}>
        <Admin
            dataProvider={
                {
                    getList: async (_resource, _params) => ({
                        data: [
                            {
                                id: 1,
                                name: 'John Doe',
                            },
                        ],
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                        },
                    }),
                } as DataProvider
            }
        >
            <Resource
                name="authors"
                list={() => (
                    <List pagination={false}>
                        <SimpleList primaryText="%{name}" />
                    </List>
                )}
                create={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Empty = () => (
    <TestMemoryRouter initialEntries={['/authors']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="authors"
                list={() => (
                    <List>
                        <span />
                    </List>
                )}
                create={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const EmptyPartialPagination = () => (
    <TestMemoryRouter initialEntries={['/authors']}>
        <Admin
            dataProvider={
                {
                    getList: async (_resource, _params) => ({
                        data: [],
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                        },
                    }),
                } as unknown as DataProvider
            }
        >
            <Resource
                name="authors"
                list={() => (
                    <List pagination={false}>
                        <SimpleList primaryText="%{name}" />
                    </List>
                )}
                create={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);

export const SX = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List
                        sx={{
                            backgroundColor: 'yellow',
                            '& .RaList-content': {
                                backgroundColor: 'red',
                            },
                        }}
                    >
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Meta = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin
            dataProvider={
                {
                    ...dataProvider,
                    getList: (resource, params) => {
                        console.log('getList', resource, params);
                        return dataProvider.getList(resource, params);
                    },
                } as any
            }
        >
            <Resource
                name="books"
                list={() => (
                    <List queryOptions={{ meta: { foo: 'bar' } }}>
                        <Datagrid>
                            <TextField source="id" />
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="year" />
                        </Datagrid>
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Default = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={() => (
                    <List filters={[<SearchInput source="q" alwaysOn />]}>
                        <Datagrid>
                            <TextField source="id" />
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="year" />
                        </Datagrid>
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const NewerBooks = () => (
    <List
        resource="books"
        storeKey="newerBooks"
        sort={{ field: 'year', order: 'DESC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const OlderBooks = () => (
    <List
        resource="books"
        storeKey="olderBooks"
        sort={{ field: 'year', order: 'ASC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const StoreKeyDashboard = () => (
    <>
        <Box>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/newerBooks"
                variant="contained"
            >
                See newer books
            </Button>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/olderBooks"
                variant="contained"
            >
                See older books
            </Button>
        </Box>
    </>
);

export const StoreKey = () => (
    <TestMemoryRouter initialEntries={['/']}>
        <Admin dataProvider={dataProvider} dashboard={StoreKeyDashboard}>
            <CustomRoutes>
                <Route path="/newerBooks" element={<NewerBooks />} />
                <Route path="/olderBooks" element={<OlderBooks />} />
            </CustomRoutes>
            <Resource name="books" />
        </Admin>
    </TestMemoryRouter>
);

const BooksWithStoreEnabled = () => (
    <List
        resource="books"
        storeKey="booksStore"
        sort={{ field: 'year', order: 'DESC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const BooksWithStoreDisabled = () => (
    <List
        resource="books"
        storeKey={false}
        sort={{ field: 'year', order: 'ASC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

const DisabledStoreDashboard = () => (
    <>
        <Box>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/store"
                variant="contained"
            >
                See books with store enabled
            </Button>
            <Button
                component={Link}
                sx={{ margin: 2 }}
                to="/nostore"
                variant="contained"
            >
                See books with store disabled
            </Button>
        </Box>
    </>
);

export const StoreDisabled = () => {
    return (
        <TestMemoryRouter initialEntries={['/']}>
            <Admin
                dataProvider={dataProvider}
                dashboard={DisabledStoreDashboard}
            >
                <CustomRoutes>
                    <Route path="/store" element={<BooksWithStoreEnabled />} />
                    <Route
                        path="/nostore"
                        element={<BooksWithStoreDisabled />}
                    />
                </CustomRoutes>
                <Resource name="books" />
            </Admin>
        </TestMemoryRouter>
    );
};

const BooksWithLocationDisabled = () => (
    <List
        resource="books"
        storeKey="booksParams"
        disableSyncWithLocation
        sort={{ field: 'year', order: 'ASC' }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

export const LocationNotSyncWithStore = () => {
    const ShowActions = () => (
        <TopToolbar>
            <ListButton label="ra.action.back" />
        </TopToolbar>
    );

    return (
        <TestMemoryRouter initialEntries={['/']}>
            <Admin dataProvider={dataProvider}>
                <Resource
                    name="books"
                    list={<BooksWithLocationDisabled />}
                    edit={
                        <ShowGuesser
                            enableLog={false}
                            actions={<ShowActions />}
                        />
                    }
                />
            </Admin>
        </TestMemoryRouter>
    );
};

export const ErrorInFetch = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin
            dataProvider={
                {
                    getList: () =>
                        Promise.reject(new Error('Error in dataProvider')),
                } as any
            }
        >
            <Resource
                name="books"
                list={() => (
                    <List>
                        <BookList />
                    </List>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const Facets = () => {
    const { isPending, error, meta } = useListContext();
    if (isPending || error) return null;
    return (
        <Box order={-1} width={200} mt={7}>
            <Typography variant="subtitle2" gutterBottom>
                Genres
            </Typography>
            <Typography
                component="ul"
                p={0}
                sx={{ listStylePosition: 'inside' }}
            >
                {meta.genres.map(facet => (
                    <li key={facet.value}>
                        <MuiLink href="#">
                            {facet.value} ({facet.count})
                        </MuiLink>
                    </li>
                ))}
            </Typography>
            <Typography variant="subtitle2" gutterBottom mt={2}>
                Century
            </Typography>
            <Typography
                component="ul"
                p={0}
                sx={{ listStylePosition: 'inside' }}
            >
                {meta.centuries.map(facet => (
                    <li key={facet.value}>
                        <MuiLink href="#">
                            {facet.value} ({facet.count})
                        </MuiLink>
                    </li>
                ))}
            </Typography>
        </Box>
    );
};
export const ResponseMetadata = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <Admin
            dataProvider={{
                ...dataProvider,
                getList: async (resource, params) => {
                    const result = await dataProvider.getList(resource, params);
                    return {
                        ...result,
                        meta: {
                            genres: [
                                { value: 'Fictions', count: 168 },
                                { value: 'Essays', count: 24 },
                            ],
                            centuries: [
                                { value: '18th', count: 23 },
                                { value: '19th', count: 78 },
                                { value: '20th', count: 57 },
                                { value: '21st', count: 34 },
                            ],
                        },
                    };
                },
            }}
        >
            <Resource
                name="books"
                list={
                    <List aside={<Facets />}>
                        <BookList />
                    </List>
                }
            />
        </Admin>
    </TestMemoryRouter>
);
