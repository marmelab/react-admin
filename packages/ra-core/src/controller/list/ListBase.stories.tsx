import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';

import { ListBase } from './ListBase';
import { CoreAdminContext } from '../../core';
import { useListContext } from './useListContext';

export default {
    title: 'ra-core/controller/list/ListBase',
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

const baseDataProvider = fakeRestProvider(data, true);

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

const BookListView = () => {
    const {
        data,
        isLoading,
        sort,
        filterValues,
        page,
        perPage,
        setPage,
        setPerPage,
        setFilters,
        setSort,
    } = useListContext();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const defaultValue = JSON.stringify({
        page,
        perPage,
        sort,
        filterValues,
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleClick = () => {
        const value = JSON.parse(inputRef.current!.value);
        if (
            JSON.stringify(value.filterValues) !== JSON.stringify(filterValues)
        ) {
            // the last parameter is debounce false
            // without it, the filter change overrides any other list param change
            // see https://github.com/marmelab/react-admin/issues/4189
            setFilters(value.filterValues, null, false);
        }
        if (value.page !== page) {
            setPage(value.page);
        }
        if (value.perPage !== perPage) {
            setPerPage(value.perPage);
        }
        if (
            value.sort.field !== sort.field ||
            value.sort.order !== sort.order
        ) {
            setSort(value.sort);
        }
    };

    return (
        <div>
            <input
                ref={inputRef}
                name="params"
                defaultValue={defaultValue}
                style={{ width: '100%', fontFamily: 'monospace' }}
            />
            <button onClick={handleClick}>Change params</button>
            <ul>
                {data.map((record: any) => (
                    <li key={record.id}>{record.title}</li>
                ))}
            </ul>
        </div>
    );
};

export const SetParams = () => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListBase resource="books" perPage={5}>
            <BookListView />
        </ListBase>
    </CoreAdminContext>
);
