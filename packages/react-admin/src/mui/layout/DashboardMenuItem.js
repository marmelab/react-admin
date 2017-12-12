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

<<<<<<< a284b0a08f189ea178d849bbe8272fafcc1af639
const DashboardMenuItem = ({ classes, className, onClick, translate, ...props }) => (
=======
const DashboardMenuItem = ({ classes, onClick, translate, props }) => (
>>>>>>> Fix remaining props name
    <MenuItemLink
        onClick={onClick}
        to="/"
        className={classnames(classes.link, className)}
        primaryText={translate('ra.page.dashboard')}
<<<<<<< a284b0a08f189ea178d849bbe8272fafcc1af639
        leftIcon={<DashboardIcon className={classes.icon} />}
=======
        leftIcon={<DashboardIcon style={iconPaddingStyle} />}
>>>>>>> Fix remaining props name
        {...props}
    />
);

DashboardMenuItem.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
    translate: PropTypes.func.isRequired,
    props: PropTypes.object,
};

export default withStyles(styles)(translate(DashboardMenuItem));
