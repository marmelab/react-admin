import * as React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useRecordContext, useTranslate } from 'react-admin';

import { Order } from '../types';
import { TableCellRight } from './TableCellRight';

const Totals = () => {
    const record = useRecordContext<Order>();
    const translate = useTranslate();

    return (
        <Table sx={{ minWidth: '35em' }}>
            <TableBody>
                <TableRow>
                    <TableCell>
                        {translate('resources.orders.fields.basket.sum')}
                    </TableCell>
                    <TableCellRight>
                        {record?.total_ex_taxes.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCellRight>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate('resources.orders.fields.basket.delivery')}
                    </TableCell>
                    <TableCellRight>
                        {record?.delivery_fees.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCellRight>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate('resources.orders.fields.basket.taxes')} (
                        {record?.tax_rate.toLocaleString(undefined, {
                            style: 'percent',
                        })}
                        )
                    </TableCell>
                    <TableCellRight>
                        {record?.taxes.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCellRight>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        {translate('resources.orders.fields.basket.total')}
                    </TableCell>
                    <TableCellRight sx={{ fontWeight: 'bold' }}>
                        {record?.total.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCellRight>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default Totals;
