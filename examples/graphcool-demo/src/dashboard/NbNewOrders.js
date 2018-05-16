import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { translate } from 'react-admin';

const styles = {
    card: { borderLeft: 'solid 4px #ff9800', flex: 1, marginLeft: '1em' },
    icon: {
        float: 'right',
        width: 64,
        height: 64,
        padding: 16,
        color: '#ff9800',
    },
};

export default translate(({ value, translate }) => (
    <Card style={styles.card}>
        <ShoppingCartIcon style={styles.icon} />
        <CardHeader
            title={value}
            subheader={translate('pos.dashboard.new_orders')}
        />
    </Card>
));
