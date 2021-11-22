import React, {
    forwardRef,
    cloneElement,
    useCallback,
    ReactElement,
    ReactNode,
} from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Link, LinkProps, useMatch } from 'react-router-dom';
import { ReduxState, setSidebarVisibility } from 'ra-core';
import {
    MenuItem,
    MenuItemProps,
    ListItemIcon,
    Tooltip,
    TooltipProps,
    useMediaQuery,
    Theme,
} from '@mui/material';

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
 * import BookIcon from '@mui/icons-material/Book';
 * import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
 * import PeopleIcon from '@mui/icons-material/People';
 * import LabelIcon from '@mui/icons-material/Label';
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
export const MenuItemLink = forwardRef((props: MenuItemLinkProps, ref) => {
    const {
        className,
        primaryText,
        leftIcon,
        onClick,
        sidebarIsOpen,
        tooltipProps,
        ...rest
    } = props;

    const dispatch = useDispatch();
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
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

    const match = useMatch(
        typeof props.to === 'string' ? props.to : props.to.pathname
    );

    const renderMenuItem = () => {
        return (
            <StyledMenuItem
                // @ts-ignore
                className={classnames(MenuItemLinkClasses.root, className, {
                    [MenuItemLinkClasses.active]: !!match,
                })}
                component={LinkRef}
                // @ts-ignore
                ref={ref}
                tabIndex={0}
                {...rest}
                onClick={handleMenuTap}
            >
                {leftIcon && (
                    <ListItemIcon className={MenuItemLinkClasses.icon}>
                        {cloneElement(leftIcon, {
                            titleAccess: primaryText,
                        })}
                    </ListItemIcon>
                )}
                {primaryText}
            </StyledMenuItem>
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
    /**
     * @deprecated
     */
    sidebarIsOpen?: boolean;
    tooltipProps?: TooltipProps;
}

export type MenuItemLinkProps = Props &
    LinkProps &
    MenuItemProps<'li', { button?: true }>; // HACK: https://github.com/mui-org/material-ui/issues/16245

MenuItemLink.propTypes = {
    className: PropTypes.string,
    leftIcon: PropTypes.element,
    onClick: PropTypes.func,
    primaryText: PropTypes.node,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    sidebarIsOpen: PropTypes.bool,
};

const PREFIX = 'RaMenuItemLink';

export const MenuItemLinkClasses = {
    root: `${PREFIX}-root`,
    active: `${PREFIX}-active`,
    icon: `${PREFIX}-icon`,
};

const StyledMenuItem = styled(MenuItem, { name: PREFIX })(({ theme }) => ({
    [`&.${MenuItemLinkClasses.root}`]: {
        color: theme.palette.text.secondary,
    },

    [`&.${MenuItemLinkClasses.active}`]: {
        color: theme.palette.text.primary,
    },

    [`& .${MenuItemLinkClasses.icon}`]: { minWidth: theme.spacing(5) },
}));

const LinkRef = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
    <Link ref={ref} {...props} />
));
