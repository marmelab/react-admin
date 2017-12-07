import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { MenuItem } from 'material-ui/Menu';
import ExitIcon from 'material-ui-icons/PowerSettingsNew';
import classnames from 'classnames';
import { withStyles } from 'material-ui/styles';

import translate from '../../i18n/translate';
import { userLogout as userLogoutAction } from '../../actions/authActions';

const styles = {
    iconPaddingStyle: { paddingRight: '0.5em' },
};

const sanitizeRestProps = ({
    classes,
    className,
    translate,
    userLogout,
    locale,
    ...rest
}) => rest;
/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
const Logout = ({ classes, className, translate, userLogout, ...rest }) => (
    <MenuItem
        className={classnames('logout', className)}
        onClick={userLogout}
        {...sanitizeRestProps(rest)}
    >
        <ExitIcon className={classes.iconPaddingStyle} />
        {translate('ra.auth.logout')}
    </MenuItem>
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

const mapDispatchToProps = (dispatch, { redirectTo = '/login' }) => ({
    userLogout: () => dispatch(userLogoutAction(redirectTo)),
});

const enhance = compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles)
);

export default enhance(Logout);
