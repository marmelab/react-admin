import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { useTranslate } from 'react-admin';
import { reviewReject as reviewRejectAction } from './reviewActions';

/**
 * This custom button demonstrate using a custom action to update data
 */
const AcceptButton = ({ record, reviewReject, comment }) => {
    const translate = useTranslate();
    const handleApprove = () => {
        reviewReject(record.id, { ...record, comment });
    };

    return record && record.status === 'pending' ? (
        <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleApprove}
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
};

AcceptButton.propTypes = {
    comment: PropTypes.string,
    record: PropTypes.object,
    reviewReject: PropTypes.func,
};

const selector = formValueSelector('record-form');

export default connect(
    state => ({
        comment: selector(state, 'comment'),
    }),
    {
        reviewReject: reviewRejectAction,
    }
)(AcceptButton);
