import * as React from 'react';
import { FC } from 'react';
import PropTypes from 'prop-types';
import BulkUpdateWithConfirmButton, {
    BulkUpdateWithConfirmButtonProps,
} from './BulkUpdateWithConfirmButton';
import BulkUpdateWithUndoButton, {
    BulkUpdateWithUndoButtonProps,
} from './BulkUpdateWithUndoButton';

/**
 * Updates the selected rows.
 *
 * To be used inside the <List bulkActionButtons> prop (where it's enabled by default).
 *
 * @example // basic usage
 * import * as React from 'react';
 * import { Fragment } from 'react';
 * import { BulkUpdateButton, BulkExportButton } from 'react-admin';
 *
 * const PostBulkActionButtons = ({ basePath }) => (
 *     <Fragment>
 *         <BulkExportButton />
 *         <BulkUpdateButton data={{ views: 0 }} basePath={basePath} />
 *     </Fragment>
 * );
 *
 * export const PostList = (props) => (
 *     <List {...props} bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
const BulkUpdateButton: FC<BulkUpdateButtonProps> = ({ undoable, ...props }) =>
    undoable ? (
        <BulkUpdateWithUndoButton {...props} />
    ) : (
        <BulkUpdateWithConfirmButton {...props} />
    );

interface Props {
    undoable?: boolean;
}

export type BulkUpdateButtonProps = Props &
    (BulkUpdateWithUndoButtonProps | BulkUpdateWithConfirmButtonProps);

BulkUpdateButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    undoable: PropTypes.bool,
    icon: PropTypes.element,
};

BulkUpdateButton.defaultProps = {
    undoable: true,
};

export default BulkUpdateButton;
