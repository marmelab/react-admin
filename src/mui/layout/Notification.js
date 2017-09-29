import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { hideNotification as hideNotificationAction } from '../../actions/notificationActions';
import translate from '../../i18n/translate';

function getStyles(context) {
    if (!context) return { primary1Color: '#00bcd4', accent1Color: '#ff4081' };
    const {
        muiTheme: { baseTheme: { palette: { primary1Color, accent1Color } } },
    } = context;
    return { primary1Color, accent1Color };
}

class Notification extends React.Component {
    handleRequestClose = () => {
        this.props.hideNotification();
    };

    render() {
        const style = {};
        const { primary1Color, accent1Color } = getStyles(this.context);
        const { type, translate, message } = this.props;
        if (type === 'warning') {
            style.backgroundColor = accent1Color;
        }
        if (type === 'confirm') {
            style.backgroundColor = primary1Color;
        }
        return (
            <Snackbar
                open={!!message}
                message={!!message && translate(message)}
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose}
                bodyStyle={style}
            />
        );
    }
}

Notification.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string.isRequired,
    hideNotification: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

Notification.defaultProps = {
    type: 'info',
};

Notification.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    message: state.admin.notification.text,
    type: state.admin.notification.type,
});

export default translate(
    connect(mapStateToProps, { hideNotification: hideNotificationAction })(
        Notification
    )
);
