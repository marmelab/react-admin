import { RaRecord } from 'ra-core';

import generateCustomers from './customers';
import generateCategories from './categories';
import generateProducts from './products';
import generateCommands from './commands';
import generateInvoices from './invoices';
import generateReviews from './reviews';
import finalize from './finalize';

export interface Db {
    customers: RaRecord[];
    categories: RaRecord[];
    products: RaRecord[];
    commands: RaRecord[];
    invoices: RaRecord[];
    reviews: RaRecord[];
}

export default (options = { serializeDate: true }): Db => {
    const db = {} as Db;
    db.customers = generateCustomers(db, options);
    db.categories = generateCategories();
    db.products = generateProducts(db);
    db.commands = generateCommands(db, options);
    db.invoices = generateInvoices(db);
    db.reviews = generateReviews(db, options);
    finalize(db);

    return db;
};
