import { RaRecord, Identifier } from 'react-admin';

export type ThemeName = 'light' | 'dark';

export interface Category extends RaRecord {
    name: string;
}

export interface Product extends RaRecord {
    category_id: Identifier;
    description: string;
    height: number;
    image: string;
    price: number;
    reference: string;
    stock: number;
    thumbnail: string;
    width: number;
}

export type Customer = RaRecord<number> & {
    first_name: string;
    last_name: string;
    address: string;
    stateAbbr: string;
    city: string;
    zipcode: string;
    avatar: string;
    birthday: string;
    first_seen: string;
    last_seen: string;
    has_ordered: boolean;
    latest_purchase: string;
    has_newsletter: boolean;
    groups: string[];
    nb_commands: number;
    total_spent: number;
    email: string;
};

export type OrderStatus = 'ordered' | 'delivered' | 'cancelled';

export interface Order extends RaRecord {
    status: OrderStatus;
    basket: BasketItem[];
    date: Date;
    total: number;
    reference: string;
    customer_id: number;
    total_ex_taxes: number;
    delivery_fees: number;
    tax_rate: number;
    taxes: number;
}

export interface BasketItem {
    product_id: Identifier;
    quantity: number;
}

export interface Invoice extends RaRecord {
    date: Date;
}

export type ReviewStatus = 'accepted' | 'pending' | 'rejected';

export interface Review extends RaRecord {
    date: Date;
    status: ReviewStatus;
    customer_id: Identifier;
    product_id: Identifier;
    comment: string;
    rating: number;
}

declare global {
    interface Window {
        restServer: any;
    }
}
