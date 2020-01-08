import React, {
    forwardRef,
    cloneElement,
    useCallback,
    FC,
    ReactElement,
    ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { StaticContext } from 'react-router';
import { NavLink, NavLinkProps } from 'react-router-dom';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const NavLinkRef = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => (
    <NavLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(
    theme => ({
        root: {
            color: theme.palette.text.secondary,
        },
        active: {
            color: theme.palette.text.primary,
        },
        icon: { minWidth: theme.spacing(5) },
    }),
    { name: 'RaMenuItemLink' }
);

const MenuItemLink: FC<MenuItemLinkProps> = forwardRef(
    (
        {
            classes: classesOverride,
            className,
            primaryText,
            leftIcon,
            onClick,
            sidebarIsOpen,
            ...props
        },
        ref
    ) => {
        const classes = useStyles({ classes: classesOverride });

        const handleMenuTap = useCallback(
            e => {
                onClick && onClick(e);
            },
            [onClick]
        );

        const renderMenuItem = () => {
            return (
                <MenuItem
                    className={classnames(classes.root, className)}
                    activeClassName={classes.active}
                    component={NavLinkRef}
                    ref={ref}
                    {...props}
                    onClick={handleMenuTap}
                >
                    {leftIcon && (
                        <ListItemIcon className={classes.icon}>
                            {cloneElement(leftIcon, {
                                titleAccess: primaryText,
                            })}
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
);

interface Props {
    leftIcon?: ReactElement;
    primaryText?: ReactNode;
    staticContext?: StaticContext;
    sidebarIsOpen: boolean;
}

export type MenuItemLinkProps = Props &
    NavLinkProps &
    MenuItemProps<'li', { button?: true }>; // HACK: https://github.com/mui-org/material-ui/issues/16245

MenuItemLink.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    leftIcon: PropTypes.element,
    onClick: PropTypes.func,
    primaryText: PropTypes.node,
    staticContext: PropTypes.object,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    sidebarIsOpen: PropTypes.bool,
};

export default MenuItemLink;
