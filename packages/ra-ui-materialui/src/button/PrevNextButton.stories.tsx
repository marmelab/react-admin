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
import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

export default { title: 'ra-ui-materialui/button/PrevNextButton' };

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

const dataProvider = fakeRestDataProvider({
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            genre: 'Historical novel',
        },
        {
            id: 2,
            title: 'Pride and Predjudice',
            author: 'Jane Austen',
            genre: 'Romance novel',
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
            genre: 'Philosophical fiction',
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
            genre: 'Novel',
        },
        {
            id: 5,
            title: "Alice's Adventures in Wonderland",
            author: 'Lewis Carroll',
            genre: 'Fantasy',
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            genre: 'Novel',
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            genre: 'Fantasy',
        },
        {
            id: 8,
            title: "Harry Potter and the Philosopher's Stone",
            author: 'J. K. Rowling',
            genre: 'Fantasy',
        },
        {
            id: 9,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            genre: 'Fantasy',
        },
        {
            id: 10,
            title: 'A Catcher in the Rye',
            author: 'J. D. Salinger',
            genre: 'Realistic fiction',
        },
        {
            id: 11,
            title: 'Ulysses',
            author: 'James Joyce',
            genre: 'Modernist novel',
        },
    ],
});

export const Basic = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource
                name="books"
                list={
                    <List
                        filters={[
                            <TextInput label="Search" source="q" alwaysOn />,
                        ]}
                    >
                        <Datagrid rowClick="edit">
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="genre" />
                        </Datagrid>
                    </List>
                }
                edit={
                    <Edit>
                        <SimpleForm>
                            <TextInput source="title" />
                            <TextInput source="author" />
                            <TextInput source="genre" />
                            <PrevNextButton />
                        </SimpleForm>
                    </Edit>
                }
                show={
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="genre" />
                            <PrevNextButton linkType="show" />
                        </SimpleShowLayout>
                    </Show>
                }
            />
        </AdminUI>
    </AdminContext>
);

export const WithStoreKey = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource
                name="books"
                list={
                    <List
                        storeKey="withStoreKey"
                        filters={[
                            <TextInput label="Search" source="q" alwaysOn />,
                        ]}
                    >
                        <Datagrid rowClick="edit">
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="genre" />
                        </Datagrid>
                    </List>
                }
                edit={
                    <Edit>
                        <SimpleForm>
                            <TextInput source="title" />
                            <TextInput source="author" />
                            <TextInput source="genre" />
                            <PrevNextButton storeKey="withStoreKey" />
                        </SimpleForm>
                    </Edit>
                }
                show={
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="genre" />
                            <PrevNextButton
                                linkType="show"
                                storeKey="withStoreKey"
                            />
                        </SimpleShowLayout>
                    </Show>
                }
            />
        </AdminUI>
    </AdminContext>
);

export const WithFilter = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource
                name="books"
                list={
                    <List filter={{ genre: 'Fantasy' }}>
                        <Datagrid rowClick="edit">
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="genre" />
                        </Datagrid>
                    </List>
                }
                edit={
                    <Edit>
                        <SimpleForm>
                            <TextInput source="title" />
                            <TextInput source="author" />
                            <TextInput source="genre" />
                            <PrevNextButton />
                        </SimpleForm>
                    </Edit>
                }
                show={
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="genre" />
                            <PrevNextButton linkType="show" />
                        </SimpleShowLayout>
                    </Show>
                }
            />
        </AdminUI>
    </AdminContext>
);
