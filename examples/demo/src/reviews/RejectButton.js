import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { useTranslate, useUpdate, useNotify, useRedirect } from 'react-admin';

/**
 * This custom button demonstrate using a custom action to update data
 */
const RejectButton = ({ record }) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirectTo = useRedirect();

    const [reject, { loading }] = useUpdate(
        'reviews',
        record.id,
        { status: 'rejected' },
        record,
        {
            undoable: true,
            onSuccess: () => {
                notify(
                    'resources.reviews.notification.rejected_success',
                    'info',
                    {},
                    true
                );
                redirectTo('/reviews');
            },
            onFailure: () => {
                notify(
                    'resources.reviews.notification.rejected_error',
                    'warning'
                );
            },
        }
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
