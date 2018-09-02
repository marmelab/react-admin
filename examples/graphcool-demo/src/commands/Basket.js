import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link, translate, crudGetMany as crudGetManyAction } from 'react-admin';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
    container: { width: '35em' },
    rightAlignedCell: { textAlign: 'right' },
    boldCell: { fontWeight: 'bold' },
};

class Basket extends Component {
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        const {
            record: { basket },
            crudGetMany,
        } = this.props;
        crudGetMany('Product', basket.map(item => item.product.id));
    }
    render() {
        const { classes, record, products, translate } = this.props;
        const { basket } = record;
        return (
            <Paper className={classes.container}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {translate(
                                    'resources.Command.fields.basket.reference'
                                )}
                            </TableCell>
                            <TableCell className={classes.rightAlignedCell}>
                                {translate(
                                    'resources.Command.fields.basket.unit_price'
                                )}
                            </TableCell>
                            <TableCell className={classes.rightAlignedCell}>
                                {translate(
                                    'resources.Command.fields.basket.quantity'
                                )}
                            </TableCell>
                            <TableCell className={classes.rightAlignedCell}>
                                {translate(
                                    'resources.Command.fields.basket.total'
                                )}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.map(
                            item =>
                                products[item.product.id] && (
                                    <TableRow key={item.product.id}>
                                        <TableCell>
                                            <Link
                                                to={`/Product/${
                                                    item.product.id
                                                }`}
                                            >
                                                {
                                                    products[item.product.id]
                                                        .reference
                                                }
                                            </Link>
                                        </TableCell>
                                        <TableCell
                                            className={classes.rightAlignedCell}
                                        >
                                            {products[
                                                item.product.id
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
                                                products[item.product.id]
                                                    .price * item.quantity
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
                                {translate(
                                    'resources.Command.fields.basket.sum'
                                )}
                            </TableCell>
                            <TableCell className={classes.rightAlignedCell}>
                                {record.totalExTaxes.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell>
                                {translate(
                                    'resources.Command.fields.basket.delivery'
                                )}
                            </TableCell>
                            <TableCell className={classes.rightAlignedCell}>
                                {record.deliveryFees.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell>
                                {translate(
                                    'resources.Command.fields.basket.tax_rate'
                                )}
                            </TableCell>
                            <TableCell className={classes.rightAlignedCell}>
                                {record.taxRate.toLocaleString(undefined, {
                                    style: 'percent',
                                })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell className={classes.boldCell}>
                                {translate(
                                    'resources.Command.fields.basket.total'
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
    }
}

const mapStateToProps = (state, props) => {
    const {
        record: { basket },
    } = props;
    const productIds = basket.map(item => item.product.id);
    return {
        products: productIds
            .map(productId => state.admin.resources.Product.data[productId])
            .filter(r => typeof r !== 'undefined')
            .reduce((prev, next) => {
                prev[next.id] = next;
                return prev;
            }, {}),
    };
};

const enhance = compose(
    translate,
    withStyles(styles),
    connect(
        mapStateToProps,
        {
            crudGetMany: crudGetManyAction,
        }
    )
);

export default enhance(Basket);
