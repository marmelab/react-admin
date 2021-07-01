import * as React from 'react';
import { FC } from 'react';
import PropTypes from 'prop-types';
import BulkUpdateWithConfirmButton, {
    BulkUpdateWithConfirmButtonProps,
} from './BulkUpdateWithConfirmButton';
import BulkUpdateWithUndoButton, {
    BulkUpdateWithUndoButtonProps,
} from './BulkUpdateWithUndoButton';
import { MutationMode } from 'ra-core';

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
 *         <BulkUpdateButton label="Reset Views" data={{ views: 0 }} basePath={basePath} />
 *     </Fragment>
 * );
 *
 * export const PostList = (props) => (
 *     <List {...props} bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
const BulkUpdateButton: FC<BulkUpdateButtonProps> = ({
    mutationMode,
    ...props
}) =>
    mutationMode === 'undoable' ? (
        <BulkUpdateWithUndoButton {...props} />
    ) : (
        <BulkUpdateWithConfirmButton mutationMode={mutationMode} {...props} />
    );

interface Props {
    mutationMode?: MutationMode;
}

export type BulkUpdateButtonProps = Props &
    (BulkUpdateWithUndoButtonProps | BulkUpdateWithConfirmButtonProps);

BulkUpdateButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    icon: PropTypes.element,
};

BulkUpdateButton.defaultProps = {
    mutationMode: 'undoable',
    data: [],
};

export default BulkUpdateButton;
