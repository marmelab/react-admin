import * as React from 'react';
import { Fragment, useState } from 'react';
import ActionUpdate from '@mui/icons-material/Update';

import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    useTranslate,
    useNotify,
    useResourceContext,
    type MutationMode,
    type RaRecord,
    type UpdateParams,
    useRecordContext,
    useUpdate,
    useGetRecordRepresentation,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, type ButtonProps } from './Button';
import type { UseMutationOptions } from '@tanstack/react-query';
import { humanize, inflect } from 'inflection';

export const UpdateWithConfirmButton = (
    inProps: UpdateWithConfirmButtonProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const notify = useNotify();
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const [isOpen, setOpen] = useState(false);
    const record = useRecordContext(props);

    const {
        confirmTitle: confirmTitleProp,
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
    let recordRepresentation = getRecordRepresentation(record);
    const confirmContent = `resources.${resource}.message.bulk_update_content`;
    const confirmTitle = `resources.${resource}.message.bulk_update_title`;
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 1,
        _: humanize(
            translate(`resources.${resource}.name`, {
                smart_count: 1,
                _: resource ? inflect(resource, 1) : undefined,
            }),
            true
        ),
    });
    // We don't support React elements for this
    if (React.isValidElement(recordRepresentation)) {
        recordRepresentation = `#${record?.id}`;
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
                title={confirmTitleProp ?? confirmTitle}
                content={confirmContentProp ?? confirmContent}
                titleTranslateOptions={{
                    smart_count: 1,
                    name: resourceName,
                    recordRepresentation,
                    _: translate('ra.message.bulk_update_title', {
                        smart_count: 1,
                        name: resourceName,
                        recordRepresentation,
                    }),
                }}
                contentTranslateOptions={{
                    smart_count: 1,
                    name: resourceName,
                    recordRepresentation,
                    _: translate('ra.message.bulk_update_content', {
                        smart_count: 1,
                        name: resourceName,
                        recordRepresentation,
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
    color: (theme.vars || theme).palette.primary.main,
    '&:hover': {
        backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.primary.main}, transparent 12%)`,
        // Reset on mouse devices
        '@media (hover: none)': {
            backgroundColor: 'transparent',
        },
    },
}));

const defaultIcon = <ActionUpdate />;

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaUpdateWithConfirmButton: 'root';
    }

    interface ComponentsPropsList {
        RaUpdateWithConfirmButton: Partial<UpdateWithConfirmButtonProps>;
    }

    interface Components {
        RaUpdateWithConfirmButton?: {
            defaultProps?: ComponentsPropsList['RaUpdateWithConfirmButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaUpdateWithConfirmButton'];
        };
    }
}
