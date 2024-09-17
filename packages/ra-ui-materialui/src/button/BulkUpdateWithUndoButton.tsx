import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import ActionUpdate from '@mui/icons-material/Update';
import { alpha } from '@mui/material/styles';
import {
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    useResourceContext,
    useListContext,
    RaRecord,
    UpdateManyParams,
    useTranslate,
} from 'ra-core';
import { UseMutationOptions } from '@tanstack/react-query';

import { Button, ButtonProps } from './Button';

export const BulkUpdateWithUndoButton = (
    props: BulkUpdateWithUndoButtonProps
) => {
    const { selectedIds } = useListContext();

    const notify = useNotify();
    const resource = useResourceContext(props);
    const unselectAll = useUnselectAll(resource);
    const refresh = useRefresh();
    const translate = useTranslate();

    const {
        data,
        label = 'ra.action.update',
        icon = defaultIcon,
        successMessage,
        onClick,
        onSuccess = () => {
            notify(
                successMessage ?? `resources.${resource}.notifications.updated`,
                {
                    type: 'info',
                    messageArgs: {
                        smart_count: selectedIds.length,
                        _: translate('ra.notification.updated', {
                            smart_count: selectedIds.length,
                        }),
                    },
                    undoable: true,
                }
            );
            unselectAll();
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
            refresh();
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
            mutationMode: 'undoable',
            ...otherMutationOptions,
        }
    );

    const handleClick = e => {
        updateMany();
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

const defaultIcon = <ActionUpdate />;

const sanitizeRestProps = ({
    label,
    onSuccess,
    onError,
    ...rest
}: Omit<BulkUpdateWithUndoButtonProps, 'resource' | 'icon' | 'data'>) => rest;

export interface BulkUpdateWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    icon?: ReactElement;
    data: any;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UpdateManyParams<RecordType>
    > & { meta?: any };
    successMessage?: string;
}

const PREFIX = 'RaBulkUpdateWithUndoButton';

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
