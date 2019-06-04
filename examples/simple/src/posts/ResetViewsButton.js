import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { startUndoable, crudUpdateMany, Button } from 'react-admin';

const ResetViewsButton = props => {
    const dispatch = useDispatch();
    const { basePath, resource, selectedIds } = props;

    const handleClick = useCallback(
        () => {
            dispatch(
                startUndoable(
                    crudUpdateMany(
                        resource,
                        selectedIds,
                        { views: 0 },
                        basePath,
                    ),
                ),
            );
        },
        [basePath, resource, selectedIds],
    );

    return (
        <Button label="simple.action.resetViews" onClick={handleClick}>
            <VisibilityOff />
        </Button>
    );
};

ResetViewsButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default ResetViewsButton;
