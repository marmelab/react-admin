import * as DataGenerator from 'data-generator-retail';

export type ThemeName = 'light' | 'dark';

export type Category = DataGenerator.Category;
export type Product = DataGenerator.Product;
export type Customer = DataGenerator.Customer;
export type Order = DataGenerator.Order;
export type Invoice = DataGenerator.Invoice;
export type Review = DataGenerator.Review;
export type BasketItem = DataGenerator.BasketItem;

declare global {
    interface Window {
        restServer: any;
    }
}
