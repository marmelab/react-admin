import React from 'react';
import { CardContent } from 'material-ui/Card';
import withWidth from 'material-ui/utils/withWidth';
import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ title, width }) =>
    width === 1 ? (
        <AppBarMobile title={title} />
    ) : (
        <CardContent title={title} className="title" />
    );

export default withWidth()(ViewTitle);
