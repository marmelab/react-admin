import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, ReactEventHandler, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import ActionDelete from '@mui/icons-material/Delete';
import classnames from 'classnames';
import {
    Record,
    RedirectionSideEffect,
    useDeleteWithUndoController,
    OnSuccess,
    OnFailure,
    useResourceContext,
} from 'ra-core';

import Button, { ButtonProps } from './Button';

const PREFIX = 'RaDeleteWithUndoButton';

const classes = {
    deleteButton: `${PREFIX}-deleteButton`,
};

const StyledButton = styled(Button)(({ theme }) => ({
    [`&.${classes.deleteButton}`]: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

export const DeleteWithUndoButton = (props: DeleteWithUndoButtonProps) => {
    const {
        label = 'ra.action.delete',
        classes: classesOverride,
        className,
        icon = defaultIcon,
        onClick,
        record,
        basePath,
        redirect = 'list',
        onSuccess,
        onFailure,
        ...rest
    } = props;

    const resource = useResourceContext(props);
    const { loading, handleDelete } = useDeleteWithUndoController({
        record,
        resource,
        basePath,
        redirect,
        onClick,
        onSuccess,
        onFailure,
    });

    return (
        <StyledButton
            onClick={handleDelete}
            disabled={loading}
            label={label}
            className={classnames(
                'ra-delete-button',
                classes.deleteButton,
                className
            )}
            key="button"
            {...rest}
        >
            {icon}
        </StyledButton>
    );
};

interface Props {
    basePath?: string;
    classes?: object;
    className?: string;
    icon?: ReactElement;
    label?: string;
    onClick?: ReactEventHandler<any>;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar - sanitized in Button
    handleSubmit?: (event?: SyntheticEvent<HTMLFormElement>) => Promise<Object>;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
}

const defaultIcon = <ActionDelete />;

export type DeleteWithUndoButtonProps = Props & ButtonProps;

DeleteWithUndoButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};
