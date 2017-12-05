import React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from 'material-ui-icons/Dashboard';
import { withStyles } from 'material-ui/styles';
import translate from '../../i18n/translate';
import MenuItemLink from './MenuItemLink';

const iconPaddingStyle = { paddingRight: '0.5em' };

const styles = {
    link: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
    },
};

const DashboardMenuItem = ({ classes, onClick, translate }) => (
    <MenuItemLink
        onClick={onClick}
        to="/"
        className={classes.link}
        primaryText={translate('ra.page.dashboard')}
        leftIcon={<DashboardIcon style={iconPaddingStyle} />}
    />
);

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    onClick: PropTypes.func,
    translate: PropTypes.func.isRequired,
};

export default withStyles(styles)(translate(DashboardMenuItem));
