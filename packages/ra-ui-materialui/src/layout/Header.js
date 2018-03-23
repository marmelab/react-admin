import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import ViewTitle from './ViewTitle';

const styles = theme => {
    const backgroundColorDefault =
        theme.palette.type === 'paper'
            ? theme.palette.grey[100]
            : theme.palette.grey[900];

    return {
        root: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        colorDefault: {
            backgroundColor: backgroundColorDefault,
            color: theme.palette.getContrastText(backgroundColorDefault),
        },
        colorPrimary: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        colorSecondary: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
        },
    };
};

export const Header = ({
    classes,
    className,
    title,
    actions,
    actionProps,
    ...rest
}) => (
    <div className={classnames(classes.root, className)} {...rest}>
        <ViewTitle title={title} />
        {actions && React.cloneElement(actions, actionProps)}
    </div>
);

Header.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.any,
    actions: PropTypes.element,
    actionProps: PropTypes.object,
};

export default withStyles(styles)(Header);
