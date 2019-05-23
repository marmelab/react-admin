import React from 'react';
import PropTypes from 'prop-types';
import { ComponentPropType } from 'ra-core';
import DeleteWithUndoButton from './DeleteWithUndoButton';
import DeleteWithConfirmButton from './DeleteWithConfirmButton';

const DeleteButton = ({ undoable, ...props }) =>
    undoable ? (
        <DeleteWithUndoButton {...props} />
    ) : (
        <DeleteWithConfirmButton {...props} />
    );

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    undoable: PropTypes.bool,
    icon: ComponentPropType,
};

DeleteButton.defaultProps = {
    undoable: true,
};

export default DeleteButton;
