import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link, useTranslate, crudGetMany } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    container: { minWidth: '35em', marginLeft: '1em' },
    rightAlignedCell: { textAlign: 'right' },
    boldCell: { fontWeight: 'bold' },
});

const Basket = ({ record }) => {
    const classes = useStyles();
    const translate = useTranslate();
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin);

    useEffect(() => {
        const { basket } = record;
        dispatch(crudGetMany('products', basket.map(item => item.product_id)));
    }, [dispatch, record]);

    if (!record) return null;

    const { basket } = record;

    const productIds = basket.map(item => item.product_id);
    const products = productIds
        .map(productId => admin.resources.products.data[productId])
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, next) => {
            prev[next.id] = next;
            return prev;
        }, {});

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
                    {basket.map(
                        item =>
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
