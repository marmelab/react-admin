import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { makeStyles } from '@mui/material/styles';
import { Link, FieldProps, useTranslate, useQueryWithStore } from 'react-admin';

import { AppState, Order, Product } from '../types';

const useStyles = makeStyles({
    rightAlignedCell: { textAlign: 'right' },
});

const Basket = (props: FieldProps<Order>) => {
    const { record } = props;
    const classes = useStyles();
    const translate = useTranslate();

    const { loaded, data: products } = useQueryWithStore<AppState>(
        {
            type: 'getMany',
            resource: 'products',
            payload: {
                ids: record ? record.basket.map(item => item.product_id) : [],
            },
        },
        {},
        state => {
            const productIds = record
                ? record.basket.map(item => item.product_id)
                : [];

            return productIds
                .map<Product>(
                    productId =>
                        state.admin.resources.products.data[
                            productId
                        ] as Product
                )
                .filter(r => typeof r !== 'undefined')
                .reduce((prev, next) => {
                    prev[next.id] = next;
                    return prev;
                }, {} as { [key: string]: Product });
        }
    );

    if (!loaded || !record) return null;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        {translate(
                            'resources.commands.fields.basket.reference'
                        )}
                    </TableCell>
                    <TableCell className={classes.rightAlignedCell}>
                        {translate(
                            'resources.commands.fields.basket.unit_price'
                        )}
                    </TableCell>
                    <TableCell className={classes.rightAlignedCell}>
                        {translate('resources.commands.fields.basket.quantity')}
                    </TableCell>
                    <TableCell className={classes.rightAlignedCell}>
                        {translate('resources.commands.fields.basket.total')}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {record.basket.map(
                    (item: any) =>
                        products[item.product_id] && (
                            <TableRow key={item.product_id}>
                                <TableCell>
                                    <Link to={`/products/${item.product_id}`}>
                                        {products[item.product_id].reference}
                                    </Link>
                                </TableCell>
                                <TableCell className={classes.rightAlignedCell}>
                                    {products[
                                        item.product_id
                                    ].price.toLocaleString(undefined, {
                                        style: 'currency',
                                        currency: 'USD',
                                    })}
                                </TableCell>
                                <TableCell className={classes.rightAlignedCell}>
                                    {item.quantity}
                                </TableCell>
                                <TableCell className={classes.rightAlignedCell}>
                                    {(
                                        products[item.product_id].price *
                                        item.quantity
                                    ).toLocaleString(undefined, {
                                        style: 'currency',
                                        currency: 'USD',
                                    })}
                                </TableCell>
                            </TableRow>
                        )
                )}
            </TableBody>
        </Table>
    );
};

export default Basket;
