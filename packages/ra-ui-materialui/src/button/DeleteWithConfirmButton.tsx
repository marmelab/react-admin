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
    useResourceTranslation,
} from 'ra-core';
import { humanize, singularize } from 'inflection';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';

export const DeleteWithConfirmButton = <RecordType extends RaRecord = any>(
    props: DeleteWithConfirmButtonProps<RecordType>
) => {
    const {
        className,
        confirmTitle: confirmTitleProp,
        confirmContent: confirmContentProp,
        confirmColor = 'primary',
        icon = defaultIcon,
        label: labelProp,
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
    if (!resource) {
        throw new Error(
            '<DeleteWithConfirmButton> components should be used inside a <Resource> component or provided with a resource prop. (The <Resource> component set the resource prop for all its children).'
        );
    }

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
    const label = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.action.delete`,
        baseI18nKey: 'ra.action.delete',
        options: {
            name: resourceName,
            recordRepresentation,
        },
        userText: labelProp,
    });
    const confirmTitle = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.message.delete_title`,
        baseI18nKey: 'ra.message.delete_title',
        options: {
            recordRepresentation,
            name: resourceName,
            id: record?.id,
            ...titleTranslateOptions,
        },
        userText: confirmTitleProp,
    });
    const confirmContent = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.message.delete_content`,
        baseI18nKey: 'ra.message.delete_content',
        options: {
            recordRepresentation,
            name: resourceName,
            id: record?.id,
            ...contentTranslateOptions,
        },
        userText: confirmContentProp,
    });

    return (
        <Fragment>
            <Button
                onClick={handleDialogOpen}
                // avoid double translation
                label={<>{label}</>}
                // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
                aria-label={typeof label === 'string' ? label : undefined}
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
                title={<>{confirmTitle}</>}
                content={<>{confirmContent}</>}
                confirmColor={confirmColor}
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
