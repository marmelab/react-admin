import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, ReactEventHandler } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import ActionDelete from '@mui/icons-material/Delete';
import classnames from 'classnames';
import { UseMutationOptions } from 'react-query';
import {
    RaRecord,
    RedirectionSideEffect,
    useDeleteWithUndoController,
    DeleteParams,
    useResourceContext,
} from 'ra-core';

import { Button, ButtonProps } from './Button';

export const DeleteWithUndoButton = <RaRecordType extends RaRecord = any>(
    props: DeleteWithUndoButtonProps<RaRecordType>
) => {
    const {
        label = 'ra.action.delete',
        className,
        icon = defaultIcon,
        onClick,
        record,
        basePath,
        redirect = 'list',
        mutationOptions,
        ...rest
    } = props;

    const resource = useResourceContext(props);
    const { isLoading, handleDelete } = useDeleteWithUndoController({
        record,
        resource,
        basePath,
        redirect,
        onClick,
        mutationOptions,
    });

    return (
        <StyledButton
            onClick={handleDelete}
            disabled={isLoading}
            label={label}
            className={classnames(
                'ra-delete-button',
                DeleteWithUndoButtonClasses.deleteButton,
                className
            )}
            key="button"
            {...rest}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionDelete />;

export interface DeleteWithUndoButtonProps<RaRecordType extends RaRecord = any>
    extends Omit<ButtonProps, 'record'> {
    basePath?: string;
    className?: string;
    icon?: ReactElement;
    label?: string;
    onClick?: ReactEventHandler<any>;
    record?: RaRecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar - sanitized in Button
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    mutationOptions?: UseMutationOptions<
        RaRecordType,
        unknown,
        DeleteParams<RaRecordType>
    >;
}

DeleteWithUndoButton.propTypes = {
    basePath: PropTypes.string,
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

const DeleteWithUndoButtonClasses = {
    deleteButton: `${PREFIX}-deleteButton`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
    [`&.${DeleteWithUndoButtonClasses.deleteButton}`]: {
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
