import * as React from 'react';
import { Resource } from 'ra-core';
import fakeRestProvider from 'ra-data-fakerest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { ListGuesser } from './ListGuesser';
import { ShowGuesser } from '../detail';
import { AdminUI } from '../AdminUI';
import { AdminContext } from '../AdminContext';

export default {
    title: 'ra-ui-materialui/list/ListGuesser',
};

const data = {
    products: [
        {
            id: 1,
            name: 'Office jeans',
            price: 45.99,
            category_id: 1,
            tags_ids: [1],
        },
        {
            id: 2,
            name: 'Black elegance jeans',
            price: 69.99,
            category_id: 1,
            tags_ids: [2, 3],
        },
        {
            id: 3,
            name: 'Slim fit jeans',
            price: 55.99,
            category_id: 1,
            tags_ids: [2, 4],
        },
        {
            id: 4,
            name: 'Basic T-shirt',
            price: 15.99,
            category_id: 2,
            tags_ids: [1, 4, 3],
        },
        {
            id: 5,
            name: 'Basic cap',
            price: 19.99,
            category_id: 6,
            tags_ids: [1, 4, 3],
        },
    ],
    categories: [
        { id: 1, name: 'Jeans' },
        { id: 2, name: 'T-Shirts' },
        { id: 3, name: 'Jackets' },
        { id: 4, name: 'Shoes' },
        { id: 5, name: 'Accessories' },
        { id: 6, name: 'Hats' },
        { id: 7, name: 'Socks' },
        { id: 8, name: 'Shirts' },
        { id: 9, name: 'Sweaters' },
        { id: 10, name: 'Trousers' },
        { id: 11, name: 'Coats' },
        { id: 12, name: 'Dresses' },
        { id: 13, name: 'Skirts' },
        { id: 14, name: 'Swimwear' },
        { id: 15, name: 'Bags' },
    ],
    tags: [
        { id: 1, name: 'top seller' },
        { id: 2, name: 'new' },
        { id: 3, name: 'sale' },
        { id: 4, name: 'promotion' },
    ],
};

const dataProvider = fakeRestProvider(data, process.env.NODE_ENV !== 'test');

export const Basic = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                recordRepresentation="name"
            />
            <Resource name="categories" recordRepresentation="name" />
            <Resource name="tags" recordRepresentation="name" />
        </AdminUI>
    </AdminContext>
);

export const LinkedShow = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                show={ShowGuesser}
                recordRepresentation="name"
            />
            <Resource name="categories" recordRepresentation="name" />
            <Resource name="tags" recordRepresentation="name" />
        </AdminUI>
    </AdminContext>
);
