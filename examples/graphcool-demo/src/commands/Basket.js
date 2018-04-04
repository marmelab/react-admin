import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Table, {
    TableBody,
    TableHead,
    TableCell,
    TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { translate, crudGetMany as crudGetManyAction } from 'react-admin';
import compose from 'recompose/compose';
import withStyles from 'material-ui/styles/withStyles';

const styles = {
    container: {
        width: '42em',
        float: 'right',
        zIndex: 2,
        '&:after': { clear: 'both' },
    },
    rightAlignedCell: { textAlign: 'right' },
    boldCell: { fontWeight: 'bold' },
};

class Basket extends Component {
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        const { record: { basket }, crudGetMany } = this.props;
        crudGetMany('Product', basket.map(item => item['product.id']));
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
                                item.product &&
                                products[item.product.id] && (
                                    <TableRow key={item.product.id}>
                                        <TableCell>
                                            {
                                                products[item.product.id]
                                                    .reference
                                            }
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
                                            {(products[item.product.id].price *
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
    const { record: { basket } } = props;
    const productIds = basket.map(item => item['product.id']);
    return {
        products: productIds
            .map(productId => state.admin.resources.Product.data[productId])
            .filter(r => r != undefined) // eslint-disable-line eqeqeq
            .reduce((prev, next) => {
                prev[next.id] = next;
                return prev;
            }, {}),
    };
};

const enhance = compose(
    translate,
    connect(mapStateToProps, {
        crudGetMany: crudGetManyAction,
    }),
    withStyles(styles)
);

export default enhance(Basket);
