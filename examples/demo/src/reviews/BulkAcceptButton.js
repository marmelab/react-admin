import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from '@material-ui/icons/ThumbUp';
import {
    Button,
    useMutation,
    useNotify,
    useRedirect,
    useUnselectAll,
    UPDATE_MANY,
} from 'react-admin';

const BulkAcceptButton = ({ selectedIds }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const unselectAll = useUnselectAll('reviews');
    const [approve, { loading }] = useMutation(
        {
            type: UPDATE_MANY,
            resource: 'reviews',
            payload: { ids: selectedIds, data: { status: 'accepted' } },
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
