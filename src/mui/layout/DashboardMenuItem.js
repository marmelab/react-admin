import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import { Link } from 'react-router-dom';
import translate from '../../i18n/translate';

const DashboardMenuItem = ({ onClick, translate }) => (
    <MenuItem
        containerElement={<Link to="/" />}
        primaryText={translate('aor.page.dashboard')}
        leftIcon={<DashboardIcon />}
        onClick={onClick}
    />
);

DashboardMenuItem.propTypes = {
    onClick: PropTypes.func,
    translate: PropTypes.func.isRequired,
};

export default translate(DashboardMenuItem);
