import * as React from 'react';
import { FC, ReactElement, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import {
    Record,
    RedirectionSideEffect,
    MutationMode,
    getMutationMode,
} from 'ra-core';

import { ButtonProps } from './Button';
import DeleteWithUndoButton from './DeleteWithUndoButton';
import DeleteWithConfirmButton from './DeleteWithConfirmButton';

/**
 * Button used to delete a single record. Added by default by the <Toolbar> of edit and show views.
 *
 * @typedef {Object} Props The props you can use (other props are injected if you used it in the <Toolbar>)
 * @prop {boolean} undoable Confirm the deletion using an undo button in a notification or a confirmation dialog. Defaults to 'false'.
 * @prop {Object} record The current resource record
 * @prop {string} className
 * @prop {string} label Button label. Defaults to 'ra.action.delete, translated.
 * @prop {boolean} disabled Disable the button.
 * @prop {string} variant Material-ui variant for the button. Defaults to 'contained'.
 * @prop {ReactElement} icon Override the icon. Defaults to the Delete icon from material-ui.
 *
 * @param {Props} props
 *
 * @example Usage in the <TopToolbar> of an <Edit> form
 *
 * import * as React from 'react';
 * import { Edit, DeleteButton, TopToolbar } from 'react-admin';
 *
 * const EditActions = props => {
 *     const { basePath, data, resource } = props;
 *     return (
 *         <TopToolbar>
 *             <DeleteButton
 *                 basePath={basePath}
 *                 record={data}
 *                 resource={resource}
 *                 undoable={false} // Renders the <DeleteWithConfirmButton>
 *             />
 *         </TopToolbar>
 *     );
 * };
 *
 * const Edit = props => {
 *     return <Edit actions={<EditActions />} {...props} />;
 * };
 */
const DeleteButton: FC<DeleteButtonProps> = ({
    undoable,
    mutationMode,
    record,
    ...props
}) => {
    const mode = getMutationMode(mutationMode, undoable);
    if (!record || record.id == null) {
        return null;
    }

    return mode === 'undoable' ? (
        <DeleteWithUndoButton record={record} {...props} />
    ) : (
        <DeleteWithConfirmButton
            mutationMode={mode}
            record={record}
            {...props}
        />
    );
};

interface Props {
    basePath?: string;
    classes?: object;
    className?: string;
    confirmTitle?: string;
    confirmContent?: string;
    icon?: ReactElement;
    label?: string;
    mutationMode?: MutationMode;
    onClick?: (e: MouseEvent) => void;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar
    handleSubmit?: (event?: SyntheticEvent<HTMLFormElement>) => Promise<Object>;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    /** @deprecated use mutationMode: undoable instead */
    undoable?: boolean;
}

export type DeleteButtonProps = Props & ButtonProps;

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.any,
    // @ts-ignore
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    undoable: PropTypes.bool,
    icon: PropTypes.element,
};

export default DeleteButton;
