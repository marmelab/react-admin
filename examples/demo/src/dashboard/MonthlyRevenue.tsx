import * as React from 'react';
import DollarIcon from '@mui/icons-material/AttachMoney';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';

interface Props {
    value?: string;
}

const MonthlyRevenue = (props: Props) => {
    const { value } = props;
    const translate = useTranslate();
    return (
        <CardWithIcon
            to="/commands"
            icon={DollarIcon}
            title={translate('pos.dashboard.monthly_revenue')}
            subtitle={value}
        />
    );
};

export default MonthlyRevenue;
