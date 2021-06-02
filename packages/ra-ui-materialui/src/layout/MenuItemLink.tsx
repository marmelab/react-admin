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
import { useDispatch, useSelector } from 'react-redux';
import { StaticContext } from 'react-router';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { ReduxState, setSidebarVisibility } from 'ra-core';
import {
    MenuItem,
    MenuItemProps,
    ListItemIcon,
    Tooltip,
    TooltipProps,
    useMediaQuery,
    Theme,
} from '@material-ui/core';
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

const MenuItemLink: FC<MenuItemLinkProps> = forwardRef((props, ref) => {
    const {
        classes: classesOverride,
        className,
        primaryText,
        leftIcon,
        onClick,
        sidebarIsOpen,
        tooltipProps,
        ...rest
    } = props;
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const handleMenuTap = useCallback(
        e => {
            if (isSmall) {
                dispatch(setSidebarVisibility(false));
            }
            onClick && onClick(e);
        },
        [dispatch, isSmall, onClick]
    );

    const renderMenuItem = () => {
        return (
            <MenuItem
                className={classnames(classes.root, className)}
                activeClassName={classes.active}
                component={NavLinkRef}
                ref={ref}
                tabIndex={0}
                {...rest}
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

    return open ? (
        renderMenuItem()
    ) : (
        <Tooltip title={primaryText} placement="right" {...tooltipProps}>
            {renderMenuItem()}
        </Tooltip>
    );
});

interface Props {
    leftIcon?: ReactElement;
    primaryText?: ReactNode;
    staticContext?: StaticContext;
    /**
     * @deprecated
     */
    sidebarIsOpen?: boolean;
    tooltipProps?: TooltipProps;
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
