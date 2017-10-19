import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';

import { hideNotification as hideNotificationAction } from '../../actions/notificationActions';
import translate from '../../i18n/translate';

const styles = theme => {
    const type = theme.palette.type === 'light' ? 'dark' : 'light';
    const confirm = theme.palette.shades[type].background.default;
    const warning = theme.palette.error.A100;
    return {
        confirm: {
            backgroundColor: confirm,
        },
        warning: {
            backgroundColor: warning,
        },
    };
};

class Notification extends React.Component {
    handleRequestClose = () => {
        this.props.hideNotification();
    };

    render() {
        const {
            classes,
            type,
            translate,
            message,
            autoHideDuration,
        } = this.props;
        return (
            <Snackbar
                open={!!message}
                message={!!message && translate(message)}
                autoHideDuration={autoHideDuration}
                onRequestClose={this.handleRequestClose}
                className={classes[type]}
            />
        );
    }
}

Notification.propTypes = {
    classes: PropTypes.object,
    message: PropTypes.string,
    type: PropTypes.string.isRequired,
    hideNotification: PropTypes.func.isRequired,
    autoHideDuration: PropTypes.number,
    translate: PropTypes.func.isRequired,
};

Notification.defaultProps = {
    type: 'info',
    autoHideDuration: 4000,
};

const mapStateToProps = state => ({
    message: state.admin.notification.text,
    type: state.admin.notification.type,
    autoHideDuration: state.admin.notification.autoHideDuration,
});

export default compose(
    translate,
    withStyles(styles),
    connect(mapStateToProps, { hideNotification: hideNotificationAction })
)(Notification);
