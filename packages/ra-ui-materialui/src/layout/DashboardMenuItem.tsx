import * as React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTranslate, useBasename } from 'ra-core';

import { MenuItemLink } from './MenuItemLink';

export const DashboardMenuItem = (props: DashboardMenuItemProps) => {
    const { locale, ...rest } = props;
    const translate = useTranslate();
    const basename = useBasename();
    return (
        <MenuItemLink
            to={`${basename}/`}
            primaryText={translate('ra.page.dashboard')}
            leftIcon={<DashboardIcon />}
            {...rest}
        />
    );
};

export interface DashboardMenuItemProps {
    locale?: string;
    onClick?: () => void;
    dense?: boolean;
    /**
     * @deprecated
     */
    sidebarIsOpen?: boolean;
}

DashboardMenuItem.propTypes = {
    locale: PropTypes.string,
    onClick: PropTypes.func,
    dense: PropTypes.bool,
    sidebarIsOpen: PropTypes.bool,
};
