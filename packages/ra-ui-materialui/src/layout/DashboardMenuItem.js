import React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useTranslate } from 'ra-core';

import MenuItemLink from './MenuItemLink';

const DashboardMenuItem = ({ className, locale, onClick, ...props }) => {
    const translate = useTranslate();
    return (
        <MenuItemLink
            onClick={onClick}
            to="/"
            primaryText={translate('ra.page.dashboard')}
            leftIcon={DashboardIcon}
            exact
            {...props}
        />
    );
};

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    locale: PropTypes.string,
    onClick: PropTypes.func,
};

export default DashboardMenuItem;
