import * as React from 'react';
import { Fragment, useState } from 'react';
import ActionDelete from '@mui/icons-material/Delete';

import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    type MutationMode,
    useDeleteMany,
    useListContext,
    useNotify,
    useRefresh,
    useResourceContext,
    useTranslate,
    type RaRecord,
    type DeleteManyParams,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, type ButtonProps } from './Button';
import type { UseMutationOptions } from '@tanstack/react-query';
import { humanize, inflect } from 'inflection';

export const BulkDeleteWithConfirmButton = (
    inProps: BulkDeleteWithConfirmButtonProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        confirmTitle = 'ra.message.bulk_delete_title',
        confirmContent = 'ra.message.bulk_delete_content',
        confirmColor = 'primary',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        mutationOptions = {},
        successMessage,
        onClick,
        ...rest
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const { selectedIds, onUnselectItems } = useListContext();
    const [isOpen, setOpen] = useState(false);
    const notify = useNotify();
    const resource = useResourceContext(props);
    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteMany, { isPending }] = useDeleteMany(
        resource,
        { ids: selectedIds, meta: mutationMeta },
        {
            onSuccess: () => {
                refresh();
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
                        undoable: mutationMode === 'undoable',
                    }
                );
                onUnselectItems();
                setOpen(false);
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
                setOpen(false);
            },
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

    const handleDelete = e => {
        deleteMany();

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
                confirmColor={confirmColor}
                titleTranslateOptions={{
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
                contentTranslateOptions={{
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
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const sanitizeRestProps = ({
    classes,
    label,
    ...rest
}: Omit<
    BulkDeleteWithConfirmButtonProps,
    'resource' | 'icon' | 'mutationMode'
>) => rest;

export interface BulkDeleteWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    confirmContent?: React.ReactNode;
    confirmTitle?: React.ReactNode;
    confirmColor?: 'primary' | 'warning';
    icon?: React.ReactNode;
    mutationMode: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteManyParams<RecordType>
    > & { meta?: any };
    successMessage?: string;
}

const PREFIX = 'RaBulkDeleteWithConfirmButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

const defaultIcon = <ActionDelete />;

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaBulkDeleteWithConfirmButton: 'root';
    }

    interface ComponentsPropsList {
        RaBulkDeleteWithConfirmButton: Partial<BulkDeleteWithConfirmButtonProps>;
    }

    interface Components {
        RaBulkDeleteWithConfirmButton?: {
            defaultProps?: ComponentsPropsList['RaBulkDeleteWithConfirmButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaBulkDeleteWithConfirmButton'];
        };
    }
}
