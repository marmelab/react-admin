import * as React from 'react';
import ThumbDown from '@mui/icons-material/ThumbDown';

import {
    Button,
    useUpdateMany,
    useNotify,
    useUnselectAll,
    Identifier,
    useListContext,
} from 'react-admin';

const noSelection: Identifier[] = [];

const BulkRejectButton = () => {
    const { selectedIds = noSelection } = useListContext();
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
                    type: 'error',
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

export default BulkRejectButton;
