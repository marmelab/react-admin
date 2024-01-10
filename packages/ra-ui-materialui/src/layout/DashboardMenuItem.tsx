import React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useBasename } from 'ra-core';

import { MenuItemLink, MenuItemLinkProps } from './MenuItemLink';
import { To } from 'history';

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

export interface DashboardMenuItemProps extends Omit<MenuItemLinkProps, 'to'> {
    to?: To;
    /**
     * @deprecated
     */
    sidebarIsOpen?: boolean;
}

DashboardMenuItem.propTypes = {
    leftIcon: PropTypes.element,
    locale: PropTypes.string,
    onClick: PropTypes.func,
    dense: PropTypes.bool,
    sidebarIsOpen: PropTypes.bool,
};
