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

/**
 * Logout button component, to be passed to the Admin component
 *
 * Used for the Logout Menu item in the sidebar
 */
const Logout = ({ classes, className, translate, userLogout }) => (
    <MenuItem className={classnames('logout', className)} onClick={userLogout}>
        <ExitIcon className={classes.iconPaddingStyle} />
        {translate('ra.auth.logout')}
    </MenuItem>
);

Logout.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    translate: PropTypes.func,
    userLogout: PropTypes.func,
};

const mapStateToProps = state => ({
    theme: state.theme,
});

const enhance = compose(
    translate,
    connect(mapStateToProps, { userLogout: userLogoutAction }),
    withStyles(styles)
);

export default enhance(Logout);
