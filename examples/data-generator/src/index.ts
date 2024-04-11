import { generateCustomers, Customer } from './customers';
import { generateCategories, Category } from './categories';
import { generateProducts, Product } from './products';
import { generateCommands, Command, BasketItem } from './commands';
import { generateInvoices, Invoice } from './invoices';
import { generateReviews, Review } from './reviews';
import finalize from './finalize';
import { Db } from './types';

const generateData = (): Db => {
    const db = {} as Db;
    db.customers = generateCustomers();
    db.categories = generateCategories();
    db.products = generateProducts(db);
    db.commands = generateCommands(db);
    db.invoices = generateInvoices(db);
    db.reviews = generateReviews(db);
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
