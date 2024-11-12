import * as React from 'react';
import {
    useList,
    useListContext,
    ListContextProvider,
    Resource,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Box, Typography, Card, CardContent } from '@mui/material';
import MailIcon from '@mui/icons-material/MailOutline';
import CategoryIcon from '@mui/icons-material/LocalOffer';
import BiotechIcon from '@mui/icons-material/Biotech';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

import { FilterList } from './FilterList';
import { FilterListItem } from './FilterListItem';
import { AdminContext } from '../../AdminContext';
import { AdminUI } from '../../AdminUI';
import { List } from '../List';
import { Datagrid } from '../datagrid/Datagrid';
import { TextField } from '../../field';

export default { title: 'ra-ui-materialui/list/filter/FilterList' };

export const Basic = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterList label="Category" icon={<CategoryIcon />}>
                        <FilterListItem
                            label="Tests"
                            value={{ category: 'tests' }}
                        />
                        <FilterListItem
                            label="News"
                            value={{ category: 'news' }}
                        />
                        <FilterListItem
                            label="Deals"
                            value={{ category: 'deals' }}
                        />
                        <FilterListItem
                            label="Tutorials"
                            value={{ category: 'tutorials' }}
                        />
                    </FilterList>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

export const Icon = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterList label="Category" icon={<CategoryIcon />}>
                        <FilterListItem
                            label="Tests"
                            value={{ category: 'tests' }}
                            icon={<BiotechIcon />}
                        />
                        <FilterListItem
                            label="News"
                            value={{ category: 'news' }}
                            icon={<NewspaperIcon />}
                        />
                        <FilterListItem
                            label="Deals"
                            value={{ category: 'deals' }}
                            icon={<LocalOfferIcon />}
                        />
                        <FilterListItem
                            label="Tutorials"
                            value={{ category: 'tutorials' }}
                            icon={<HelpCenterIcon />}
                        />
                    </FilterList>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

export const Cumulative = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Article test', category: 'tests' },
            { id: 2, title: 'Article news', category: 'news' },
            { id: 3, title: 'Article deals', category: 'deals' },
            { id: 4, title: 'Article tutorials', category: 'tutorials' },
        ],
        filter: {
            category: ['tutorials', 'news'],
        },
    });
    const isSelected = (value, filters) => {
        const category = filters.category || [];
        return category.includes(value.category);
    };

    const toggleFilter = (value, filters) => {
        const category = filters.category || [];
        return {
            ...filters,
            category: category.includes(value.category)
                ? category.filter(v => v !== value.category)
                : [...category, value.category],
        };
    };
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList label="Categories" icon={<CategoryIcon />}>
                        <FilterListItem
                            label="Tests"
                            value={{ category: 'tests' }}
                            isSelected={isSelected}
                            toggleFilter={toggleFilter}
                        />
                        <FilterListItem
                            label="News"
                            value={{ category: 'news' }}
                            isSelected={isSelected}
                            toggleFilter={toggleFilter}
                        />
                        <FilterListItem
                            label="Deals"
                            value={{ category: 'deals' }}
                            isSelected={isSelected}
                            toggleFilter={toggleFilter}
                        />
                        <FilterListItem
                            label="Tutorials"
                            value={{ category: 'tutorials' }}
                            isSelected={isSelected}
                            toggleFilter={toggleFilter}
                        />
                    </FilterList>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

const FilterValue = () => {
    const { filterValues } = useListContext();
    return (
        <Box sx={{ margin: '1em' }}>
            <Typography>Filter values:</Typography>
            <pre>{JSON.stringify(filterValues, null, 2)}</pre>
            <pre style={{ display: 'none' }}>
                {JSON.stringify(filterValues)}
            </pre>
        </Box>
    );
};

const dataProvider = fakeRestDataProvider({
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
    authors: [],
});

const BookListAside = () => (
    <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
        <CardContent>
            <FilterList label="Century" icon={<CategoryIcon />}>
                <FilterListItem
                    label="21st"
                    value={{ year_gte: 2000, year_lte: null }}
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
    <List aside={<BookListAside />}>
        <Datagrid>
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

export const FullApp = () => (
    <AdminContext dataProvider={dataProvider}>
        <AdminUI>
            <Resource name="books" list={BookList} />
        </AdminUI>
    </AdminContext>
);
