import { RaRecord } from 'react-admin';

export type ThemeName = 'light' | 'dark';

export interface Category extends RaRecord<number> {
    id: number;
    name: string;
}

export interface Product extends RaRecord<number> {
    category_id: number;
    description: string;
    height: number;
    image: string;
    price: number;
    reference: string;
    stock: number;
    thumbnail: string;
    width: number;
}

export interface Customer extends RaRecord<number> {
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
}

export type OrderStatus = 'ordered' | 'delivered' | 'cancelled';

export interface Order extends RaRecord<number> {
    status: OrderStatus;
    basket: BasketItem[];
    date: Date;
    total: number;
    total_ex_taxes: number;
    delivery_fees: number;
    tax_rate: number;
    taxes: number;
    customer_id: number;
    reference: string;
}

export type BasketItem = {
    product_id: number;
    quantity: number;
};

export interface Invoice extends RaRecord<number> {
    date: Date;
}

export type ReviewStatus = 'accepted' | 'pending' | 'rejected';

export interface Review extends RaRecord<number> {
    date: Date;
    status: ReviewStatus;
    customer_id: number;
    product_id: number;
    comment: string;
}

declare global {
    interface Window {
        restServer: any;
    }
}
