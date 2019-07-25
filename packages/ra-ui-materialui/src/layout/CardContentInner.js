import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, createStyles } from '@material-ui/core/styles';

var useStyles = makeStyles(theme =>
    createStyles({
        root: {
            paddingTop: 0,
            paddingBottom: 0,
            '&:first-child': {
                paddingTop: 16,
            },
            '&:last-child': {
                paddingBottom: 16,
                [theme.breakpoints.only('xs')]: {
                    paddingBottom: 70,
                },
            },
        },
    })
);

/**
 * Overrides material-ui CardContent to allow inner content
 *
 * When using several CardContent inside the same Card, the top and bottom
 * padding double the spacing between each CardContent, leading to too much
 * wasted space. Use this component as a CardContent alternative.
 */
const CardContentInner = ({ className, children }) => {
    const classes = useStyles();

    return (
        <CardContent className={classnames(classes.root, className)}>
            {children}
        </CardContent>
    );
};

CardContentInner.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default CardContentInner;
