import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ThumbUp from '@material-ui/icons/ThumbUp';
import { useTranslate, useMutation, useNotify, useRedirect } from 'react-admin';

/**
 * This custom button demonstrate using useMutation to update data
 */
const AcceptButton = ({ record }) => {
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { loading }] = useMutation(
        {
            type: 'UPDATE',
            resource: 'reviews',
            payload: { id: record.id, data: { status: 'accepted' } },
        },
        {
            undoable: true,
            onSuccess: () => {
                notify(
                    'resources.reviews.notification.approved_success',
                    'info',
                    {},
                    true
                );
                redirect('/reviews');
            },
            onFailure: () =>
                notify(
                    'resources.reviews.notification.approved_error',
                    'warning'
                ),
        }
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
};

export default AcceptButton;
