import React, { Component, PropTypes } from 'react';
import { push as pushAction } from 'react-router-redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { ListItem } from 'material-ui/List';
import ExitIcon from 'material-ui/svg-icons/action/power-settings-new';

import translate from '../../i18n/translate';
import { AUTH_LOGOUT } from '../../auth';

class Logout extends Component {
    handleLogout = () => {
        const { authClient, push } = this.props;
        authClient(AUTH_LOGOUT)
            .then(() => push('/login'));
    }
    render() {
        const { authClient, translate } = this.props;
        return authClient
         ? <ListItem leftIcon={<ExitIcon />} primaryText={translate('aor.auth.logout')} onClick={this.handleLogout} />
         : null;
    }
}

Logout.propTypes = {
    authClient: PropTypes.func,
    push: PropTypes.func,
    translate: PropTypes.func,
};

const enhance = compose(
    translate,
    connect(null, { push: pushAction }),
);

export default enhance(Logout);
