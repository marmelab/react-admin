import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const NavLinkRef = React.forwardRef((props, ref) => (
    <NavLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.secondary,
    },
    active: {
        color: theme.palette.text.primary,
    },
    icon: { minWidth: theme.spacing(5) },
}));

function MenuItemLink({
    classes: classesOverride,
    className,
    primaryText,
    leftIcon,
    onClick,
    sidebarIsOpen,
    ...props
}) {
    const classes = useStyles({ classes: classesOverride });

    const handleMenuTap = e => {
        onClick && onClick(e);
    };

    const renderMenuItem = () => {
        return (
            <MenuItem
                className={classnames(classes.root, className)}
                activeClassName={classes.active}
                component={NavLinkRef}
                {...props}
                onClick={handleMenuTap}
            >
                {leftIcon && (
                    <ListItemIcon className={classes.icon}>
                        {cloneElement(leftIcon, { titleAccess: primaryText })}
                    </ListItemIcon>
                )}
                {primaryText}
            </MenuItem>
        );
    };

    if (sidebarIsOpen) {
        return renderMenuItem();
    }

    return (
        <Tooltip title={primaryText} placement="right">
            {renderMenuItem()}
        </Tooltip>
    );
}

MenuItemLink.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    leftIcon: PropTypes.element,
    onClick: PropTypes.func,
    primaryText: PropTypes.node,
    staticContext: PropTypes.object,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default MenuItemLink;
