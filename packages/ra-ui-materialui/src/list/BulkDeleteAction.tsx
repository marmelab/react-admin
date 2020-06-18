import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { crudDeleteMany, startUndoable } from 'ra-core';

/**
 *@deprecated use BulkDeleteButton instead
 */
const BulkDeleteAction = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(
                '<BulkDeleteAction> is deprecated. Use the <BulkDeleteButton> component instead, via the bulkActionButton props.'
            );
        }
        const { basePath, resource, selectedIds, undoable, onExit } = props;
        if (undoable) {
            dispatch(
                startUndoable(crudDeleteMany(resource, selectedIds, basePath))
            );
        } else {
            dispatch(crudDeleteMany(resource, selectedIds, basePath));
        }
        onExit();
    }, [dispatch, props]);

    return null;
};

BulkDeleteAction.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    onExit: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
    undoable: PropTypes.bool,
};

BulkDeleteAction.defaultProps = {
    label: 'ra.action.delete',
    undoable: true,
};

export default BulkDeleteAction;
