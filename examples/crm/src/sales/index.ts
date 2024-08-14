/* eslint-disable import/no-anonymous-default-export */
import { Sale } from '../types';
import { SalesCreate } from './SalesCreate';
import { SalesEdit } from './SalesEdit';
import { SalesList } from './SalesList';

export default {
    list: SalesList,
    create: SalesCreate,
    edit: SalesEdit,
    recordRepresentation: (record: Sale) =>
        `${record.first_name} ${record.last_name}`,
};
