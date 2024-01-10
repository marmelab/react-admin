import * as React from 'react';
import { Card, CardHeader, List } from '@mui/material';
import { useTranslate } from 'react-admin';

import { Order } from '../types';
import { PendingOrder } from './PendingOrder';

interface Props {
    orders?: Order[];
}

const PendingOrders = (props: Props) => {
    const { orders = [] } = props;
    const translate = useTranslate();

    return (
        <Card sx={{ flex: 1 }}>
            <CardHeader title={translate('pos.dashboard.pending_orders')} />
            <List dense={true}>
                {orders.map(record => (
                    <PendingOrder key={record.id} order={record} />
                ))}
            </List>
        </Card>
    );
};

export default PendingOrders;
