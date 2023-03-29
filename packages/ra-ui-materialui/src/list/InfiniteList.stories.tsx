import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Resource } from 'ra-core';

import { InfiniteList } from './InfiniteList';
import { SimpleList } from './SimpleList';
import { Pagination as DefaultPagination } from './pagination';
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
        { id: 1, title: 'War and Peace', author: 'Leo Tolstoy' },
        {
            id: 2,
            title: 'The Little Prince',
            author: 'Antoine de Saint-Exupéry',
        },
        { id: 3, title: "Swann's Way", author: 'Marcel Proust' },
        { id: 4, title: 'A Tale of Two Cities', author: 'Charles Dickens' },
        { id: 5, title: 'The Lord of the Rings', author: 'J. R. R. Tolkien' },
        { id: 6, title: 'And Then There Were None', author: 'Agatha Christie' },
        { id: 7, title: 'Dream of the Red Chamber', author: 'Cao Xueqin' },
        { id: 8, title: 'The Hobbit', author: 'J. R. R. Tolkien' },
        {
            id: 9,
            title: 'She: A History of Adventure',
            author: 'H. Rider Haggard',
        },
        {
            id: 10,
            title: 'The Lion, the Witch and the Wardrobe',
            author: 'C. S. Lewis',
        },
        { id: 11, title: 'The Chronicles of Narnia', author: 'C. S. Lewis' },
        { id: 12, title: 'Pride and Prejudice', author: 'Jane Austen' },
        { id: 13, title: 'Ulysses', author: 'James Joyce' },
        { id: 14, title: 'The Catcher in the Rye', author: 'J. D. Salinger' },
        {
            id: 15,
            title: 'The Little Mermaid',
            author: 'Hans Christian Andersen',
        },
        {
            id: 16,
            title: 'The Secret Garden',
            author: 'Frances Hodgson Burnett',
        },
        { id: 17, title: 'The Wind in the Willows', author: 'Kenneth Grahame' },
        { id: 18, title: 'The Wizard of Oz', author: 'L. Frank Baum' },
        { id: 19, title: 'Madam Bovary', author: 'Gustave Flaubert' },
        { id: 20, title: 'The Little House', author: 'Louisa May Alcott' },
        { id: 21, title: 'The Phantom of the Opera', author: 'Gaston Leroux' },
        { id: 22, title: 'The Adventures of Tom Sawyer', author: 'Mark Twain' },
        {
            id: 23,
            title: 'The Adventures of Huckleberry Finn',
            author: 'Mark Twain',
        },
        { id: 24, title: 'The Time Machine', author: 'H. G. Wells' },
        { id: 25, title: 'The War of the Worlds', author: 'H. G. Wells' },
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
                500
            )
        );
    },
});

const Admin = ({ dataProvider, children }) => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>{children}</AdminUI>
    </AdminContext>
);

const bookFilters = [<SearchInput source="q" alwaysOn />];
const BookActions = () => (
    <TopToolbar>
        <SortButton fields={['id', 'title']} />
    </TopToolbar>
);

const BookList = () => (
    <InfiniteList filters={bookFilters} actions={<BookActions />}>
        <SimpleList primaryText="%{title}" secondaryText="%{author}" />
    </InfiniteList>
);

export const FullApp = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="books" list={BookList} />
    </Admin>
);

export const Aside = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList aside={<div>Aside</div>}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Filter = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList filter={{ author: 'H. G. Wells' }}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Filters = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList filters={bookFilters}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Pagination = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList pagination={<DefaultPagination />}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const PerPage = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList perPage={5}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Sort = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList sort={{ field: 'title', order: 'ASC' }}>
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);

export const Title = () => (
    <Admin dataProvider={dataProvider}>
        <Resource
            name="books"
            list={() => (
                <InfiniteList title="The Books">
                    <SimpleList
                        primaryText="%{title}"
                        secondaryText="%{author}"
                    />
                </InfiniteList>
            )}
        />
    </Admin>
);
