import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { useTranslate, useUpdate } from 'react-admin';

const options = {
    undoable: true,
    onSuccess: {
        notification: {
            body: 'resources.reviews.notification.rejected_success',
            level: 'info',
        },
        redirectTo: '/reviews',
    },
    onFailure: {
        notification: {
            body: 'resources.reviews.notification.rejected_error',
            level: 'warning',
        },
    },
};
/**
 * This custom button demonstrate using a custom action to update data
 */
const RejectButton = ({ record }) => {
    const translate = useTranslate();

    const [reject, { loading }] = useUpdate(
        'reviews',
        record.id,
        { status: 'rejected' },
        record,
        options
    );

    return record && record.status === 'pending' ? (
        <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={reject}
            disabled={loading}
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

RejectButton.propTypes = {
    record: PropTypes.object,
};

export default RejectButton;
