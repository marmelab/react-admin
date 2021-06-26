import * as React from 'react';
import { FC } from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useTranslate } from 'ra-core';

import MenuItemLink from './MenuItemLink';

const DashboardMenuItem: FC<DashboardMenuItemProps> = ({
    locale,
    ...props
}) => {
    const translate = useTranslate();
    return (
        <MenuItemLink
            to="/"
            primaryText={translate('ra.page.dashboard')}
            leftIcon={<DashboardIcon />}
            exact
            {...props}
        />
    );
};

export interface DashboardMenuItemProps {
    classes?: object;
    locale?: string;
    onClick?: () => void;
    dense?: boolean;
    /**
     * @deprcated
     */
    sidebarIsOpen?: boolean;
}

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    locale: PropTypes.string,
    onClick: PropTypes.func,
    dense: PropTypes.bool,
    sidebarIsOpen: PropTypes.bool,
};

export default DashboardMenuItem;
