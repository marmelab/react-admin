import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';
import {
    useDeleteMany,
    useRefresh,
    useNotify,
    useResourceContext,
    useListContext,
    RaRecord,
    DeleteManyParams,
    useTranslate,
} from 'ra-core';

import { Button, ButtonProps } from './Button';
import { UseMutationOptions } from '@tanstack/react-query';

export const BulkDeleteWithUndoButton = (
    props: BulkDeleteWithUndoButtonProps
) => {
    const {
        label = 'ra.action.delete',
        icon = defaultIcon,
        onClick,
        mutationOptions = {},
        successMessage,
        ...rest
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const { selectedIds, onUnselectItems } = useListContext();

    const notify = useNotify();
    const resource = useResourceContext(props);
    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteMany, { isPending }] = useDeleteMany();

    const handleClick = e => {
        deleteMany(
            resource,
            { ids: selectedIds, meta: mutationMeta },
            {
                onSuccess: () => {
                    notify(
                        successMessage ??
                            `resources.${resource}.notifications.deleted`,
                        {
                            type: 'info',
                            messageArgs: {
                                smart_count: selectedIds.length,
                                _: translate('ra.notification.deleted', {
                                    smart_count: selectedIds.length,
                                }),
                            },
                            undoable: true,
                        }
                    );
                    onUnselectItems();
                },
                onError: (error: Error) => {
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
                    refresh();
                },
                mutationMode: 'undoable',
                ...otherMutationOptions,
            }
        );
        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

    return (
        <StyledButton
            onClick={handleClick}
            label={label}
            disabled={isPending}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionDelete />;

const sanitizeRestProps = ({
    classes,
    label,
    ...rest
}: Omit<BulkDeleteWithUndoButtonProps, 'resource' | 'icon'>) => rest;

export interface BulkDeleteWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    icon?: ReactElement;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteManyParams<RecordType>
    > & { meta?: any };
    successMessage?: string;
}

const PREFIX = 'RaBulkDeleteWithUndoButton';

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
