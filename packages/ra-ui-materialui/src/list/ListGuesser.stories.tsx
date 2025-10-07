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
            last_update: new Date('2023-10-01').toISOString(),
            email: 'office.jeans@myshop.com',
            sizes: ['S', 'M', 'L', 'XL'],
        },
        {
            id: 2,
            name: 'Black elegance jeans',
            price: 69.99,
            category_id: 1,
            tags_ids: [2, 3],
            last_update: new Date('2023-11-01').toISOString(),
            email: 'black.elegance.jeans@myshop.com',
            sizes: ['S', 'M', 'L'],
        },
        {
            id: 3,
            name: 'Slim fit jeans',
            price: 55.99,
            category_id: 1,
            tags_ids: [2, 4],
            last_update: new Date('2023-12-01').toISOString(),
            email: 'slim.fit.jeans@myshop.com',
            sizes: ['XS', 'S', 'M'],
        },
        {
            id: 4,
            name: 'Basic T-shirt',
            price: 15.99,
            category_id: 2,
            tags_ids: [1, 4, 3],
            last_update: new Date('2023-10-15').toISOString(),
            email: 'basic.t.shirt@myshop.com',
            sizes: ['M', 'L', 'XL', 'XXL'],
        },
        {
            id: 5,
            name: 'Basic cap',
            price: 19.99,
            category_id: 6,
            tags_ids: [1, 4, 3],
            last_update: new Date('2023-10-15').toISOString(),
            email: 'basic.cap@myshop.com',
            sizes: ['One Size'],
        },
    ],
    categories: [
        {
            id: 1,
            name: 'Jeans',
            alternativeName: [{ name: 'denims' }, { name: 'pants' }],
            isVeganProduction: true,
        },
        {
            id: 2,
            name: 'T-Shirts',
            alternativeName: [{ name: 'polo' }, { name: 'tee shirt' }],
            isVeganProduction: false,
        },
        {
            id: 3,
            name: 'Jackets',
            alternativeName: [{ name: 'coat' }, { name: 'blazers' }],
            isVeganProduction: false,
        },
        {
            id: 4,
            name: 'Shoes',
            alternativeName: [{ name: 'sneakers' }, { name: 'moccasins' }],
            isVeganProduction: false,
        },
        {
            id: 5,
            name: 'Accessories',
            alternativeName: [{ name: 'jewelry' }, { name: 'belts' }],
            isVeganProduction: true,
        },
        {
            id: 6,
            name: 'Hats',
            alternativeName: [{ name: 'caps' }, { name: 'headwear' }],
            isVeganProduction: true,
        },
        {
            id: 7,
            name: 'Socks',
            alternativeName: [{ name: 'stockings' }, { name: 'hosiery' }],
            isVeganProduction: false,
        },
        {
            id: 8,
            name: 'Bags',
            alternativeName: [{ name: 'handbags' }, { name: 'purses' }],
            isVeganProduction: false,
        },
        {
            id: 9,
            name: 'Dresses',
            alternativeName: [{ name: 'robes' }, { name: 'gowns' }],
            isVeganProduction: false,
        },
        {
            id: 10,
            name: 'Skirts',
            alternativeName: [{ name: 'tutus' }, { name: 'kilts' }],
            isVeganProduction: false,
        },
    ],
    tags: [
        {
            id: 1,
            name: 'top seller',
            url: 'https://www.myshop.com/tags/top-seller',
        },
        {
            id: 2,
            name: 'new',
            url: 'https://www.myshop.com/tags/new',
        },
        {
            id: 3,
            name: 'sale',
            url: 'https://www.myshop.com/tags/sale',
        },
        {
            id: 4,
            name: 'promotion',
            url: 'https://www.myshop.com/tags/promotion',
        },
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

const delayedDataProvider = fakeRestProvider(
    data,
    process.env.NODE_ENV !== 'test',
    300
);

const ListGuesserWithProdLogs = () => <ListGuesser enableLog />;

export const ManyResources = () => (
    <AdminContext
        dataProvider={delayedDataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesserWithProdLogs}
                recordRepresentation="name"
            />
            <Resource
                name="categories"
                list={ListGuesserWithProdLogs}
                recordRepresentation="name"
            />
            <Resource
                name="tags"
                list={ListGuesserWithProdLogs}
                recordRepresentation="name"
            />
        </AdminUI>
    </AdminContext>
);
