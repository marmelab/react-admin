import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link as RRLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        link: {
            textDecoration: 'none',
            color: theme.palette.primary.main,
        },
    }),
    { name: 'RaLink' }
);

const Link = ({
    to,
    children,
    classes: classesOverride,
    className,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    return (
        <RRLink
            to={to}
            className={classNames(classes.link, className)}
            {...rest}
        >
            {children}
        </RRLink>
    );
};

Link.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Link;
