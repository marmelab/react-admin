/* eslint-disable import/no-anonymous-default-export */
import { SalesCreate } from './SalesCreate';
import { SalesEdit } from './SalesEdit';
import { SalesList } from './SalesList';
import type { Sale } from '../types';

export default {
    list: SalesList,
    create: SalesCreate,
    edit: SalesEdit,
    recordRepresentation: (record: Sale) =>
        `${record.first_name} ${record.last_name}`,
};
