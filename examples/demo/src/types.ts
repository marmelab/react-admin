import * as DataGenerator from 'data-generator-retail';

export type ThemeName = 'light' | 'dark';

export type Category = DataGenerator.Category;
export type Product = DataGenerator.Product;
export type Customer = DataGenerator.Customer<false>;
export type Order = DataGenerator.Command<false>;
export type Invoice = DataGenerator.Invoice<false>;
export type Review = DataGenerator.Review<false>;
export type BasketItem = DataGenerator.BasketItem;

declare global {
    interface Window {
        restServer: any;
    }
}
