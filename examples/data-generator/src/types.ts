import type { Customer } from './customers';
import type { Category } from './categories';
import type { Product } from './products';
import type { Command } from './commands';
import type { Invoice } from './invoices';
import type { Review } from './reviews';
import { Settings } from './finalize';

export interface Db {
    customers: Customer[];
    categories: Category[];
    products: Product[];
    commands: Command[];
    invoices: Invoice[];
    reviews: Review[];
    settings: Settings;
}
