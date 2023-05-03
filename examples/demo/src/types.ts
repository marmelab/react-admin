export type ThemeName = 'light' | 'dark';

export type Category = {
    id: number;
    name: string;
};

export type Product = {
    id: number;
    category_id: number;
    description: string;
    height: number;
    image: string;
    price: number;
    reference: string;
    stock: number;
    thumbnail: string;
    width: number;
};

export type Customer = {
    id: number;
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

export type Order = {
    id: number;
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
};

export type BasketItem = {
    product_id: number;
    quantity: number;
};

export type Invoice = {
    id: number;
    date: Date;
};

export type ReviewStatus = 'accepted' | 'pending' | 'rejected';

export type Review = {
    id: number;
    date: Date;
    status: ReviewStatus;
    customer_id: number;
    product_id: number;
    comment: string;
};

declare global {
    interface Window {
        restServer: any;
    }
}
