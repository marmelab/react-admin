import type { Db } from './types';
export declare const generateOrders: (db: Db) => Order[];
export type Order = {
    id: number;
    reference: string;
    date: string;
    customer_id: number;
    basket: BasketItem[];
    total_ex_taxes: number;
    delivery_fees: number;
    tax_rate: number;
    taxes: number;
    total: number;
    status: OrderStatus;
    returned: boolean;
};
export type OrderStatus = 'ordered' | 'delivered' | 'cancelled';
export type BasketItem = {
    product_id: number;
    quantity: number;
};
//# sourceMappingURL=orders.d.ts.map