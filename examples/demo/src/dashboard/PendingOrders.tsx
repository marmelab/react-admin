import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { makeStyles } from '@mui/material/styles';
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

const PendingOrders = (props: Props) => {
    const { orders = [], customers = {} } = props;
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
