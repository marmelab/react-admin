import * as React from 'react';
import {
    UpdateWithConfirmButton,
    UpdateWithConfirmButtonProps,
} from './UpdateWithConfirmButton';
import {
    UpdateWithUndoButton,
    UpdateWithUndoButtonProps,
} from './UpdateWithUndoButton';
import { useThemeProps } from '@mui/material/styles';

/**
 * Updates the current record.
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
    const { mutationMode = 'undoable', ...rest } = useThemeProps({
        name: PREFIX,
        props: props,
    });

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

const PREFIX = 'RaUpdateButton';

declare module '@mui/material/styles' {
    interface ComponentsPropsList {
        [PREFIX]: Partial<UpdateButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
        };
    }
}
