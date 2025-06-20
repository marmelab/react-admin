import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useBasename } from 'ra-core';

import { MenuItemLink, MenuItemLinkProps } from './MenuItemLink';

export const DashboardMenuItem = (props: DashboardMenuItemProps) => {
    const basename = useBasename();
    const {
        leftIcon = <DashboardIcon />,
        to = `${basename}/`,
        primaryText = 'ra.page.dashboard',
        ...rest
    } = props;

    return (
        <MenuItemLink
            leftIcon={leftIcon}
            to={to}
            primaryText={primaryText}
            {...rest}
        />
    );
};

export interface DashboardMenuItemProps
    extends Omit<MenuItemLinkProps, 'to'>,
        Partial<Pick<MenuItemLinkProps, 'to'>> {
    /**
     * @deprecated
     */
    sidebarIsOpen?: boolean;
}
