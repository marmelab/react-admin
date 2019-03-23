import React from 'react';
import compose from 'recompose/compose';
import { translate, Query, GET_LIST } from 'react-admin';

import Card from '@material-ui/core/Card';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CardIcon from './CardIcon';

const styles = {
    main: {
        flex: '1',
        marginLeft: '1em',
        marginTop: 20
    },
    card: {
        overflow: 'inherit',
        textAlign: 'right',
        padding: 16,
        minHeight: 52
    }
};

const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);
const payload = {
    filter: { date_gte: aMonthAgo.toISOString() },
    sort: { field: 'date', order: 'DESC' },
    pagination: { page: 1, perPage: 50 }
};

const NbNewOrders = ({ translate, classes }) => (
    <div className={classes.main}>
        <CardIcon Icon={ShoppingCartIcon} bgColor="#ff9800" />
        <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary">
                {translate('pos.dashboard.new_orders')}
            </Typography>
            <Query type={GET_LIST} resource="commands" payload={payload}>
                {({ data: orders }) => (
                    <Typography variant="headline" component="h2">
                        {orders && orders.filter(order => order.status !== 'cancelled').length}
                    </Typography>
                )}
            </Query>
        </Card>
    </div>
);

const enhance = compose(
    withStyles(styles),
    translate
);

export default enhance(NbNewOrders);
