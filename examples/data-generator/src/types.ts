import type { Customer } from './customers';
import type { Category } from './categories';
import type { Product } from './products';
import type { Order } from './orders';
import type { Invoice } from './invoices';
import type { Review } from './reviews';
import { Settings } from './finalize';

export interface Db {
    customers: Customer[];
    categories: Category[];
    products: Product[];
    orders: Order[];
    invoices: Invoice[];
    reviews: Review[];
    settings: Settings;
}
