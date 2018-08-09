import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';

import Responsive from './Responsive';
import AppBarMobile from './AppBarMobile';

const ViewTitle = ({ className, title, ...rest }) => (
    <Responsive
        xsmall={
            <Fragment>
                <AppBarMobile
                    className={classnames('title', className)}
                    title={title}
                    {...rest}
                />
                <span> </span>
            </Fragment>
        }
        medium={
            <CardContent className={classnames('title', className)} {...rest}>
                <Typography variant="title">{title}</Typography>
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
