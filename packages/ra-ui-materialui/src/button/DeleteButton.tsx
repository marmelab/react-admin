import * as React from 'react';
import {
    RaRecord,
    useRecordContext,
    useSaveContext,
    SaveContextValue,
    useResourceContext,
    useCanAccess,
} from 'ra-core';
import { useThemeProps } from '@mui/material/styles';

import {
    DeleteWithUndoButton,
    DeleteWithUndoButtonProps,
} from './DeleteWithUndoButton';
import {
    DeleteWithConfirmButton,
    DeleteWithConfirmButtonProps,
} from './DeleteWithConfirmButton';

/**
 * Button used to delete a single record. Added by default by the <Toolbar> of edit and show views.
 *
 * @typedef {Object} Props The props you can use (other props are injected if you used it in the <Toolbar>)
 * @prop {boolean} mutationMode Either 'pessimistic', 'optimistic' or 'undoable'. Determine whether the deletion uses an undo button in a notification or a confirmation dialog. Defaults to 'undoable'.
 * @prop {Object} record The current resource record
 * @prop {string} className
 * @prop {string} label Button label. Defaults to 'ra.action.delete, translated.
 * @prop {boolean} disabled Disable the button.
 * @prop {string} variant Material UI variant for the button. Defaults to 'contained'.
 * @prop {ReactNode} icon Override the icon. Defaults to the Delete icon from Material UI.
 *
 * @param {Props} inProps
 *
 * @example Usage in the <TopToolbar> of an <Edit> form
 *
 * import * as React from 'react';
 * import { Edit, DeleteButton, TopToolbar } from 'react-admin';
 *
 * const EditActions = props => {
 *     const { data, resource } = props;
 *     return (
 *         <TopToolbar>
 *             <DeleteButton
 *                 mutationMode="pessimistic" // Renders the <DeleteWithConfirmButton>
 *             />
 *         </TopToolbar>
 *     );
 * };
 *
 * const Edit = props => {
 *     return <Edit actions={<EditActions />} {...props} />;
 * };
 */
export const DeleteButton = <RecordType extends RaRecord = any>(
    inProps: DeleteButtonProps<RecordType>
) => {
    const props = useThemeProps({
        name: PREFIX,
        props: inProps,
    });

    const { mutationMode, ...rest } = props;
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            '<DeleteButton> components should be used inside a <Resource> component or provided the resource prop.'
        );
    }
    const { canAccess, isPending } = useCanAccess({
        action: 'delete',
        resource,
        record,
    });
    const saveContext = useSaveContext(props);
    if (!record || record.id == null || !canAccess || isPending) {
        return null;
    }

    const finalMutationMode = mutationMode
        ? mutationMode
        : saveContext?.mutationMode
          ? saveContext.mutationMode
          : 'undoable';

    return finalMutationMode === 'undoable' ? (
        <DeleteWithUndoButton<RecordType> record={record} {...rest} />
    ) : (
        <DeleteWithConfirmButton<RecordType>
            // @ts-ignore I looked for the error for one hour without finding it
            mutationMode={finalMutationMode}
            record={record}
            {...rest}
        />
    );
};

export type DeleteButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> = SaveContextValue &
    (
        | ({ mutationMode?: 'undoable' } & DeleteWithUndoButtonProps<
              RecordType,
              MutationOptionsError
          >)
        | ({
              mutationMode?: 'pessimistic' | 'optimistic';
          } & DeleteWithConfirmButtonProps<RecordType, MutationOptionsError>)
    );

const PREFIX = 'RaDeleteButton';

declare module '@mui/material/styles' {
    interface ComponentsPropsList {
        [PREFIX]: Partial<DeleteButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
        };
    }
}
