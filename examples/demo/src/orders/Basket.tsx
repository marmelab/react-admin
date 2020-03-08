import React, { FC } from 'react';
import classnames from 'classnames';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link, useTranslate, useQueryWithStore } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps, AppState, Order, Product } from '../types';

const useStyles = makeStyles({
    container: { minWidth: '35em', marginLeft: '1em' },
    rightAlignedCell: { textAlign: 'right' },
    boldCell: { fontWeight: 'bold' },
});

const Basket: FC<FieldProps<Order>> = ({ record }) => {
    const classes = useStyles();
    const translate = useTranslate();

    const { loaded, data: products } = useQueryWithStore(
        {
            type: 'getMany',
            resource: 'products',
            payload: {
                ids: record ? record.basket.map(item => item.product_id) : [],
            },
        },
        {},
        (state: AppState) => {
            const productIds = record
                ? record.basket.map(item => item.product_id)
                : [];

            return productIds
                .map<Product>(
                    (productId: string) =>
                        state.admin.resources.products.data[
                            productId
                        ] as Product
                )
                .filter(r => typeof r !== 'undefined')
                .reduce(
                    (prev, next) => {
                        prev[next.id] = next;
                        return prev;
                    },
                    {} as { [key: string]: Product }
                );
        }
    );

    if (!loaded || !record) return null;

    return (
        <Paper className={classes.container} elevation={2}>
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
                            {translate(
                                'resources.commands.fields.basket.quantity'
                            )}
                        </TableCell>
                        <TableCell className={classes.rightAlignedCell}>
                            {translate(
                                'resources.commands.fields.basket.total'
                            )}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {record.basket.map(
                        (item: any) =>
                            products[item.product_id] && (
                                <TableRow key={item.product_id}>
                                    <TableCell>
                                        <Link
                                            to={`/products/${item.product_id}`}
                                        >
                                            {
                                                products[item.product_id]
                                                    .reference
                                            }
                                        </Link>
                                    </TableCell>
                                    <TableCell
                                        className={classes.rightAlignedCell}
                                    >
                                        {products[
                                            item.product_id
                                        ].price.toLocaleString(undefined, {
                                            style: 'currency',
                                            currency: 'USD',
                                        })}
                                    </TableCell>
                                    <TableCell
                                        className={classes.rightAlignedCell}
                                    >
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell
                                        className={classes.rightAlignedCell}
                                    >
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
                    <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell>
                            {translate('resources.commands.fields.basket.sum')}
                        </TableCell>
                        <TableCell className={classes.rightAlignedCell}>
                            {record.total_ex_taxes.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell>
                            {translate(
                                'resources.commands.fields.basket.delivery'
                            )}
                        </TableCell>
                        <TableCell className={classes.rightAlignedCell}>
                            {record.delivery_fees.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell>
                            {translate(
                                'resources.commands.fields.basket.tax_rate'
                            )}
                        </TableCell>
                        <TableCell className={classes.rightAlignedCell}>
                            {record.tax_rate.toLocaleString(undefined, {
                                style: 'percent',
                            })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell className={classes.boldCell}>
                            {translate(
                                'resources.commands.fields.basket.total'
                            )}
                        </TableCell>
                        <TableCell
                            className={classnames(
                                classes.boldCell,
                                classes.rightAlignedCell
                            )}
                        >
                            {record.total.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );
};

export default Basket;
