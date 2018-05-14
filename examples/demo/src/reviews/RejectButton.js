import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { translate } from 'react-admin';
import compose from 'recompose/compose';
import { reviewReject as reviewRejectAction } from './reviewActions';

class AcceptButton extends Component {
    handleApprove = () => {
        const { reviewReject, record } = this.props;
        reviewReject(record.id, record);
    };

    render() {
        const { record, translate } = this.props;
        return record && record.status === 'pending' ? (
            <Button color="primary" onClick={this.handleApprove}>
                <ThumbDown
                    color="primary"
                    style={{ paddingRight: '0.5em', color: 'red' }}
                />
                {translate('resources.reviews.action.reject')}
            </Button>
        ) : (
            <span />
        );
    }
}

AcceptButton.propTypes = {
    record: PropTypes.object,
    reviewReject: PropTypes.func,
    translate: PropTypes.func,
};

const enhance = compose(
    translate,
    connect(null, {
        reviewReject: reviewRejectAction,
    })
);

export default enhance(AcceptButton);
