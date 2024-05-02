import { generateCustomers, Customer } from './customers';
import { generateCategories, Category } from './categories';
import { generateProducts, Product } from './products';
import { generateOrders, Order, BasketItem } from './orders';
import { generateInvoices, Invoice } from './invoices';
import { generateReviews, Review } from './reviews';
import finalize from './finalize';
import { Db } from './types';

const generateData = (): Db => {
    const db = {} as Db;
    db.customers = generateCustomers();
    db.categories = generateCategories();
    db.products = generateProducts(db);
    db.orders = generateOrders(db);
    db.invoices = generateInvoices(db);
    db.reviews = generateReviews(db);
    finalize(db);

    return db;
};

export default generateData;

export type {
    BasketItem,
    Category,
    Order,
    Customer,
    Db,
    Invoice,
    Product,
    Review,
};
