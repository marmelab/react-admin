import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { crudDeleteMany, startUndoable, translate } from 'ra-core';

class BulkDeleteAction extends Component {
    componentDidMount = () => {
        const {
            basePath,
            data,
            dispatchCrudDeleteMany,
            resource,
            selectedIds,
            startUndoable,
            undoable,
        } = this.props;

        const selectedRecords = selectedIds.map(id => data[id]).filter(r => r);
        if (undoable) {
            startUndoable(
                crudDeleteMany(resource, selectedIds, selectedRecords, basePath)
            );
        } else {
            dispatchCrudDeleteMany(
                resource,
                selectedIds,
                selectedRecords,
                basePath
            );
        }
        this.props.onExit();
    };

    render() {
        return null;
    }
}

BulkDeleteAction.propTypes = {
    basePath: PropTypes.string,
    dispatchCrudDeleteMany: PropTypes.func.isRequired,
    data: PropTypes.object,
    label: PropTypes.string,
    onExit: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    startUndoable: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
    undoable: PropTypes.bool,
};

const EnhancedBulkDeleteAction = compose(
    connect(undefined, {
        startUndoable,
        dispatchCrudDeleteMany: crudDeleteMany,
    }),
    translate
)(BulkDeleteAction);

EnhancedBulkDeleteAction.defaultProps = {
    label: 'ra.action.delete',
    undoable: true,
};

export default EnhancedBulkDeleteAction;
