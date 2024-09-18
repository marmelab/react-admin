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

    const [updateMany, { isPending }] = useUpdateMany(
        'reviews',
        { ids: selectedIds, data: { status: 'accepted' } },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                notify('resources.reviews.notifications.approved_success', {
                    type: 'info',
                    undoable: true,
                });
                unselectAll();
            },
            onError: () => {
                notify('resources.reviews.notifications.approved_error', {
                    type: 'error',
                });
            },
        }
    );

    return (
        <Button
            label="resources.reviews.action.accept"
            onClick={() => updateMany()}
            disabled={isPending}
        >
            <ThumbUp />
        </Button>
    );
};

export default BulkAcceptButton;
