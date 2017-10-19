import React from 'react';
import { CardContent } from 'material-ui/Card';
import Hidden from 'material-ui/Hidden';

import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ title }) => [
    <Hidden xsDowm key="desktop">
        <CardContent title={title} className="title" />
    </Hidden>,
    <Hidden smUp key="mobile">
        <AppBarMobile title={title} />
    </Hidden>,
];

export default ViewTitle;
