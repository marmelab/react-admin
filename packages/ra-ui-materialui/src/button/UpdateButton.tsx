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
 * To be used inside the <Edit actions> prop or <Show actions> prop.
 *
 * @example // basic usage
 * import * as React from 'react';
 * import { Edit, TopToolbar, UpdateButton } from 'react-admin';
 *
 * const PostEditActions = () => (
 *     <TopToolbar>
 *         <UpdateButton label="Reset Views" data={{ views: 0 }} />
 *     </TopToolbar>
 * );
 *
 * export const PostEdit = () => (
 *     <Edit actions={<PostEditActions />}>
 *         ...
 *     </Edit>
 * );
 */
export const UpdateButton = (props: UpdateButtonProps) => {
    const { mutationMode = 'undoable', ...rest } = props;

    return mutationMode === 'undoable' ? (
        <UpdateWithUndoButton {...rest} />
    ) : (
        <UpdateWithConfirmButton mutationMode={mutationMode} {...rest} />
    );
};

export type UpdateButtonProps =
    | ({
          mutationMode?: 'undoable';
      } & UpdateWithUndoButtonProps)
    | ({
          mutationMode?: 'pessimistic' | 'optimistic';
      } & UpdateWithConfirmButtonProps);

UpdateButton.propTypes = {
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    icon: PropTypes.element,
};
