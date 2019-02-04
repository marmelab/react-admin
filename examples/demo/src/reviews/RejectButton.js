import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { translate } from 'react-admin';
import compose from 'recompose/compose';
import { reviewReject as reviewRejectAction } from './reviewActions';

class AcceptButton extends Component {
    handleApprove = () => {
        const { reviewReject, record, comment } = this.props;
        reviewReject(record.id, { ...record, comment });
    };

    render() {
        const { record, translate } = this.props;
        return record && record.status === 'pending' ? (
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={this.handleApprove}
            >
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
    comment: PropTypes.string,
    record: PropTypes.object,
    reviewReject: PropTypes.func,
    translate: PropTypes.func,
};

const selector = formValueSelector('record-form');

const enhance = compose(
    translate,
    connect(
        state => ({
            comment: selector(state, 'comment'),
        }),
        {
            reviewReject: reviewRejectAction,
        }
    )
);

export default enhance(AcceptButton);
