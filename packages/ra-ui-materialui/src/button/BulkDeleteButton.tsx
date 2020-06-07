import * as React from 'react';
import { FC } from 'react';
import PropTypes from 'prop-types';
import BulkDeleteWithConfirmButton, {
    BulkDeleteWithConfirmButtonProps,
} from './BulkDeleteWithConfirmButton';
import BulkDeleteWithUndoButton, {
    BulkDeleteWithUndoButtonProps,
} from './BulkDeleteWithUndoButton';

const BulkDeleteButton: FC<BulkDeleteButtonProps> = ({ undoable, ...props }) =>
    undoable ? (
        <BulkDeleteWithUndoButton {...props} />
    ) : (
        <BulkDeleteWithConfirmButton {...props} />
    );

interface Props {
    undoable?: boolean;
}

export type BulkDeleteButtonProps = Props &
    (BulkDeleteWithUndoButtonProps | BulkDeleteWithConfirmButtonProps);

BulkDeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    undoable: PropTypes.bool,
    icon: PropTypes.element,
};

BulkDeleteButton.defaultProps = {
    undoable: true,
};

export default BulkDeleteButton;
