import React, { Fragment, ReactEventHandler, ReactElement } from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';

import { UseMutationOptions } from '@tanstack/react-query';
import {
    MutationMode,
    RaRecord,
    DeleteParams,
    useDeleteWithConfirmController,
    useRecordContext,
    useResourceContext,
    useTranslate,
    RedirectionSideEffect,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';
import { humanize, singularize } from 'inflection';

export const DeleteWithConfirmButton = <RecordType extends RaRecord = any>(
    props: DeleteWithConfirmButtonProps<RecordType>
) => {
    const {
        className,
        confirmTitle = 'ra.message.delete_title',
        confirmContent = 'ra.message.delete_content',
        confirmColor = 'primary',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        onClick,
        redirect = 'list',
        translateOptions = {},
        mutationOptions,
        color = 'error',
        successMessage,
        ...rest
    } = props;
    const translate = useTranslate();
    const record = useRecordContext(props);
    const resource = useResourceContext(props);

    const {
        open,
        isPending,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    } = useDeleteWithConfirmController({
        record,
        redirect,
        mutationMode,
        onClick,
        mutationOptions,
        resource,
        successMessage,
    });

    return (
        <Fragment>
            <Button
                onClick={handleDialogOpen}
                label={label}
                className={clsx('ra-delete-button', className)}
                key="button"
                color={color}
                {...rest}
            >
                {icon}
            </Button>
            <Confirm
                isOpen={open}
                loading={isPending}
                title={confirmTitle}
                content={confirmContent}
                confirmColor={confirmColor}
                translateOptions={{
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: 1,
                        _: humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: 1,
                                _: resource ? singularize(resource) : undefined,
                            }),
                            true
                        ),
                    }),
                    id: record?.id,
                    ...translateOptions,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const defaultIcon = <ActionDelete />;

export interface DeleteWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    confirmTitle?: React.ReactNode;
    confirmContent?: React.ReactNode;
    confirmColor?: 'primary' | 'warning';
    icon?: ReactElement;
    mutationMode?: MutationMode;
    onClick?: ReactEventHandler<any>;
    // May be injected by Toolbar - sanitized in Button
    translateOptions?: object;
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
