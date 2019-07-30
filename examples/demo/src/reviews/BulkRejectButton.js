import React from 'react';
import PropTypes from 'prop-types';
import ThumbDown from '@material-ui/icons/ThumbDown';
import {
    Button,
    useUpdateMany,
    useNotify,
    useRedirect,
    useUnselectAll,
} from 'react-admin';

const BulkRejectButton = ({ selectedIds }) => {
    const notify = useNotify();
    const redirectTo = useRedirect();
    const unselectAll = useUnselectAll('reviews');

    const [reject, { loading }] = useUpdateMany(
        'reviews',
        selectedIds,
        { status: 'rejected' },
        {
            undoable: true,
            onSuccess: () => {
                notify(
                    'resources.reviews.notification.approved_success',
                    'info',
                    {},
                    true
                );
                redirectTo('/reviews');
                unselectAll();
            },
            onFailure: () => {
                notify(
                    'resources.reviews.notification.approved_error',
                    'warning'
                );
            },
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
