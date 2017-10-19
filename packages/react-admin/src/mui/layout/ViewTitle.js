import React from 'react';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Hidden from 'material-ui/Hidden';

import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ title }) => [
    <Hidden xsDown key="desktop">
        <CardContent className="title">
            <Typography type="headline">{title}</Typography>
        </CardContent>
    </Hidden>,
    <Hidden smUp key="mobile">
        <AppBarMobile title={title} />
    </Hidden>,
];

export default ViewTitle;
