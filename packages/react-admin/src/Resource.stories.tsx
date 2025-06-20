import * as React from 'react';
import { Route, Link, useParams } from 'react-router-dom';
import {
    Admin,
    Resource,
    Datagrid,
    List,
    TextField,
    EditGuesser,
    EditButton,
    useRecordContext,
} from './';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Button } from '@mui/material';

export default {
    title: 'react-admin/Resource',
};

const dataProvider = fakeRestDataProvider(
    {
        books: [
            {
                id: 1,
                title: 'War and Peace',
                authorId: 1,
                year: 1869,
            },
            {
                id: 2,
                title: 'Anna Karenina',
                authorId: 1,
                year: 1877,
            },
            {
                id: 3,
                title: 'Pride and Predjudice',
                authorId: 2,
                year: 1813,
            },
            {
                id: 4,
                authorId: 2,
                title: 'Sense and Sensibility',
                year: 1811,
            },
            {
                id: 5,
                title: 'The Picture of Dorian Gray',
                authorId: 3,
                year: 1890,
            },
            {
                id: 6,
                title: 'Le Petit Prince',
                authorId: 4,
                year: 1943,
            },
            {
                id: 7,
                title: "Alice's Adventures in Wonderland",
                authorId: 5,
                year: 1865,
            },
            {
                id: 8,
                title: 'Madame Bovary',
                authorId: 6,
                year: 1856,
            },
            { id: 9, title: 'The Hobbit', authorId: 7, year: 1937 },
            {
                id: 10,
                title: 'The Lord of the Rings',
                authorId: 7,
                year: 1954,
            },
            {
                id: 11,
                title: "Harry Potter and the Philosopher's Stone",
                authorId: 8,
                year: 1997,
            },
            {
                id: 12,
                title: 'The Alchemist',
                authorId: 9,
                year: 1988,
            },
            {
                id: 13,
                title: 'A Catcher in the Rye',
                authorId: 10,
                year: 1951,
            },
            {
                id: 14,
                title: 'Ulysses',
                authorId: 11,
                year: 1922,
            },
        ],
        authors: [
            { id: 1, firstName: 'Leo', lastName: 'Tolstoy' },
            { id: 2, firstName: 'Jane', lastName: 'Austen' },
            { id: 3, firstName: 'Oscar', lastName: 'Wilde' },
            { id: 4, firstName: 'Antoine', lastName: 'de Saint-Exupéry' },
            { id: 5, firstName: 'Lewis', lastName: 'Carroll' },
            { id: 6, firstName: 'Gustave', lastName: 'Flaubert' },
            { id: 7, firstName: 'J. R. R.', lastName: 'Tolkien' },
            { id: 8, firstName: 'J. K.', lastName: 'Rowling' },
            { id: 9, firstName: 'Paulo', lastName: 'Coelho' },
            { id: 10, firstName: 'J. D.', lastName: 'Salinger' },
            { id: 11, firstName: 'James', lastName: 'Joyce' },
        ],
    },
    true
);

const BooksButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/authors/${record.id}/books`}
            color="primary"
        >
            Books
        </Button>
    );
};

const AuthorList = () => (
    <List>
        <Datagrid rowClick={false}>
            <TextField source="id" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <EditButton />
            <BooksButton />
        </Datagrid>
    </List>
);

const BookList = () => {
    const { authorId } = useParams();
    return (
        <List resource="books" filter={{ authorId }}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="year" />
            </Datagrid>
        </List>
    );
};

export const Nested = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="authors" list={AuthorList} edit={EditGuesser}>
            <Route path=":authorId/books" element={<BookList />} />
        </Resource>
    </Admin>
);
