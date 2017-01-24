import React, { Component, PropTypes } from 'react';

import { push as pushAction } from 'react-router-redux';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import ExitIcon from 'material-ui/svg-icons/action/power-settings-new';

import { Translate } from '../../i18n';

class Logout extends Component {
    handleLogout = () => {
        const { logoutClient, push } = this.props;
        logoutClient()
            .then(() => push('/sign-in'));
    }
    render() {
        const { logoutClient, translate } = this.props;
        return logoutClient ? (
            <List>
                <ListItem leftIcon={<ExitIcon />} primaryText={translate('aor.action.logout')} onClick={this.handleLogout} />
            </List>
        ) : null;
    }
}

Logout.propTypes = {
    logoutCient: PropTypes.func,
    push: PropTypes.func,
    translate: PropTypes.func,
};

export default connect(null, { push: pushAction })(Translate(Logout));
