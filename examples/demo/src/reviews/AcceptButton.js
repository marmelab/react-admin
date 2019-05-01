import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import ThumbUp from '@material-ui/icons/ThumbUp';
import { translate, useMutation } from 'react-admin';
import compose from 'recompose/compose';

const sideEffects = {
    onSuccess: {
        notification: {
            body: 'resources.reviews.notification.approved_success',
            level: 'info',
        },
        redirectTo: '/reviews',
    },
    onFailure: {
        notification: {
            body: 'resources.reviews.notification.approved_error',
            level: 'warning',
        },
    },
};

/**
 * This custom button demonstrate using useMutation to update data
 */
const AcceptButton = ({ record, translate }) => {
    const [approve, { loading }] = useMutation(
        'UPDATE',
        'reviews',
        { id: record.id, data: { status: 'accepted' } },
        sideEffects
    );
    return record && record.status === 'pending' ? (
        <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={approve}
            disabled={loading}
        >
            <ThumbUp
                color="primary"
                style={{ paddingRight: '0.5em', color: 'green' }}
            />
            {translate('resources.reviews.action.accept')}
        </Button>
    ) : (
        <span />
    );
};

AcceptButton.propTypes = {
    record: PropTypes.object,
    comment: PropTypes.string,
    translate: PropTypes.func,
};

const selector = formValueSelector('record-form');

const enhance = compose(
    translate,
    connect(state => ({
        comment: selector(state, 'comment'),
    }))
);

export default enhance(AcceptButton);
