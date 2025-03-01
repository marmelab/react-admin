import * as React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: number;
}

const NbNewOrders = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();
    return (
        <CardWithIcon
            to="/orders"
            icon={ShoppingCartIcon}
            title={translate('pos.dashboard.new_orders')}
            subtitle={value}
        />
    );
};

export default NbNewOrders;
