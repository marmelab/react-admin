import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'material-ui/Menu';
import DashboardIcon from 'material-ui-icons/Dashboard';
import { withStyles } from 'material-ui/styles';
import Link from '../Link';
import translate from '../../i18n/translate';

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
    <MenuItem onClick={onClick}>
        <Link to="/" className={classes.link}>
            <DashboardIcon style={iconPaddingStyle} />
            {translate('ra.page.dashboard')}
        </Link>
    </MenuItem>
);

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    onClick: PropTypes.func,
    translate: PropTypes.func.isRequired,
};

export default withStyles(styles)(translate(DashboardMenuItem));
