import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { MenuItem } from 'material-ui/Menu';
import ExitIcon from 'material-ui-icons/PowerSettingsNew';

import translate from '../../i18n/translate';
import { userLogout as userLogoutAction } from '../../actions/authActions';

const iconPaddingStyle = { paddingRight: '0.5em' };

const Logout = ({ translate, userLogout }) => (
    <MenuItem className="logout" onClick={userLogout}>
        <ExitIcon style={iconPaddingStyle} />
        {translate('ra.auth.logout')}
    </MenuItem>
);

Logout.propTypes = {
    translate: PropTypes.func,
    userLogout: PropTypes.func,
};

const mapStateToProps = state => ({
    theme: state.theme,
});

const enhance = compose(
    translate,
    connect(mapStateToProps, { userLogout: userLogoutAction })
);

export default enhance(Logout);
