import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Resource } from 'ra-core';

import { InfiniteList } from './InfiniteList';
import { SimpleList } from './SimpleList';
import { AdminUI } from '../AdminUI';
import { AdminContext } from '../AdminContext';
import { SearchInput } from '../input';
import { SortButton } from '../button';
import { TopToolbar } from '../layout';

export default {
    title: 'ra-ui-materialui/list/InfiniteList',
};

const data = {
    books: [
        { id: 1, title: 'War and Peace' },
        { id: 2, title: 'The Little Prince' },
        { id: 3, title: "Swann's Way" },
        { id: 4, title: 'A Tale of Two Cities' },
        { id: 5, title: 'The Lord of the Rings' },
        { id: 6, title: 'And Then There Were None' },
        { id: 7, title: 'Dream of the Red Chamber' },
        { id: 8, title: 'The Hobbit' },
        { id: 9, title: 'She: A History of Adventure' },
        { id: 10, title: 'The Lion, the Witch and the Wardrobe' },
        { id: 11, title: 'The Chronicles of Narnia' },
        { id: 12, title: 'Pride and Prejudice' },
        { id: 13, title: 'Ulysses' },
        { id: 14, title: 'The Catcher in the Rye' },
        { id: 15, title: 'The Little Mermaid' },
        { id: 16, title: 'The Secret Garden' },
        { id: 17, title: 'The Wind in the Willows' },
        { id: 18, title: 'The Wizard of Oz' },
        { id: 19, title: 'Madam Bovary' },
        { id: 20, title: 'The Little House' },
        { id: 21, title: 'The Phantom of the Opera' },
        { id: 22, title: 'The Adventures of Tom Sawyer' },
        { id: 23, title: 'The Adventures of Huckleberry Finn' },
        { id: 24, title: 'The Time Machine' },
        { id: 25, title: 'The War of the Worlds' },
    ],
};

const baseDataProvider = fakeRestProvider(data);

const dataProvider = new Proxy(baseDataProvider, {
    get: (target, name) => (resource, params) => {
        if (typeof name === 'symbol' || name === 'then') {
            return;
        }
        return new Promise(resolve =>
            setTimeout(
                () => resolve(baseDataProvider[name](resource, params)),
                300
            )
        );
    },
});

const bookFilters = [<SearchInput source="q" alwaysOn />];
const BookActions = () => (
    <TopToolbar>
        <SortButton fields={['id', 'title']} />
    </TopToolbar>
);

const BookList = () => (
    <InfiniteList filters={bookFilters} actions={<BookActions />}>
        <SimpleList primaryText={record => record.title} />
    </InfiniteList>
);

export const Basic = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource name="books" list={BookList} />
        </AdminUI>
    </AdminContext>
);
