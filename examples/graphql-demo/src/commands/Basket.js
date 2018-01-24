import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table, {
    TableBody,
    TableHead,
    TableCell,
    TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { translate, crudGetMany as crudGetManyAction } from 'react-admin';
import compose from 'recompose/compose';

class Basket extends Component {
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        const { record: { basket }, crudGetMany } = this.props;
        crudGetMany('Product', basket.map(item => item.product_id));
    }
    render() {
        const { record, products, translate } = this.props;
        const { basket } = record;
        return (
            <Paper style={{ width: '42em', float: 'right', zIndex: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {translate(
                                    'resources.Command.fields.basket.reference'
                                )}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right' }}>
                                {translate(
                                    'resources.Command.fields.basket.unit_price'
                                )}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right' }}>
                                {translate(
                                    'resources.Command.fields.basket.quantity'
                                )}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right' }}>
                                {translate(
                                    'resources.Command.fields.basket.total'
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
                                            {
                                                products[item.product_id]
                                                    .reference
                                            }
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'right' }}
                                        >
                                            {products[
                                                item.product_id
                                            ].price.toLocaleString(undefined, {
                                                style: 'currency',
                                                currency: 'USD',
                                            })}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'right' }}
                                        >
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'right' }}
                                        >
                                            {(products[item.product_id].price *
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
                            <TableCell style={{ textAlign: 'right' }}>
                                {record.total_ex_taxes.toLocaleString(
                                    undefined,
                                    { style: 'currency', currency: 'USD' }
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell>
                                {translate(
                                    'resources.Command.fields.basket.delivery'
                                )}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right' }}>
                                {record.delivery_fees.toLocaleString(
                                    undefined,
                                    { style: 'currency', currency: 'USD' }
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell>
                                {translate(
                                    'resources.Command.fields.basket.tax_rate'
                                )}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right' }}>
                                {record.tax_rate.toLocaleString(undefined, {
                                    style: 'percent',
                                })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} />
                            <TableCell style={{ fontWeight: 'bold' }}>
                                {translate(
                                    'resources.Command.fields.basket.total'
                                )}
                            </TableCell>
                            <TableCell
                                style={{
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                }}
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
    const productIds = basket.map(item => item.product_id);
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
    connect(mapStateToProps, {
        crudGetMany: crudGetManyAction,
    })
);

export default enhance(Basket);
