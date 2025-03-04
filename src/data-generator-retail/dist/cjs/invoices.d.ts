import type { Db } from './types';
export declare const generateInvoices: (db: Db) => Invoice[];
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
//# sourceMappingURL=invoices.d.ts.map