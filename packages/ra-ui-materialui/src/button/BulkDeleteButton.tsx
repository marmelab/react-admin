import * as React from 'react';
import PropTypes from 'prop-types';
import BulkDeleteWithConfirmButton, {
    BulkDeleteWithConfirmButtonProps,
} from './BulkDeleteWithConfirmButton';
import BulkDeleteWithUndoButton, {
    BulkDeleteWithUndoButtonProps,
} from './BulkDeleteWithUndoButton';

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
 * const PostBulkActionButtons = ({ basePath }) => (
 *     <Fragment>
 *         <BulkExportButton />
 *         <BulkDeleteButton basePath={basePath} />
 *     </Fragment>
 * );
 *
 * export const PostList = (props) => (
 *     <List {...props} bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
const BulkDeleteButton = (props: BulkDeleteButtonProps) =>
    props.undoable ? (
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
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    undoable: PropTypes.bool,
    icon: PropTypes.element,
};

BulkDeleteButton.defaultProps = {
    undoable: true,
};

export default BulkDeleteButton;
