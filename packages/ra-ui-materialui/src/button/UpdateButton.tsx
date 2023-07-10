import * as React from 'react';
import PropTypes from 'prop-types';
import {
    UpdateWithConfirmButton,
    UpdateWithConfirmButtonProps,
} from './UpdateWithConfirmButton';
import {
    UpdateWithUndoButton,
    UpdateWithUndoButtonProps,
} from './UpdateWithUndoButton';

/**
 * Updates the selected rows.
 *
 * To be used inside the <List bulkActionButtons> prop (where it's enabled by default).
 *
 * @example // basic usage
 * import * as React from 'react';
 * import { Fragment } from 'react';
 * import { UpdateButton, BulkExportButton } from 'react-admin';
 *
 * const PostBulkActionButtons = () => (
 *     <Fragment>
 *         <BulkExportButton />
 *         <UpdateButton label="Reset Views" data={{ views: 0 }} />
 *     </Fragment>
 * );
 *
 * export const PostList = () => (
 *     <List bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
export const UpdateButton = (props: UpdateButtonProps) => {
    const { mutationMode, ...rest } = props;

    return mutationMode === 'undoable' ? (
        <UpdateWithUndoButton {...rest} />
    ) : (
        <UpdateWithConfirmButton mutationMode={mutationMode} {...rest} />
    );
};

export type UpdateButtonProps =
    | ({
          mutationMode: 'undoable';
      } & UpdateWithUndoButtonProps)
    | ({
          mutationMode: 'pessimistic' | 'optimistic';
      } & UpdateWithConfirmButtonProps);

UpdateButton.propTypes = {
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    icon: PropTypes.element,
};

UpdateButton.defaultProps = {
    mutationMode: 'undoable',
    data: {},
};
