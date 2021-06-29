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

/**
 * Displays a menu item with a label and an icon - or only the icon with a tooltip when the sidebar is minimized.
 * It also handles the automatic closing of the menu on tap on mobile.
 *
 * @typedef {Object} Props the props you can use
 * @prop {string|Location} to The menu item's target. It is passed to a React Router NavLink component.
 * @prop {string|ReactNode} primaryText The menu content, displayed when the menu isn't minimized. |
 * @prop {ReactNode} leftIcon The menu icon
 *
 * Additional props are passed down to the underling material-ui <MenuItem> component
 * @see https://material-ui.com/api/menu-item/#menuitem-api
 *
 * @example // You can create a custom menu component using the <DashboardMenuItem> and <MenuItemLink> components:
 *
 * // in src/Menu.js
 * import * as React from 'react';
 * import { DashboardMenuItem, MenuItemLink } from 'react-admin';
 * import BookIcon from '@material-ui/icons/Book';
 * import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
 * import PeopleIcon from '@material-ui/icons/People';
 * import LabelIcon from '@material-ui/icons/Label';
 *
 * export const Menu = () => (
 *     <div>
 *         <DashboardMenuItem />
 *         <MenuItemLink to="/posts" primaryText="Posts" leftIcon={<BookIcon />}/>
 *         <MenuItemLink to="/comments" primaryText="Comments" leftIcon={<ChatBubbleIcon />}/>
 *         <MenuItemLink to="/users" primaryText="Users" leftIcon={<PeopleIcon />}/>
 *         <MenuItemLink to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>
 *     </div>
 * );
 *
 * // to use this custom menu component, pass it to a custom Layout:
 * // in src/Layout.js
 * import { Layout } from 'react-admin';
 * import { Menu } from './Menu';
 *
 * export const Layout = (props) => <Layout {...props} menu={Menu} />;
 *
 * // then, use this layout in the <Admin layout> prop:
 * // in src/App.js
 * import { Layout }  from './Layout';
 *
 * const App = () => (
 *     <Admin layout={Layout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
 *         // ...
 *     </Admin>
 * );
 */
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
