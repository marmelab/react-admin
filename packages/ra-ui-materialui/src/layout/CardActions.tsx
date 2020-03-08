import React from 'react';
import PropTypes from 'prop-types';
import { warning } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
    {
        cardActions: {
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            padding: 0,
        },
    },
    { name: 'RaCardActions' }
);

const CardActions = ({ className, children, ...rest }) => {
    warning(
        true,
        '<CardActions> is deprecated. Please use the <TopToolbar> component instead to wrap your action buttons'
    );
    const classes = useStyles({}); // the empty {} is a temp fix for https://github.com/mui-org/material-ui/issues/15942
    return (
        <div className={classnames(classes.cardActions, className)} {...rest}>
            {children}
        </div>
    );
};

CardActions.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default CardActions;
