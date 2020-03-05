import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';
import { Customer, Order } from '../types';

interface Props {
    orders?: Order[];
    customers?: { [key: string]: Customer };
}

const useStyles = makeStyles(theme => ({
    root: {
        flex: 1,
    },
    cost: {
        marginRight: '1em',
        color: theme.palette.text.primary,
    },
}));

const PendingOrders: FC<Props> = ({ orders = [], customers = {} }) => {
    const classes = useStyles();
    const translate = useTranslate();
    return (
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
                        <ListItemAvatar>
                            {customers[record.customer_id] ? (
                                <Avatar
                                    src={`${
                                        customers[record.customer_id].avatar
                                    }?size=32x32`}
                                />
                            ) : (
                                <Avatar />
                            )}
                        </ListItemAvatar>
                        <ListItemText
                            primary={new Date(record.date).toLocaleString(
                                'en-GB'
                            )}
                            secondary={translate('pos.dashboard.order.items', {
                                smart_count: record.basket.length,
                                nb_items: record.basket.length,
                                customer_name: customers[record.customer_id]
                                    ? `${
                                          customers[record.customer_id]
                                              .first_name
                                      } ${
                                          customers[record.customer_id]
                                              .last_name
                                      }`
                                    : '',
                            })}
                        />
                        <ListItemSecondaryAction>
                            <span className={classes.cost}>
                                {record.total}$
                            </span>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Card>
    );
};

export default PendingOrders;
