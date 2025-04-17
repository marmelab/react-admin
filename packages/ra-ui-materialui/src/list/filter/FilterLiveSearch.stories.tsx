import * as React from 'react';
import {
    Box,
    Card,
    CardContent,
    createTheme,
    List,
    ListItem,
    ListItemText,
    ThemeProvider,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/LocalOffer';
import {
    ListContextProvider,
    ResourceContextProvider,
    TestMemoryRouter,
    useList,
    useListContext,
    Resource,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { TextInput } from '../../input';
import { defaultTheme } from '../../theme/defaultTheme';
import { FilterButton } from './FilterButton';
import { FilterForm } from './FilterForm';
import { FilterLiveSearch } from './FilterLiveSearch';
import {
    Datagrid,
    ListGuesser,
    TextField,
    List as RaList,
    FilterList,
    FilterListItem,
    AdminContext,
    AdminUI,
} from '../..';

export default {
    title: 'ra-ui-materialui/list/filter/FilterLiveSearch',
};

const countries = [
    { id: 1, name: 'Austria' },
    { id: 2, name: 'Belgium' },
    { id: 3, name: 'Bulgaria' },
    { id: 4, name: 'Croatia' },
    { id: 5, name: 'Republic of Cyprus' },
    { id: 6, name: 'Czech Republic' },
    { id: 7, name: 'Denmark' },
    { id: 8, name: 'Estonia' },
    { id: 9, name: 'Finland' },
    { id: 10, name: 'France' },
    { id: 11, name: 'Germany' },
    { id: 12, name: 'Greece' },
    { id: 13, name: 'Hungary' },
    { id: 14, name: 'Ireland' },
    { id: 15, name: 'Italy' },
    { id: 16, name: 'Latvia' },
    { id: 17, name: 'Lithuania' },
    { id: 18, name: 'Luxembourg' },
    { id: 19, name: 'Malta' },
    { id: 20, name: 'Netherlands' },
    { id: 21, name: 'Poland' },
    { id: 22, name: 'Portugal' },
    { id: 23, name: 'Romania' },
    { id: 24, name: 'Slovakia' },
    { id: 25, name: 'Slovenia' },
    { id: 26, name: 'Spain' },
    { id: 27, name: 'Sweden' },
];

const Wrapper = ({ children }) => (
    <ThemeProvider theme={createTheme(defaultTheme)}>
        <ListContextProvider value={useList({ data: countries })}>
            <Box m={2}>{children}</Box>
        </ListContextProvider>
    </ThemeProvider>
);

const CountryList = () => {
    const { data } = useListContext();
    return (
        <List>
            {data?.map(record => (
                <ListItem key={record.id} disablePadding>
                    <ListItemText>{record.name}</ListItemText>
                </ListItem>
            ))}
        </List>
    );
};

export const Basic = () => (
    <Wrapper>
        <FilterLiveSearch source="q" />
        <CountryList />
    </Wrapper>
);

export const Label = () => (
    <Wrapper>
        <FilterLiveSearch source="q" label="search" />
        <CountryList />
    </Wrapper>
);

export const HiddenLabel = () => (
    <Wrapper>
        <FilterLiveSearch source="q" hiddenLabel />
        <CountryList />
    </Wrapper>
);

export const Variant = () => (
    <Wrapper>
        <FilterLiveSearch source="q" variant="outlined" />
        <CountryList />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <FilterLiveSearch source="q" fullWidth={false} />
        <CountryList />
    </Wrapper>
);

export const Sx = () => (
    <Wrapper>
        <FilterLiveSearch source="q" sx={{ width: 300 }} />
        <CountryList />
    </Wrapper>
);

const countryFilters = [<TextInput source="q" alwaysOn />];
export const WithFilterButton = () => (
    <TestMemoryRouter>
        <ResourceContextProvider value="countries">
            <Wrapper>
                <FilterLiveSearch source="q" />
                <FilterForm filters={countryFilters} />
                <FilterButton filters={countryFilters} />
                <CountryList />
            </Wrapper>
        </ResourceContextProvider>
    </TestMemoryRouter>
);

const dataProvider = fakeRestDataProvider(
    {
        books: [
            {
                id: 1,
                title: 'War and Peace',
                author: 'Leo Tolstoy',
                year: 1869,
            },
            {
                id: 2,
                title: 'Pride and Predjudice',
                author: 'Jane Austen',
                year: 1813,
            },
            {
                id: 3,
                title: 'The Picture of Dorian Gray',
                author: 'Oscar Wilde',
                year: 1890,
            },
            {
                id: 4,
                title: 'Le Petit Prince',
                author: 'Antoine de Saint-Exupéry',
                year: 1943,
            },
            {
                id: 5,
                title: "Alice's Adventures in Wonderland",
                author: 'Lewis Carroll',
                year: 1865,
            },
            {
                id: 6,
                title: 'Madame Bovary',
                author: 'Gustave Flaubert',
                year: 1856,
            },
            {
                id: 7,
                title: 'The Lord of the Rings',
                author: 'J. R. R. Tolkien',
                year: 1954,
            },
            {
                id: 8,
                title: "Harry Potter and the Philosopher's Stone",
                author: 'J. K. Rowling',
                year: 1997,
            },
            {
                id: 9,
                title: 'The Alchemist',
                author: 'Paulo Coelho',
                year: 1988,
            },
            {
                id: 10,
                title: 'A Catcher in the Rye',
                author: 'J. D. Salinger',
                year: 1951,
            },
            {
                id: 11,
                title: 'Ulysses',
                author: 'James Joyce',
                year: 1922,
            },
        ],
        countries,
    },
    process.env.NODE_ENV === 'development'
);

const BookListAside = () => (
    <Card sx={{ order: -1, mr: 2, mt: 6, width: 250, height: 'fit-content' }}>
        <CardContent>
            <FilterLiveSearch />
            <FilterList label="Century" icon={<CategoryIcon />}>
                <FilterListItem
                    label="21st"
                    value={{ year_gte: 2000, year_lte: undefined }}
                />
                <FilterListItem
                    label="20th"
                    value={{ year_gte: 1900, year_lte: 1999 }}
                />
                <FilterListItem
                    label="19th"
                    value={{ year_gte: 1800, year_lte: 1899 }}
                />
            </FilterList>
        </CardContent>
    </Card>
);

const BookList = () => (
    <RaList aside={<BookListAside />}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </RaList>
);

export const FullApp = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => englishMessages, 'en')}
    >
        <AdminUI>
            <Resource name="books" list={BookList} />
            <Resource name="countries" list={ListGuesser} />
        </AdminUI>
    </AdminContext>
);
