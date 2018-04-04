import React from 'react';
import compose from 'recompose/compose';
import Card, { CardHeader } from 'material-ui/Card';
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import { translate } from 'react-admin';

const style = theme => ({
    root: {
        flex: 1,
    },
    avatar: {
        background: theme.palette.background.contentFrame,
    },
    cost: {
        marginRight: '1em',
        position: 'absolute',
        top: '1em',
        right: 0,
        color: theme.palette.text.primary,
    },
});

const PendingOrders = ({ orders = [], customers = {}, translate, classes }) => (
    <Card className={classes.root}>
        <CardHeader title={translate('pos.dashboard.pending_orders')} />
        <List dense={true}>
            {orders.map(record => (
                <ListItem
                    key={record.id}
                    button
                    component={Link}
                    to={`/commands/${record.id}`}
                >
                    {customers[record.customer_id] ? (
                        <Avatar
                            className={classes.avatar}
                            src={`${customers[record.customer_id]
                                .avatar}?size=32x32`}
                        />
                    ) : (
                        <Avatar />
                    )}
                    <ListItemText
                        primary={new Date(record.date).toLocaleString('en-GB')}
                        secondary={translate('pos.dashboard.order.items', {
                            smart_count: record.basket.length,
                            nb_items: record.basket.length,
                            customer_name: customers[record.customer_id]
                                ? `${customers[record.customer_id]
                                      .first_name} ${customers[
                                      record.customer_id
                                  ].last_name}`
                                : '',
                        })}
                    />
                    <ListItemSecondaryAction>
                        <span className={classes.cost}>{record.total}$</span>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    </Card>
);

const enhance = compose(withStyles(style), translate);

export default enhance(PendingOrders);
