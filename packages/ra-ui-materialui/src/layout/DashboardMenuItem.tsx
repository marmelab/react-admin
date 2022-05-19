import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTranslate, useBasename } from 'ra-core';

import { MenuItemLink } from './MenuItemLink';

export const DashboardMenuItem = (props: DashboardMenuItemProps) => {
    const { locale, leftIcon = <DashboardIcon />, ...rest } = props;
    const translate = useTranslate();
    const basename = useBasename();
    return (
        <MenuItemLink
            to={`${basename}/`}
            primaryText={translate('ra.page.dashboard')}
            leftIcon={leftIcon}
            {...rest}
        />
    );
};

export interface DashboardMenuItemProps {
    leftIcon?: ReactElement;
    locale?: string;
    onClick?: () => void;
    dense?: boolean;
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
