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
        return (<Snackbar
            open={!!this.props.message}
            message={this.props.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
        />);
    }
}

Notification.propTypes = {
    message: PropTypes.string,
};

export default connect(
  (state) => ({ message: state.notification }),
  { hideNotification: hideNotificationAction },
)(Notification);
