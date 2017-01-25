import React, { Component, PropTypes } from 'react';
import { push as pushAction } from 'react-router-redux';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { List, ListItem } from 'material-ui/List';
import ExitIcon from 'material-ui/svg-icons/action/power-settings-new';

import { Translate } from '../../i18n';

class Logout extends Component {
    handleLogout = () => {
        const { logoutClient, push } = this.props;
        logoutClient()
            .then(() => push('/login'));
    }
    render() {
        const { logoutClient, translate } = this.props;
        return logoutClient ? (
            <List>
                <ListItem leftIcon={<ExitIcon />} primaryText={translate('aor.auth.logout')} onClick={this.handleLogout} />
            </List>
        ) : null;
    }
}

Logout.propTypes = {
    logoutClient: PropTypes.func,
    push: PropTypes.func,
    translate: PropTypes.func,
};

const enhance = compose(
    Translate,
    connect(null, { push: pushAction }),
);

export default enhance(Logout);
