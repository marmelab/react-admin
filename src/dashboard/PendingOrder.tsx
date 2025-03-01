import * as React from 'react';
import {
    ListItem,
    ListItemSecondaryAction,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Box,
    ListItemButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslate, useReference } from 'react-admin';

import { Customer, Order } from '../types';

interface Props {
    order: Order;
}

export const PendingOrder = (props: Props) => {
    const { order } = props;
    const translate = useTranslate();
    const { referenceRecord: customer, isPending } = useReference<Customer>({
        reference: 'customers',
        id: order.customer_id,
    });

    return (
        <ListItem disablePadding>
            <ListItemButton component={Link} to={`/orders/${order.id}`}>
                <ListItemAvatar>
                    {isPending ? (
                        <Avatar />
                    ) : (
                        <Avatar
                            src={`${customer?.avatar}?size=32x32`}
                            sx={{ bgcolor: 'background.paper' }}
                            alt={`${customer?.first_name} ${customer?.last_name}`}
                        />
                    )}
                </ListItemAvatar>
                <ListItemText
                    primary={new Date(order.date).toLocaleString('en-GB')}
                    secondary={translate('pos.dashboard.order.items', {
                        smart_count: order.basket.length,
                        nb_items: order.basket.length,
                        customer_name: customer
                            ? `${customer.first_name} ${customer.last_name}`
                            : '',
                    })}
                />
                <ListItemSecondaryAction>
                    <Box
                        component="span"
                        sx={{
                            marginRight: '1em',
                            color: 'text.primary',
                        }}
                    >
                        {order.total}$
                    </Box>
                </ListItemSecondaryAction>
            </ListItemButton>
        </ListItem>
    );
};
