import React, { Fragment, isValidElement, ReactEventHandler } from 'react';
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
    useGetRecordRepresentation,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';
import { humanize, singularize } from 'inflection';

export const DeleteWithConfirmButton = <RecordType extends RaRecord = any>(
    props: DeleteWithConfirmButtonProps<RecordType>
) => {
    const {
        className,
        confirmTitle: confirmTitleProp,
        confirmContent: confirmContentProp,
        confirmColor = 'primary',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        onClick,
        redirect = 'list',
        translateOptions = {},
        titleTranslateOptions = translateOptions,
        contentTranslateOptions = translateOptions,
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
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    let recordRepresentation = getRecordRepresentation(record);
    const confirmTitle = `resources.${resource}.message.delete_title`;
    const confirmContent = `resources.${resource}.message.delete_content`;
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 1,
        _: humanize(
            translate(`resources.${resource}.name`, {
                smart_count: 1,
                _: resource ? singularize(resource) : undefined,
            }),
            true
        ),
    });
    // We don't support React elements for this
    if (isValidElement(recordRepresentation)) {
        recordRepresentation = `#${record?.id}`;
    }

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
                title={confirmTitleProp ?? confirmTitle}
                content={confirmContentProp ?? confirmContent}
                confirmColor={confirmColor}
                titleTranslateOptions={{
                    recordRepresentation,
                    name: resourceName,
                    id: record?.id,
                    _: translate('ra.message.delete_title', {
                        recordRepresentation,
                        name: resourceName,
                        id: record?.id,
                    }),
                    ...titleTranslateOptions,
                }}
                contentTranslateOptions={{
                    recordRepresentation,
                    name: resourceName,
                    id: record?.id,
                    _: translate('ra.message.delete_content', {
                        recordRepresentation,
                        name: resourceName,
                        id: record?.id,
                    }),
                    ...contentTranslateOptions,
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
    icon?: React.ReactNode;
    confirmColor?: 'primary' | 'warning';
    mutationMode?: MutationMode;
    onClick?: ReactEventHandler<any>;
    // May be injected by Toolbar - sanitized in Button
    /**
     * @deprecated use `titleTranslateOptions` and `contentTranslateOptions` instead
     */
    translateOptions?: object;
    titleTranslateOptions?: object;
    contentTranslateOptions?: object;
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
