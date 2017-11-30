import React from 'react';
import PropTypes from 'prop-types';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Responsive from './Responsive';
import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ title, mobileActions, actionProps }) => (
    <Responsive
        small={
            <AppBarMobile
                title={title}
                mobileActions={mobileActions}
                actionProps={actionProps}
            />
        }
        medium={
            <CardContent className="title">
                <Typography type="headline">{title}</Typography>
            </CardContent>
        }
    />
);
ViewTitle.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    mobileActions: PropTypes.element,
    actionProps: PropTypes.object,
};
export default ViewTitle;
