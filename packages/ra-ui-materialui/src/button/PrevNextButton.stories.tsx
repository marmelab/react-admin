import * as React from 'react';
import { AdminContext } from '../AdminContext';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Resource } from 'ra-core';
import {
    AdminUI,
    Datagrid,
    Edit,
    List,
    PrevNextButton,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
} from 'react-admin';

export default { title: 'ra-ui-materialui/button/PrevNextButton' };

const dataProvider = fakeRestDataProvider({
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
        },
        {
            id: 2,
            title: 'Pride and Predjudice',
            author: 'Jane Austen',
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
        },
        {
            id: 5,
            title: "Alice's Adventures in Wonderland",
            author: 'Lewis Carroll',
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
        },
        {
            id: 8,
            title: "Harry Potter and the Philosopher's Stone",
            author: 'J. K. Rowling',
        },
        {
            id: 9,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
        },
        {
            id: 10,
            title: 'A Catcher in the Rye',
            author: 'J. D. Salinger',
        },
        {
            id: 11,
            title: 'Ulysses',
            author: 'James Joyce',
        },
    ],
});

const ListBook = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <TextField source="author" />
        </Datagrid>
    </List>
);

const EditBook = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="author" />
            <PrevNextButton />
        </SimpleForm>
    </Edit>
);

const ShowBook = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="author" />
            <PrevNextButton />
        </SimpleShowLayout>
    </Show>
);

export const Basic = () => (
    <AdminContext dataProvider={dataProvider}>
        <AdminUI>
            <Resource
                name="books"
                list={ListBook}
                edit={EditBook}
                show={ShowBook}
            />
        </AdminUI>
    </AdminContext>
);
