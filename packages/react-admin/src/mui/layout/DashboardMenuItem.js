import React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from 'material-ui-icons/Dashboard';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import translate from '../../i18n/translate';
import MenuItemLink from './MenuItemLink';

const styles = {
    link: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
    },
    icon: { paddingRight: '0.5em' },
};

const DashboardMenuItem = ({ classes, className, onClick, translate }) => (
    <MenuItemLink
        onClick={onClick}
        to="/"
        className={classnames(classes.link, className)}
        primaryText={translate('ra.page.dashboard')}
        leftIcon={<DashboardIcon className={classes.icon} />}
    />
);

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
    translate: PropTypes.func.isRequired,
};

export default withStyles(styles)(translate(DashboardMenuItem));
