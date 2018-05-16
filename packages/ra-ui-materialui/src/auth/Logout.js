import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import classnames from 'classnames';
import { translate, userLogout as userLogoutAction } from 'ra-core';

import Responsive from '../layout/Responsive';

const styles = theme => ({
    menuItem: {
        color: theme.palette.text.secondary,
    },
    iconPaddingStyle: { paddingRight: '1.2em' },
});

const sanitizeRestProps = ({
    classes,
    className,
    translate,
    userLogout,
    locale,
    redirectTo,
    ...rest
}) => rest;
/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
const Logout = ({ classes, className, translate, userLogout, ...rest }) => (
    <Responsive
        xsmall={
            <MenuItem
                className={classnames('logout', classes.menuItem, className)}
                onClick={userLogout}
                {...sanitizeRestProps(rest)}
            >
                <ExitIcon className={classes.iconPaddingStyle} />
                {translate('ra.auth.logout')}
            </MenuItem>
        }
        medium={
            <Button
                className={classnames('logout', className)}
                onClick={userLogout}
                size="small"
                {...sanitizeRestProps(rest)}
            >
                <ExitIcon className={classes.iconPaddingStyle} />
                {translate('ra.auth.logout')}
            </Button>
        }
    />
);

Logout.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    translate: PropTypes.func,
    userLogout: PropTypes.func,
    redirectTo: PropTypes.string,
};

const mapStateToProps = state => ({
    theme: state.theme,
});

const mapDispatchToProps = (dispatch, { redirectTo }) => ({
    userLogout: () => dispatch(userLogoutAction(redirectTo)),
});

const enhance = compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles)
);

export default enhance(Logout);
