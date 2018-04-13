import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import { withStyles } from 'material-ui/styles';

import {
    reviewApprove as reviewApproveAction,
    reviewReject as reviewRejectAction,
} from './reviewActions';

const styles = {
    accepted: {
        color: 'green',
    },
    rejected: {
        color: 'red',
    },
};

class ApproveButton extends Component {
    handleApprove = () => {
        const { reviewApprove, record } = this.props;
        reviewApprove(record.id, record);
    };

    handleReject = () => {
        const { reviewReject, record } = this.props;
        reviewReject(record.id, record);
    };

    render() {
        const { record, classes } = this.props;
        return (
            <span>
                <IconButton
                    onClick={this.handleApprove}
                    disabled={record.status === 'accepted'}
                >
                    <ThumbUp
                        className={
                            record.status === 'accepted' ? classes.accepted : ''
                        }
                    />
                </IconButton>
                <IconButton
                    onClick={this.handleReject}
                    disabled={record.status === 'rejected'}
                >
                    <ThumbDown
                        className={
                            record.status === 'rejected' ? classes.rejected : ''
                        }
                    />
                </IconButton>
            </span>
        );
    }
}

ApproveButton.propTypes = {
    classes: PropTypes.object,
    record: PropTypes.object,
    reviewApprove: PropTypes.func,
    reviewReject: PropTypes.func,
};

export default connect(null, {
    reviewApprove: reviewApproveAction,
    reviewReject: reviewRejectAction,
})(withStyles(styles)(ApproveButton));
