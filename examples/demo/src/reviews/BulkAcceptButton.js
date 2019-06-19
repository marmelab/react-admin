import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ThumbUp from '@material-ui/icons/ThumbUp';
import { Button, startUndoable, crudUpdateMany } from 'react-admin';

const BulkAcceptButton = ({ basePath, resource, selectedIds }) => {
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        dispatch(
            startUndoable(
                crudUpdateMany(
                    resource,
                    selectedIds,
                    { status: 'accepted' },
                    basePath
                )
            )
        );
    }, [basePath, dispatch, resource, selectedIds]);

    return (
        <Button label="resources.reviews.action.accept" onClick={handleClick}>
            <ThumbUp />
        </Button>
    );
};

BulkAcceptButton.propTypes = {
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulkAcceptButton;
