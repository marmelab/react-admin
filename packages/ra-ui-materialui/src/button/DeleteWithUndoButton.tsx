import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, ReactEventHandler } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import { UseMutationOptions } from 'react-query';
import {
    RaRecord,
    RedirectionSideEffect,
    useDeleteWithUndoController,
    DeleteParams,
    useRecordContext,
    useResourceContext,
} from 'ra-core';

import { Button, ButtonProps } from './Button';

export const DeleteWithUndoButton = <RecordType extends RaRecord = any>(
    props: DeleteWithUndoButtonProps<RecordType>
) => {
    const {
        label = 'ra.action.delete',
        className,
        icon = defaultIcon,
        onClick,
        redirect = 'list',
        mutationOptions,
        ...rest
    } = props;

    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    const { isLoading, handleDelete } = useDeleteWithUndoController({
        record,
        resource,
        redirect,
        onClick,
        mutationOptions,
    });

    return (
        <StyledButton
            onClick={handleDelete}
            disabled={isLoading}
            label={label}
            className={clsx('ra-delete-button', className)}
            key="button"
            {...rest}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionDelete />;

export interface DeleteWithUndoButtonProps<RecordType extends RaRecord = any>
    extends Omit<ButtonProps, 'record'> {
    className?: string;
    icon?: ReactElement;
    label?: string;
    onClick?: ReactEventHandler<any>;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar - sanitized in Button
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

DeleteWithUndoButton.propTypes = {
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

const PREFIX = 'RaDeleteWithUndoButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    color: theme.palette.error.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.12),
        // Reset on mouse devices
        '@media (hover: none)': {
            backgroundColor: 'transparent',
        },
    },
}));
