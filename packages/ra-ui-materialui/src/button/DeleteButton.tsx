import React, { FC, ReactElement, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import { Record, RedirectionSideEffect } from 'ra-core';

import { ButtonProps } from './Button';
import DeleteWithUndoButton from './DeleteWithUndoButton';
import DeleteWithConfirmButton from './DeleteWithConfirmButton';

const DeleteButton: FC<DeleteButtonProps> = ({ undoable, ...props }) =>
    undoable ? (
        <DeleteWithUndoButton {...props} />
    ) : (
        <DeleteWithConfirmButton {...props} />
    );

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
