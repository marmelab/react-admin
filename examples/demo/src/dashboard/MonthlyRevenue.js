import React from 'react';
import compose from 'recompose/compose';
import { translate, Query, GET_LIST } from 'react-admin';

import Card from '@material-ui/core/Card';
import DollarIcon from '@material-ui/icons/AttachMoney';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CardIcon from './CardIcon';

const styles = {
    main: {
        flex: '1',
        marginRight: '1em',
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

const recentOrdersToMonthlyRevenue = orders =>
    orders.filter(order => order.status !== 'cancelled').reduce((revenue, order) => revenue + order.total, 0);

const MonthlyRevenue = ({ value, translate, classes }) => (
    <div className={classes.main}>
        <CardIcon Icon={DollarIcon} bgColor="#31708f" />
        <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary">
                {translate('pos.dashboard.monthly_revenue')}
            </Typography>
            <Query type={GET_LIST} resource="commands" payload={payload}>
                {({ data }) => (
                    <Typography variant="headline" component="h2">
                        {data &&
                            recentOrdersToMonthlyRevenue(data).toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
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

export default enhance(MonthlyRevenue);
