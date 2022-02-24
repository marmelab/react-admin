import * as React from 'react';
import PropTypes from 'prop-types';
import ThumbDown from '@mui/icons-material/ThumbDown';

import {
    Button,
    useUpdateMany,
    useNotify,
    useUnselectAll,
    BulkActionProps,
    Identifier,
} from 'react-admin';

const noSelection: Identifier[] = [];

const BulkRejectButton = (props: BulkActionProps) => {
    const { selectedIds = noSelection } = props;
    const notify = useNotify();
    const unselectAll = useUnselectAll('reviews');

    const [updateMany, { isLoading }] = useUpdateMany(
        'reviews',
        { ids: selectedIds, data: { status: 'rejected' } },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                notify('resources.reviews.notification.approved_success', {
                    type: 'info',
                    undoable: true,
                });
                unselectAll();
            },
            onError: () => {
                notify('resources.reviews.notification.approved_error', {
                    type: 'warning',
                });
            },
        }
    );

    return (
        <Button
            label="resources.reviews.action.reject"
            onClick={() => updateMany()}
            disabled={isLoading}
        >
            <ThumbDown />
        </Button>
    );
};

BulkRejectButton.propTypes = {
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulkRejectButton;
