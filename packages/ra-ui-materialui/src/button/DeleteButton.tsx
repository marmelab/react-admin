import * as React from 'react';
import { ReactElement } from 'react';
import { UseMutationOptions } from '@tanstack/react-query';
import {
    RaRecord,
    MutationMode,
    DeleteParams,
    useRecordContext,
    useSaveContext,
    SaveContextValue,
    RedirectionSideEffect,
    useResourceContext,
    useCanAccess,
} from 'ra-core';

import { ButtonProps } from './Button';
import { DeleteWithUndoButton } from './DeleteWithUndoButton';
import { DeleteWithConfirmButton } from './DeleteWithConfirmButton';

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
 * @prop {ReactElement} icon Override the icon. Defaults to the Delete icon from Material UI.
 *
 * @param {Props} props
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
    props: DeleteButtonProps<RecordType>
) => {
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

export interface DeleteButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps,
        SaveContextValue {
    confirmTitle?: React.ReactNode;
    confirmContent?: React.ReactNode;
    confirmColor?: 'primary' | 'warning';
    icon?: ReactElement;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    successMessage?: string;
}
