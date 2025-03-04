import type { Db } from './types';
export declare const generateReviews: (db: Db) => Review[];
export type Review = {
    id: number;
    date: string;
    status: 'accepted' | 'rejected' | 'pending';
    order_id: number;
    product_id: number;
    customer_id: number;
    rating: number;
    comment: string;
};
//# sourceMappingURL=reviews.d.ts.map