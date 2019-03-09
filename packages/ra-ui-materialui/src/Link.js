import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link as RRLink } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/core/styles';

const styles = theme => createStyles({
    link: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
    },
});
/**
 * @deprecated Use react-router-dom's Link instead
 */
const Link = ({ to, children, className, classes, ...rest }) => (
    <RRLink to={to} className={classNames(classes.link, className)} {...rest}>
        {children}
    </RRLink>
);
Link.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    children: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default withStyles(styles)(Link);
