import * as React from 'react';
import { ReactNode } from 'react';
import { MenuList } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import clsx from 'clsx';

import { DRAWER_WIDTH, CLOSED_DRAWER_WIDTH } from './Sidebar';
import { useSidebarState } from './useSidebarState';
import { DashboardMenuItem } from './DashboardMenuItem';
import { MenuItemLink } from './MenuItemLink';
import { ResourceMenuItem } from './ResourceMenuItem';
import { ResourceMenuItems } from './ResourceMenuItems';

/**
 * Renders a menu with one menu item per resource by default. You can also set menu items by hand.
 *
 * @example
 * import * as React from 'react';
 * import { Menu } from 'react-admin';
 *
 * import BookIcon from '@mui/icons-material/Book';
 * import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
 * import PeopleIcon from '@mui/icons-material/People';
 * import LabelIcon from '@mui/icons-material/Label';
 *
 * export const MyMenu = () => (
 *     <Menu>
 *         <Menu.DashboardItem />
 *         <Menu.Item to="/posts" primaryText="Posts" leftIcon={<BookIcon />}/>
 *         <Menu.Item to="/comments" primaryText="Comments" leftIcon={<ChatBubbleIcon />}/>
 *         <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />}/>
 *         <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>
 *     </Menu>
 * );
 */
export const Menu = (props: MenuProps) => {
    const {
        hasDashboard,
        children = hasDashboard ? (
            [
                <DashboardMenuItem key="default-dashboard-menu-item" />,
                <ResourceMenuItems key="default-resource-menu-items" />,
            ]
        ) : (
            <ResourceMenuItems />
        ),

        className,
        ...rest
    } = props;

    const [open] = useSidebarState();

    return (
        <Root
            className={clsx(
                {
                    [MenuClasses.open]: open,
                    [MenuClasses.closed]: !open,
                },
                className
            )}
            {...rest}
        >
            {children}
        </Root>
    );
};

// NOTE: We don't extends MenuListProps here to avoid breaking changes
export interface MenuProps {
    children?: ReactNode;
    className?: string;
    dense?: boolean;
    hasDashboard?: boolean;
    [key: string]: any;
}

Menu.propTypes = {
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
};

// re-export MenuItem components for convenience
Menu.Item = MenuItemLink;
Menu.DashboardItem = DashboardMenuItem;
Menu.ResourceItem = ResourceMenuItem;
Menu.ResourceItems = ResourceMenuItems;

const PREFIX = 'RaMenu';

export const MenuClasses = {
    open: `${PREFIX}-open`,
    closed: `${PREFIX}-closed`,
};

const Root = styled(MenuList, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    [theme.breakpoints.only('xs')]: {
        marginTop: 0,
    },
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),

    [`&.${MenuClasses.open}`]: {
        width: lodashGet(theme, 'sidebar.width', DRAWER_WIDTH),
    },

    [`&.${MenuClasses.closed}`]: {
        width: lodashGet(theme, 'sidebar.closedWidth', CLOSED_DRAWER_WIDTH),
    },
}));
