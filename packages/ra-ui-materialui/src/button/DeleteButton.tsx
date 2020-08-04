import * as React from 'react';
import { FC, ReactElement, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import { Record, RedirectionSideEffect } from 'ra-core';

import { ButtonProps } from './Button';
import DeleteWithUndoButton from './DeleteWithUndoButton';
import DeleteWithConfirmButton from './DeleteWithConfirmButton';

/**
 * Button used to delete a single record. Added by default by the <Toolbar> of edit and show views.
 *
 * @typedef {Object} Props The props you can use (other props are injected if you used it in the <Toolbar>)
 * @param {Prop} props
 * @prop {boolean} undoable Confirm the deletion using an undo button in a notification or a confirmation dialog. Defaults to 'false'.
 * @prop {string} className
 * @prop {string} label Button label. Defaults to 'ra.action.delete, translated.
 * @prop {boolean} disabled Disable the button.
 * @prop {string} variant Material-ui variant for the button. Defaults to 'contained'.
 * @prop {ReactElement} icon Override the icon. Defaults to the Delete icon from material-ui.
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
    record,
    ...props
}) => {
    if (!record || record.id == null) {
        return null;
    }
    return undoable ? (
        <DeleteWithUndoButton record={record} {...props} />
    ) : (
        <DeleteWithConfirmButton record={record} {...props} />
    );
};

interface Props {
    basePath?: string;
    classes?: object;
    className?: string;
    icon?: ReactElement;
    label?: string;
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

DeleteButton.defaultProps = {
    undoable: true,
};

export default DeleteButton;
