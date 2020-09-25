import * as React from 'react';
import { FC } from 'react';
import PropTypes from 'prop-types';
import ThumbDown from '@material-ui/icons/ThumbDown';

import {
    Button,
    useUpdateMany,
    useNotify,
    useRefresh,
    useUnselectAll,
    CRUD_UPDATE_MANY,
    BulkActionProps,
    Identifier,
} from 'react-admin';

const noSelection: Identifier[] = [];

const BulkRejectButton: FC<BulkActionProps> = ({
    selectedIds = noSelection,
}) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll('reviews');

    const [reject, { loading }] = useUpdateMany(
        'reviews',
        selectedIds,
        { status: 'rejected' },
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
                refresh();
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
