import * as React from 'react';
import ThumbUp from '@mui/icons-material/ThumbUp';

import {
    Button,
    useUpdateMany,
    useNotify,
    useUnselectAll,
    Identifier,
    useListContext,
} from 'react-admin';

const noSelection: Identifier[] = [];

const BulkAcceptButton = () => {
    const { selectedIds = noSelection } = useListContext();
    const notify = useNotify();
    const unselectAll = useUnselectAll('reviews');

    const [updateMany, { isLoading }] = useUpdateMany(
        'reviews',
        { ids: selectedIds, data: { status: 'accepted' } },
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
            label="resources.reviews.action.accept"
            onClick={() => updateMany()}
            disabled={isLoading}
        >
            <ThumbUp />
        </Button>
    );
};

export default BulkAcceptButton;
