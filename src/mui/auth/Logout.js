import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import MenuItem from 'material-ui/MenuItem';
import ExitIcon from 'material-ui/svg-icons/action/power-settings-new';

import translate from '../../i18n/translate';
import { userLogout as userLogoutAction } from '../../actions/authActions';

const Logout = ({ translate, userLogout }) => (
    <MenuItem
        className="logout"
        leftIcon={<ExitIcon />}
        primaryText={translate('aor.auth.logout')}
        onClick={userLogout}
    />
);

Logout.propTypes = {
    translate: PropTypes.func,
    userLogout: PropTypes.func,
};

const enhance = compose(
    translate,
    connect(null, { userLogout: userLogoutAction }),
);

export default enhance(Logout);
