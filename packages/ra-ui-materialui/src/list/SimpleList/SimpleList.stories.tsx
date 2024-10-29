import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    Resource,
    ListContextProvider,
    TestMemoryRouter,
    ResourceContextProvider,
} from 'ra-core';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { SimpleList } from './SimpleList';
import { AdminUI } from '../../AdminUI';
import { AdminContext } from '../../AdminContext';
import { EditGuesser } from '../../detail';
import { List } from '../List';

export default { title: 'ra-ui-materialui/list/SimpleList' };

const data = {
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
        {
            id: 12,
            title: 'One Hundred Years of Solitude',
            author: 'Gabriel García Márquez',
            year: 1967,
        },
        {
            id: 13,
            title: 'Snow Country',
            author: 'Yasunari Kawabata',
            year: 1956,
        },
    ],
};

export const Basic = () => (
    <TestMemoryRouter>
        <ResourceContextProvider value="books">
            <SimpleList
                data={data.books}
                primaryText={record => record.title}
                secondaryText={record => record.author}
                tertiaryText={record => record.year}
            />
        </ResourceContextProvider>
    </TestMemoryRouter>
);

const dataProvider = fakeRestDataProvider(data);

export const FullApp = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="books"
                list={() => (
                    <List>
                        <SimpleList
                            primaryText={record => record.title}
                            secondaryText={record => record.author}
                        />
                    </List>
                )}
                edit={EditGuesser}
            />
        </AdminUI>
    </AdminContext>
);

export const NoPrimaryText = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="books"
                recordRepresentation="title"
                list={() => (
                    <List>
                        <SimpleList />
                    </List>
                )}
                edit={EditGuesser}
            />
        </AdminUI>
    </AdminContext>
);

export const ErrorInFetch = () => (
    <TestMemoryRouter>
        <ListContextProvider
            value={
                {
                    error: new Error('Error in dataProvider'),
                } as any
            }
        >
            <SimpleList
                primaryText={record => record.title}
                secondaryText={record => record.author}
                tertiaryText={record => record.year}
            />
        </ListContextProvider>
    </TestMemoryRouter>
);

export const FullAppInError = () => (
    <AdminContext
        dataProvider={
            {
                getList: () =>
                    Promise.reject(new Error('Error in dataProvider')),
            } as any
        }
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="books"
                list={() => (
                    <List>
                        <SimpleList
                            primaryText={record => record.title}
                            secondaryText={record => record.author}
                        />
                    </List>
                )}
                edit={EditGuesser}
            />
        </AdminUI>
    </AdminContext>
);

export const Standalone = () => (
    <TestMemoryRouter>
        <SimpleList
            data={data.books}
            primaryText={record => record.title}
            secondaryText={record => record.author}
            tertiaryText={record => record.year}
            linkType={false}
        />
    </TestMemoryRouter>
);

export const StandaloneEmpty = () => (
    <TestMemoryRouter>
        <ResourceContextProvider value="books">
            <SimpleList<any>
                data={[]}
                primaryText={record => record.title}
                secondaryText={record => record.author}
                tertiaryText={record => record.year}
                linkType={false}
            />
        </ResourceContextProvider>
    </TestMemoryRouter>
);
