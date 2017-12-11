import React from 'react';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Responsive from './Responsive';
import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ title }) => (
    <Responsive
        small={<AppBarMobile title={title} />}
        medium={
            <CardContent className="title">
                <Typography type="headline">{title}</Typography>
            </CardContent>
        }
    />
);

export default ViewTitle;
