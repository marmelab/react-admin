import * as React from 'react';
import PropTypes from 'prop-types';
import {
    BulkDeleteWithConfirmButton,
    BulkDeleteWithConfirmButtonProps,
} from './BulkDeleteWithConfirmButton';
import {
    BulkDeleteWithUndoButton,
    BulkDeleteWithUndoButtonProps,
} from './BulkDeleteWithUndoButton';
import { MutationMode } from 'ra-core';

/**
 * Deletes the selected rows.
 *
 * To be used inside the <List bulkActionButtons> prop (where it's enabled by default).
 *
 * @example // basic usage
 * import * as React from 'react';
 * import { Fragment } from 'react';
 * import { BulkDeleteButton, BulkExportButton } from 'react-admin';
 *
 * const PostBulkActionButtons = () => (
 *     <Fragment>
 *         <BulkExportButton />
 *         <BulkDeleteButton />
 *     </Fragment>
 * );
 *
 * export const PostList = () => (
 *     <List bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
export const BulkDeleteButton = ({
    mutationMode = 'undoable',
    ...props
}: BulkDeleteButtonProps) =>
    mutationMode === 'undoable' ? (
        <BulkDeleteWithUndoButton {...props} />
    ) : (
        <BulkDeleteWithConfirmButton mutationMode={mutationMode} {...props} />
    );

interface Props {
    mutationMode?: MutationMode;
}

export type BulkDeleteButtonProps = Props &
    (BulkDeleteWithUndoButtonProps | BulkDeleteWithConfirmButtonProps);

BulkDeleteButton.propTypes = {
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    icon: PropTypes.element,
};
