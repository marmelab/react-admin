import React from 'react';
import PropTypes from 'prop-types';
import { ComponentPropType } from 'ra-core';
import BulkDeleteWithConfirmButton from './BulkDeleteWithConfirmButton';
import BulkDeleteWithUndoButton from './BulkDeleteWithUndoButton';

const BulkDeleteButton = ({ undoable, ...props }) =>
    undoable ? (
        <BulkDeleteWithUndoButton {...props} />
    ) : (
        <BulkDeleteWithConfirmButton {...props} />
    );

BulkDeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    undoable: PropTypes.bool,
    icon: ComponentPropType,
};

BulkDeleteButton.defaultProps = {
    undoable: true,
};

export default BulkDeleteButton;
