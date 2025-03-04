import { RaRecord } from 'ra-core';

interface Db {
    customers: RaRecord[];
    categories: RaRecord[];
    products: RaRecord[];
    commands: RaRecord[];
    invoices: RaRecord[];
    reviews: RaRecord[];
}
declare const _default: (options?: {
    serializeDate: boolean;
}) => Db;

export { Db, _default as default };
