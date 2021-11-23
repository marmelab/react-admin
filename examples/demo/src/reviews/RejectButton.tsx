import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ThumbDown from '@mui/icons-material/ThumbDown';
import { useTranslate, useUpdate, useNotify, useRedirect } from 'react-admin';
import { Review } from '../types';

/**
 * This custom button demonstrate using a custom action to update data
 */
const RejectButton = ({ record }: { record: Review }) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirectTo = useRedirect();

    const [reject, { isLoading }] = useUpdate(
        'reviews',
        { id: record.id, data: { status: 'rejected' }, previousData: record },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                notify(
                    'resources.reviews.notification.rejected_success',
                    'info',
                    {},
                    true
                );
                redirectTo('/reviews');
            },
            onError: () => {
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
            onClick={() => {
                reject();
            }}
            disabled={isLoading}
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
    record: PropTypes.any,
};

export default RejectButton;
