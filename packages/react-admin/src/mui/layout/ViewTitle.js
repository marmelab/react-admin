import React from 'react';
import PropTypes from 'prop-types';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import classnames from 'classnames';

import Responsive from './Responsive';
import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ className, title, ...rest }) => (
    <Responsive
        small={
            <AppBarMobile
                className={classnames('title', className)}
                title={title}
                {...rest}
            />
        }
        medium={
            <CardContent className={classnames('title', className)} {...rest}>
                <Typography variant="headline">{title}</Typography>
            </CardContent>
        }
    />
);

ViewTitle.propTypes = {
    className: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
};

export default ViewTitle;
