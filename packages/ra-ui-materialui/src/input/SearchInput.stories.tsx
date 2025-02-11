import * as React from 'react';
import { Resource, TestMemoryRouter } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { List, Datagrid } from '../list';
import { TextField } from '../field';
import { SearchInput } from './SearchInput';

export default { title: 'ra-ui-materialui/input/SearchInput' };

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

const i18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? {
                  ...frenchMessages,
                  resources: {
                      books: {
                          name: 'Livre |||| Livres',
                          fields: {
                              id: 'Id',
                              title: 'Titre',
                              author: 'Auteur',
                              year: 'Année',
                          },
                      },
                  },
              }
            : englishMessages,
    'en' // Default locale
);

const postFilters = [<SearchInput source="q" alwaysOn />];

const BookList = () => {
    return (
        <List filters={postFilters}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </List>
    );
};

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource name="books" list={BookList} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

// taken from https://github.com/testing-library/dom-testing-library/blob/a86c54ccda5242ad8dfc1c70d31980bdbf96af7f/src/events.js#L106
const setNativeValue = (element, value) => {
    const { set: valueSetter } =
        Object.getOwnPropertyDescriptor(element, 'value') || {};
    const prototype = Object.getPrototypeOf(element);
    const { set: prototypeValueSetter } =
        Object.getOwnPropertyDescriptor(prototype, 'value') || {};
    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            throw new Error('The given element does not have a value setter');
        }
    }
};

const simulateKeyboardEntry = (inputField: HTMLInputElement, char: string) => {
    inputField.focus();
    setNativeValue(inputField, inputField.value + char[0]);
    const changeEvent = new Event('change', { bubbles: true });
    inputField.dispatchEvent(changeEvent);
};

const RaceConditionTrigger = () => {
    const triggerBug = async () => {
        const input = document.querySelector(
            'input[name="q"]'
        ) as HTMLInputElement;
        simulateKeyboardEntry(input, 'h');
        await new Promise(resolve => setTimeout(resolve, 100));
        simulateKeyboardEntry(input, 'e');
        // a delay of 500 to 600 ms seems to trigger the bug
        await new Promise(resolve => setTimeout(resolve, 550));
        simulateKeyboardEntry(input, 'l');
        await new Promise(resolve => setTimeout(resolve, 100));
        simulateKeyboardEntry(input, 'l');
        await new Promise(resolve => setTimeout(resolve, 100));
        simulateKeyboardEntry(input, 'o');
    };
    return <button onClick={triggerBug}>Trigger bug</button>;
};

const RaceConditionBookList = () => {
    return (
        <List filters={postFilters}>
            <RaceConditionTrigger />
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </List>
    );
};

export const RaceCondition = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource name="books" list={RaceConditionBookList} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const postFiltersReadOnly = [<SearchInput source="q" alwaysOn readOnly />];

const BookListReadOnly = () => {
    return (
        <List filters={postFiltersReadOnly}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </List>
    );
};

export const ReadOnly = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource name="books" list={BookListReadOnly} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);
