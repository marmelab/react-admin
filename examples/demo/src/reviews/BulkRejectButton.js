import React from 'react';
import PropTypes from 'prop-types';
import ThumbDown from '@material-ui/icons/ThumbDown';
import {
    Button,
    useMutation,
    useNotify,
    useRedirect,
    useUnselectAll,
    UPDATE_MANY,
} from 'react-admin';

const BulkRejectButton = ({ selectedIds }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const unselectAll = useUnselectAll('reviews');
    const [reject, { loading }] = useMutation(
        {
            type: UPDATE_MANY,
            resource: 'reviews',
            payload: { ids: selectedIds, data: { status: 'rejected' } },
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
                unselectAll();
            },
            onFailure: () =>
                notify(
                    'resources.reviews.notification.approved_error',
                    'warning'
                ),
        }
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
