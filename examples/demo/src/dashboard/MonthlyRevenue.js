import React from 'react';
import Card from 'material-ui/Card';
import DollarIcon from '@material-ui/icons/AttachMoney';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { translate } from 'react-admin';

import CardIcon from './CardIcon';

const styles = {
    main: {
        flex: '1',
        marginRight: '1em',
        marginTop: 20,
    },
    card: {
        overflow: 'inherit',
        textAlign: 'right',
        padding: 16,
        minHeight: 52,
    },
};

const MonthlyRevenue = ({ value, translate, classes }) => (
    <div className={classes.main}>
        <CardIcon Icon={DollarIcon} bgColor="#31708f" />
        <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary">
                {translate('pos.dashboard.monthly_revenue')}
            </Typography>
            <Typography variant="headline" component="h2">
                {value}
            </Typography>
        </Card>
    </div>
);

export default translate(withStyles(styles)(MonthlyRevenue));
