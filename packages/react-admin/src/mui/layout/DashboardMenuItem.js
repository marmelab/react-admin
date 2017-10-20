import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'material-ui/Menu';
import DashboardIcon from 'material-ui-icons/Dashboard';
import Link from '../Link';
import translate from '../../i18n/translate';

const DashboardMenuItem = ({ onClick, translate }) => (
    <MenuItem
        containerElement={<Link to="/" />}
        primaryText={translate('ra.page.dashboard')}
        leftIcon={<DashboardIcon />}
        onClick={onClick}
    />
);

DashboardMenuItem.propTypes = {
    onClick: PropTypes.func,
    translate: PropTypes.func.isRequired,
};

export default translate(DashboardMenuItem);
