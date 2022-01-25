import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { Link, FieldProps, useTranslate, useGetMany } from 'react-admin';

import { Order, Product } from '../types';

const PREFIX = 'Basket';

const classes = {
    rightAlignedCell: `${PREFIX}-rightAlignedCell`,
};

const StyledTable = styled(Table)({
    [`& .${classes.rightAlignedCell}`]: { textAlign: 'right' },
});

const Basket = (props: FieldProps<Order>) => {
    const { record } = props;

    const translate = useTranslate();

    const productIds = record ? record.basket.map(item => item.product_id) : [];

    const { isLoading, data: products } = useGetMany<Product>(
        'products',
        { ids: productIds },
        { enabled: !!record }
    );
    const productsById = products
        ? products.reduce((acc, product) => {
              acc[product.id] = product;
              return acc;
          }, {} as any)
        : {};

    if (isLoading || !record || !products) return null;

    return (
        <StyledTable>
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
                {record.basket.map((item: any) => (
                    <TableRow key={item.product_id}>
                        <TableCell>
                            <Link to={`/products/${item.product_id}`}>
                                {productsById[item.product_id].reference}
                            </Link>
                        </TableCell>
                        <TableCell className={classes.rightAlignedCell}>
                            {productsById[item.product_id].price.toLocaleString(
                                undefined,
                                {
                                    style: 'currency',
                                    currency: 'USD',
                                }
                            )}
                        </TableCell>
                        <TableCell className={classes.rightAlignedCell}>
                            {item.quantity}
                        </TableCell>
                        <TableCell className={classes.rightAlignedCell}>
                            {(
                                productsById[item.product_id].price *
                                item.quantity
                            ).toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </StyledTable>
    );
};

export default Basket;
