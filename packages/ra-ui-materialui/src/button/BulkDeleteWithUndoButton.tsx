import * as React from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    useDeleteMany,
    useRefresh,
    useNotify,
    useResourceContext,
    useListContext,
    type RaRecord,
    type DeleteManyParams,
    useTranslate,
} from 'ra-core';

import { Button, type ButtonProps } from './Button';
import type { UseMutationOptions } from '@tanstack/react-query';

export const BulkDeleteWithUndoButton = (
    inProps: BulkDeleteWithUndoButtonProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
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
            color="error"
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
    icon?: React.ReactNode;
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
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaBulkDeleteWithUndoButton: 'root';
    }

    interface ComponentsPropsList {
        RaBulkDeleteWithUndoButton: Partial<BulkDeleteWithUndoButtonProps>;
    }

    interface Components {
        RaBulkDeleteWithUndoButton?: {
            defaultProps?: ComponentsPropsList['RaBulkDeleteWithUndoButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaBulkDeleteWithUndoButton'];
        };
    }
}
