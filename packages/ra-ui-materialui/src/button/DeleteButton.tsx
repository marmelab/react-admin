import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { UseMutationOptions } from 'react-query';
import {
    RaRecord,
    RedirectionSideEffect,
    MutationMode,
    DeleteParams,
    useRecordContext,
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
 * @prop {string} variant MUI variant for the button. Defaults to 'contained'.
 * @prop {ReactElement} icon Override the icon. Defaults to the Delete icon from MUI.
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
    const { mutationMode = 'undoable', ...rest } = props;
    const record = useRecordContext();
    if (!record || record.id == null) {
        return null;
    }

    return mutationMode === 'undoable' ? (
        // @ts-ignore I looked for the error for one hour without finding it
        <DeleteWithUndoButton<RecordType> record={record} {...rest} />
    ) : (
        <DeleteWithConfirmButton<RecordType>
            // @ts-ignore I looked for the error for one hour without finding it
            mutationMode={mutationMode}
            record={record}
            {...rest}
        />
    );
};

export interface DeleteButtonProps<RecordType extends RaRecord = any>
    extends Omit<ButtonProps, 'record'> {
    className?: string;
    confirmTitle?: string;
    confirmContent?: string;
    icon?: ReactElement;
    label?: string;
    mutationMode?: MutationMode;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        DeleteParams<RecordType>
    >;
}

DeleteButton.propTypes = {
    label: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    record: PropTypes.any,
    // @ts-ignore
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};
