import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { hideNotification as hideNotificationAction } from '../../../actions/notificationActions' ;

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    handleRequestClose = () => {
        this.props.hideNotification();
    };

    render() {
        const style = {};
        if (this.props.type === 'warning') {
            style.backgroundColor = '#ff4081';
        }
        if (this.props.type === 'confirm') {
            style.backgroundColor = '#00bcd4';
        }
        return (<Snackbar
            open={!!this.props.message}
            message={this.props.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
            bodyStyle={style}
        />);
    }
}

Notification.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string.isRequired,
    hideNotification: PropTypes.func.isRequired,
};

Notification.defaultProps = {
    type: 'info',
};

const mapStateToProps = (state) => ({
    message: state.notification.text,
    type: state.notification.type,
});

export default connect(
  mapStateToProps,
  { hideNotification: hideNotificationAction },
)(Notification);
