import * as React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from '@material-ui/icons/ThumbUp';

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

const BulkAcceptButton = (props: BulkActionProps) => {
    const { selectedIds = noSelection } = props;
    const notify = useNotify();
    const refresh = useRefresh();
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
