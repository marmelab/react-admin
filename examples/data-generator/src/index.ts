import { generateCustomers, Customer } from './customers';
import { generateCategories, Category } from './categories';
import { generateProducts, Product } from './products';
import { generateCommands, Command, BasketItem } from './commands';
import { generateInvoices, Invoice } from './invoices';
import { generateReviews, Review } from './reviews';
import finalize from './finalize';
import { Db } from './types';

const generateData = <Serialized extends boolean = false>(options?: {
    serializeDate: Serialized;
}): Db<Serialized> => {
    const db = {} as Db<Serialized>;
    db.customers = generateCustomers<Serialized>(db, options);
    db.categories = generateCategories();
    db.products = generateProducts(db);
    db.commands = generateCommands<Serialized>(db, options);
    db.invoices = generateInvoices(db);
    db.reviews = generateReviews(db, options);
    finalize(db);

    return db;
};

export default generateData;

export type {
    BasketItem,
    Category,
    Command,
    Customer,
    Db,
    Invoice,
    Product,
    Review,
};
