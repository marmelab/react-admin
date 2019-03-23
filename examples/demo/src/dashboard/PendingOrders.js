import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { translate, Query, GET_LIST, GET_ONE } from 'react-admin';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import CustomerAvatar from './CustomerAvatar';

const style = theme => ({
    root: {
        flex: 1
    },
    avatar: {
        background: theme.palette.background.avatar
    },
    cost: {
        marginRight: '1em',
        color: theme.palette.text.primary
    }
});

const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);
const payload = {
    filter: { status: 'ordered', date_gte: aMonthAgo.toISOString() },
    sort: { field: 'date', order: 'DESC' },
    pagination: { page: 1, perPage: 50 }
};

const PendingOrders = ({ translate, classes }) => (
    <Card className={classes.root}>
        <CardHeader title={translate('pos.dashboard.pending_orders')} />
        <Query type={GET_LIST} resource="commands" payload={payload}>
            {({ data: orders }) => (
                <List dense={true}>
                    {orders &&
                        orders.map(record => (
                            <ListItem key={record.id} button component={Link} to={`/commands/${record.id}`}>
                                <CustomerAvatar record={record} classes={classes} />
                                <Query type={GET_ONE} resource="customers" payload={{ id: record.customer_id }}>
                                    {({ data: customer }) => (
                                        <ListItemText
                                            primary={new Date(record.date).toLocaleString('en-GB')}
                                            secondary={translate('pos.dashboard.order.items', {
                                                smart_count: record.basket.length,
                                                nb_items: record.basket.length,
                                                customer_name: customer
                                                    ? `${customer.first_name} ${customer.last_name}`
                                                    : ''
                                            })}
                                        />
                                    )}
                                </Query>
                                <ListItemSecondaryAction>
                                    <span className={classes.cost}>{record.total}$</span>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                </List>
            )}
        </Query>
    </Card>
);

const enhance = compose(
    withStyles(style),
    translate
);

export default enhance(PendingOrders);
