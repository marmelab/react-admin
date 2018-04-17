import React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { translate } from 'ra-core';

import MenuItemLink from './MenuItemLink';

const DashboardMenuItem = ({ className, onClick, translate, ...props }) => (
    <MenuItemLink
        onClick={onClick}
        to="/"
        primaryText={translate('ra.page.dashboard')}
        leftIcon={<DashboardIcon />}
        exact
        {...props}
    />
);

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
    translate: PropTypes.func.isRequired,
};

export default translate(DashboardMenuItem);
