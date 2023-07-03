import * as React from 'react';
import { ReactElement, ReactEventHandler } from 'react';
import PropTypes from 'prop-types';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import { UseMutationOptions } from 'react-query';
import {
    RaRecord,
    useDeleteWithUndoController,
    DeleteParams,
    useRecordContext,
    useResourceContext,
    RedirectionSideEffect,
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
        color = 'error',
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
        <Button
            onClick={handleDelete}
            disabled={isLoading}
            label={label}
            className={clsx('ra-delete-button', className)}
            key="button"
            color={color}
            {...rest}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <ActionDelete />;

export interface DeleteWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> extends ButtonProps {
    icon?: ReactElement;
    onClick?: ReactEventHandler<any>;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
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
