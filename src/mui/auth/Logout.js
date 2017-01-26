import React, { Component, PropTypes } from 'react';
import { push as pushAction } from 'react-router-redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { List, ListItem } from 'material-ui/List';
import ExitIcon from 'material-ui/svg-icons/action/power-settings-new';

import { Translate } from '../../i18n';
import { AUTH_LOGOUT } from '../../auth';

class Logout extends Component {
    handleLogout = () => {
        const { authClient, push } = this.props;
        authClient(AUTH_LOGOUT)
            .then(() => push('/login'));
    }
    render() {
        const { authClient, translate } = this.props;
        return authClient ? (
            <List>
                <ListItem leftIcon={<ExitIcon />} primaryText={translate('aor.auth.logout')} onClick={this.handleLogout} />
            </List>
        ) : null;
    }
}

Logout.propTypes = {
    authClient: PropTypes.func,
    push: PropTypes.func,
    translate: PropTypes.func,
};

const enhance = compose(
    Translate,
    connect(null, { push: pushAction }),
);

export default enhance(Logout);
