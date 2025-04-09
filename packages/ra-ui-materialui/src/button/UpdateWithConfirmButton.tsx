import * as React from 'react';
import { Fragment, useState } from 'react';
import ActionUpdate from '@mui/icons-material/Update';

import { alpha, styled } from '@mui/material/styles';
import {
    useTranslate,
    useNotify,
    useResourceContext,
    MutationMode,
    RaRecord,
    useRecordContext,
    useUpdate,
    UpdateParams,
    useGetRecordRepresentation,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';
import { UseMutationOptions } from '@tanstack/react-query';
import { humanize, inflect } from 'inflection';

export const UpdateWithConfirmButton = (
    props: UpdateWithConfirmButtonProps
) => {
    const notify = useNotify();
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const [isOpen, setOpen] = useState(false);
    const record = useRecordContext(props);

    const {
        confirmTitle = 'ra.message.bulk_update_title',
        confirmContent: confirmContentProp,
        data,
        icon = defaultIcon,
        label = 'ra.action.update',
        mutationMode = 'pessimistic',
        onClick,
        mutationOptions = {},
        ...rest
    } = props;
    const {
        meta: mutationMeta,
        onSuccess = () => {
            notify(`resources.${resource}.notifications.updated`, {
                type: 'info',
                messageArgs: {
                    smart_count: 1,
                    _: translate('ra.notification.updated', { smart_count: 1 }),
                },
                undoable: mutationMode === 'undoable',
            });
        },
        onError = (error: Error | string) => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                {
                    type: 'error',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                  ? error.message
                                  : undefined,
                    },
                }
            );
        },
        onSettled = () => {
            setOpen(false);
        },
        ...otherMutationOptions
    } = mutationOptions;

    const [update, { isPending }] = useUpdate(
        resource,
        { id: record?.id, data, meta: mutationMeta, previousData: record },
        {
            onSuccess,
            onError,
            onSettled,
            mutationMode,
            ...otherMutationOptions,
        }
    );

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleUpdate = e => {
        update(resource, {
            id: record?.id,
            data,
            meta: mutationMeta,
            previousData: record,
        });

        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const recordRepresentation = getRecordRepresentation(record);
    let confirmNameParam = recordRepresentation;
    let confirmContent = 'ra.message.bulk_update_content_record_representation';

    if (React.isValidElement(recordRepresentation)) {
        confirmNameParam = translate(`resources.${resource}.forcedCaseName`, {
            smart_count: 1,
            _: humanize(
                translate(`resources.${resource}.name`, {
                    smart_count: 1,
                    _: resource ? inflect(resource, 1) : undefined,
                }),
                true
            ),
        });
        confirmContent = 'ra.message.bulk_update_content';
    }
    return (
        <Fragment>
            <StyledButton
                onClick={handleClick}
                label={label}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </StyledButton>
            <Confirm
                isOpen={isOpen}
                loading={isPending}
                title={confirmTitle}
                content={confirmContentProp ?? confirmContent}
                translateOptions={{
                    smart_count: 1,
                    name: confirmNameParam,
                }}
                onConfirm={handleUpdate}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const sanitizeRestProps = ({
    label,
    ...rest
}: Omit<
    UpdateWithConfirmButtonProps,
    'resource' | 'selectedIds' | 'icon' | 'data'
>) => rest;

export interface UpdateWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    confirmContent?: React.ReactNode;
    confirmTitle?: React.ReactNode;
    icon?: React.ReactNode;
    data: any;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UpdateParams<RecordType>
    > & { meta?: any };
}

const PREFIX = 'RaUpdateWithConfirmButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    color: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        // Reset on mouse devices
        '@media (hover: none)': {
            backgroundColor: 'transparent',
        },
    },
}));

const defaultIcon = <ActionUpdate />;
