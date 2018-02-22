import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import classnames from 'classnames';

import {
    hideNotification as hideNotificationAction,
    getNotification,
    translate,
} from 'ra-core';

const styles = theme => {
    const confirm = theme.palette.background.default;
    const warning = theme.palette.error.light;
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
    state = {
        open: false,
    };
    componentWillReceiveProps = nextProps => {
        this.setState({
            open: !!nextProps.notification,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleExited = () => {
        this.props.hideNotification();
    };

    render() {
        const {
            classes,
            className,
            type,
            translate,
            notification,
            autoHideDuration,
            hideNotification,
            ...rest
        } = this.props;

        return (
            <Snackbar
                open={this.state.open}
                message={
                    notification &&
                    notification.message &&
                    translate(notification.message, notification.messageArgs)
                }
                autoHideDuration={
                    (notification && notification.autoHideDuration) ||
                    autoHideDuration
                }
                onExited={this.handleExited}
                onClose={this.handleRequestClose}
                SnackbarContentProps={{
                    className: classnames(
                        classes[(notification && notification.type) || type],
                        className
                    ),
                }}
                {...rest}
            />
        );
    }
}

Notification.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    notification: PropTypes.shape({
        message: PropTypes.string,
        type: PropTypes.string,
        autoHideDuration: PropTypes.number,
        messageArgs: PropTypes.object,
    }),
    type: PropTypes.string,
    hideNotification: PropTypes.func.isRequired,
    autoHideDuration: PropTypes.number,
    translate: PropTypes.func.isRequired,
};

Notification.defaultProps = {
    type: 'info',
    autoHideDuration: 4000,
};

const mapStateToProps = state => ({
    notification: getNotification(state),
});

export default compose(
    translate,
    withStyles(styles),
    connect(mapStateToProps, {
        hideNotification: hideNotificationAction,
    })
)(Notification);
