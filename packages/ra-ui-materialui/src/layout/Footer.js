import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = {
    main: {
        bottom: 0,
    },
};

const Footer = ({
    classes,
    className,
    children,
}) => (
    <div className={classnames(classes.main, className)}>
         { children }
    </div>
);

Footer.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default withStyles(styles)(Footer);
