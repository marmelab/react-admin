import React from 'react';
import { CardTitle } from 'material-ui/Card';
import withWidth, { SMALL } from 'material-ui/utils/withWidth';
import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ title, width }) =>
    width === SMALL
        ? <AppBarMobile title={title} />
        : <CardTitle title={title} className="title" />;

export default withWidth()(ViewTitle);
