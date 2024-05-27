import * as React from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    useUpdateMany,
    useNotify,
    useUnselectAll,
    Button,
    useListContext,
} from 'react-admin';

const ResetViewsButton = () => {
    const { resource, selectedIds } = useListContext();
    const notify = useNotify();
    const unselectAll = useUnselectAll(resource);
    const [updateMany, { isPending }] = useUpdateMany(
        resource,
        { ids: selectedIds, data: { views: 0 } },
        {
            onSuccess: () => {
                notify('ra.notification.updated', {
                    type: 'info',
                    messageArgs: { smart_count: selectedIds.length },
                    undoable: true,
                });
                unselectAll();
            },
            onError: (error: Error | string) =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    { type: 'error' }
                ),
            mutationMode: 'undoable',
        }
    );

    return (
        <Button
            label="simple.action.resetViews"
            disabled={isPending}
            onClick={() => updateMany()}
        >
            <VisibilityOff />
        </Button>
    );
};

export default ResetViewsButton;
