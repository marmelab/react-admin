import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { Button, startUndoable, crudUpdateMany } from 'react-admin';

const BulkRejectButton = ({ basePath, resource, selectedIds }) => {
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        dispatch(
            startUndoable(
                crudUpdateMany(
                    resource,
                    selectedIds,
                    { status: 'rejected' },
                    basePath
                )
            )
        );
    }, [basePath, dispatch, resource, selectedIds]);

    return (
        <Button label="resources.reviews.action.reject" onClick={handleClick}>
            <ThumbDown />
        </Button>
    );
};

BulkRejectButton.propTypes = {
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulkRejectButton;
