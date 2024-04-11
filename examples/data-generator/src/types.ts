import type { Customer } from './customers';
import type { Category } from './categories';
import type { Product } from './products';
import type { Command } from './commands';
import type { Invoice } from './invoices';
import type { Review } from './reviews';
import { Settings } from './finalize';

export interface Db<Serialized extends boolean = false> {
    customers: Customer<Serialized>[];
    categories: Category[];
    products: Product[];
    commands: Command<Serialized>[];
    invoices: Invoice<Serialized>[];
    reviews: Review<Serialized>[];
    settings: Settings;
}
