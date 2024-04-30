import type { Db } from './types';

export const generateInvoices = (db: Db): Invoice[] => {
    let id = 0;

    return (
        db.orders
            .filter(order => order.status !== 'delivered')
            // @ts-ignore
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(order => ({
                id: id++,
                date: order.date,
                order_id: order.id,
                customer_id: order.customer_id,
                total_ex_taxes: order.total_ex_taxes,
                delivery_fees: order.delivery_fees,
                tax_rate: order.tax_rate,
                taxes: order.taxes,
                total: order.total,
            }))
    );
};

export type Invoice = {
    id: number;
    date: string;
    order_id: number;
    customer_id: number;
    total_ex_taxes: number;
    delivery_fees: number;
    tax_rate: number;
    taxes: number;
    total: number;
};
