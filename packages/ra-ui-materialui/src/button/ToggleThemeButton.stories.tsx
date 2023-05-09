import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { createMemoryHistory } from 'history';

import { List, Datagrid } from '../list';
import { TextField } from '../field';
import { AppBar, Layout, TitlePortal } from '../layout';
import { ToggleThemeButton } from './ToggleThemeButton';

export default { title: 'ra-ui-materialui/button/ToggleThemeButton' };

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

const history = createMemoryHistory({ initialEntries: ['/books'] });

const BookList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

export const Basic = () => (
    <Admin
        dataProvider={dataProvider}
        history={history}
        darkTheme={{ palette: { mode: 'dark' } }}
    >
        <Resource name="books" list={BookList} />
    </Admin>
);

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <ToggleThemeButton darkTheme={{ palette: { mode: 'dark' } }} />
    </AppBar>
);
const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;

export const Legacy = () => (
    <Admin dataProvider={dataProvider} history={history} layout={MyLayout}>
        <Resource name="books" list={BookList} />
    </Admin>
);
