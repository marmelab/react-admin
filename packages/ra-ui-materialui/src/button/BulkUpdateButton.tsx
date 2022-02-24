import * as React from 'react';
import PropTypes from 'prop-types';
import {
    BulkUpdateWithConfirmButton,
    BulkUpdateWithConfirmButtonProps,
} from './BulkUpdateWithConfirmButton';
import {
    BulkUpdateWithUndoButton,
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
 * const PostBulkActionButtons = () => (
 *     <Fragment>
 *         <BulkExportButton />
 *         <BulkUpdateButton label="Reset Views" data={{ views: 0 }} />
 *     </Fragment>
 * );
 *
 * export const PostList = (props) => (
 *     <List {...props} bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
export const BulkUpdateButton = (props: BulkUpdateButtonProps) => {
    const { mutationMode, ...rest } = props;

    return mutationMode === 'undoable' ? (
        <BulkUpdateWithUndoButton {...rest} />
    ) : (
        <BulkUpdateWithConfirmButton mutationMode={mutationMode} {...rest} />
    );
};

interface Props {
    mutationMode?: MutationMode;
}

export type BulkUpdateButtonProps = Props &
    (BulkUpdateWithUndoButtonProps | BulkUpdateWithConfirmButtonProps);

BulkUpdateButton.propTypes = {
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
