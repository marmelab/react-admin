import * as React from 'react';
import { ReactNode, ReactEventHandler } from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import { UseMutationOptions } from '@tanstack/react-query';
import {
    RaRecord,
    useDeleteWithUndoController,
    DeleteParams,
    useRecordContext,
    useResourceContext,
    RedirectionSideEffect,
    useTranslate,
    useGetResourceLabel,
    useGetRecordRepresentation,
} from 'ra-core';

import { Button, ButtonProps } from './Button';

export const DeleteWithUndoButton = <RecordType extends RaRecord = any>(
    props: DeleteWithUndoButtonProps<RecordType>
) => {
    const {
        label: labelProp,
        className,
        icon = defaultIcon,
        onClick,
        redirect = 'list',
        mutationOptions,
        color = 'error',
        successMessage,
        ...rest
    } = props;

    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            '<DeleteWithUndoButton> components should be used inside a <Resource> component or provided with a resource prop. (The <Resource> component set the resource prop for all its children).'
        );
    }
    const { isPending, handleDelete } = useDeleteWithUndoController({
        record,
        resource,
        redirect,
        onClick,
        mutationOptions,
        successMessage,
    });
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const getRecordRepresentation = useGetRecordRepresentation();
    const recordRepresentationValue = getRecordRepresentation(record);
    const recordRepresentation =
        typeof recordRepresentationValue === 'string'
            ? recordRepresentationValue
            : recordRepresentationValue?.toString();
    const label =
        labelProp ??
        translate(`resources.${resource}.action.delete`, {
            recordRepresentation,
            _: translate(`ra.action.delete`, {
                name: getResourceLabel(resource, 1),
                recordRepresentation,
            }),
        });

    return (
        <Button
            onClick={handleDelete}
            disabled={isPending}
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
    MutationOptionsError = unknown,
> extends ButtonProps {
    icon?: ReactNode;
    onClick?: ReactEventHandler<any>;
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
