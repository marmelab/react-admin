import React from 'react';
import PropTypes from 'prop-types';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { Button, useMutation, UPDATE_MANY } from 'react-admin';

const options = {
    undoable: true,
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
const BulkRejectButton = ({ selectedIds }) => {
    const [reject, { loading }] = useMutation(
        {
            type: UPDATE_MANY,
            resource: 'reviews',
            payload: { ids: selectedIds, data: { status: 'rejected' } },
        },
        options
    );

    return (
        <Button
            label="resources.reviews.action.reject"
            onClick={reject}
            disabled={loading}
        >
            <ThumbDown />
        </Button>
    );
};

BulkRejectButton.propTypes = {
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulkRejectButton;
