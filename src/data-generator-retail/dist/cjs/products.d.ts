import type { Db } from './types';
export declare const generateProducts: (db: Db) => Product[];
export type Product = {
    id: number;
    category_id: number;
    reference: string;
    width: number;
    height: number;
    price: number;
    thumbnail: string;
    image: string;
    description: string;
    stock: number;
    sales: number;
};
//# sourceMappingURL=products.d.ts.map