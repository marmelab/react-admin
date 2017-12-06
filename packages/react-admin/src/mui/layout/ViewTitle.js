import React from 'react';
import PropTypes from 'prop-types';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import classnames from 'classnames';

import Responsive from './Responsive';
import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ className, title }) => (
    <Responsive
        small={<AppBarMobile className={className} title={title} />}
        medium={
            <CardContent className={classnames('title', className)}>
                <Typography type="headline">{title}</Typography>
            </CardContent>
        }
    />
);

ViewTitle.propTypes = {
    className: PropTypes.string,
};

export default ViewTitle;
