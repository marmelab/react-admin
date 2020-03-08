import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from '@material-ui/icons/ThumbUp';
import {
    Button,
    useUpdateMany,
    useNotify,
    useRedirect,
    useUnselectAll,
    CRUD_UPDATE_MANY,
} from 'react-admin';

const BulkAcceptButton = ({ selectedIds }) => {
    const notify = useNotify();
    const redirectTo = useRedirect();
    const unselectAll = useUnselectAll('reviews');

    const [approve, { loading }] = useUpdateMany(
        'reviews',
        selectedIds,
        { status: 'accepted' },
        {
            action: CRUD_UPDATE_MANY,
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
            label="resources.reviews.action.accept"
            onClick={approve}
            disabled={loading}
        >
            <ThumbUp />
        </Button>
    );
};

BulkAcceptButton.propTypes = {
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulkAcceptButton;
