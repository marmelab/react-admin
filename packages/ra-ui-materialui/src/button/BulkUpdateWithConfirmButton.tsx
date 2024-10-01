import * as React from 'react';
import { Fragment, useState, ReactElement } from 'react';
import ActionUpdate from '@mui/icons-material/Update';

import { alpha, styled } from '@mui/material/styles';
import {
    useListContext,
    useTranslate,
    useUpdateMany,
    useNotify,
    useUnselectAll,
    useResourceContext,
    MutationMode,
    RaRecord,
    UpdateManyParams,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';
import { UseMutationOptions } from '@tanstack/react-query';
import { humanize, inflect } from 'inflection';

export const BulkUpdateWithConfirmButton = (
    props: BulkUpdateWithConfirmButtonProps
) => {
    const notify = useNotify();
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const unselectAll = useUnselectAll(resource);
    const [isOpen, setOpen] = useState(false);
    const { selectedIds } = useListContext();

    const {
        confirmTitle = 'ra.message.bulk_update_title',
        confirmContent = 'ra.message.bulk_update_content',
        data,
        icon = defaultIcon,
        label = 'ra.action.update',
        mutationMode = 'pessimistic',
        onClick,
        onSuccess = () => {
            notify(`resources.${resource}.notifications.updated`, {
                type: 'info',
                messageArgs: {
                    smart_count: selectedIds.length,
                    _: translate('ra.notification.updated', {
                        smart_count: selectedIds.length,
                    }),
                },
                undoable: mutationMode === 'undoable',
            });
            unselectAll();
            setOpen(false);
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
            setOpen(false);
        },
        mutationOptions = {},
        ...rest
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;

    const [updateMany, { isPending }] = useUpdateMany(
        resource,
        { ids: selectedIds, data, meta: mutationMeta },
        {
            onSuccess,
            onError,
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
        updateMany();

        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

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
                content={confirmContent}
                translateOptions={{
                    smart_count: selectedIds.length,
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: selectedIds.length,
                        _: humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: selectedIds.length,
                                _: resource
                                    ? inflect(resource, selectedIds.length)
                                    : undefined,
                            }),
                            true
                        ),
                    }),
                }}
                onConfirm={handleUpdate}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const sanitizeRestProps = ({
    label,
    onSuccess,
    onError,
    ...rest
}: Omit<
    BulkUpdateWithConfirmButtonProps,
    'resource' | 'selectedIds' | 'icon' | 'data'
>) => rest;

export interface BulkUpdateWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    confirmContent?: React.ReactNode;
    confirmTitle?: React.ReactNode;
    icon?: ReactElement;
    data: any;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UpdateManyParams<RecordType>
    > & { meta?: any };
}

const PREFIX = 'RaBulkUpdateWithConfirmButton';

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
