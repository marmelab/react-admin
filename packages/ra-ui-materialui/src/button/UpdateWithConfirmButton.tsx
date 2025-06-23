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
    useResourceTranslation,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, type ButtonProps } from './Button';
import type { UseMutationOptions } from '@tanstack/react-query';
import { humanize, singularize } from 'inflection';

export const UpdateWithConfirmButton = <
    RecordType extends RaRecord = any,
    MutationOptionsError extends Error = Error,
>(
    inProps: UpdateWithConfirmButtonProps<RecordType, MutationOptionsError>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const notify = useNotify();
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const [isOpen, setOpen] = useState(false);
    const record = useRecordContext<RecordType>(props);

    const {
        confirmTitle: confirmTitleProp,
        confirmContent: confirmContentProp,
        data,
        icon = defaultIcon,
        label: labelProp,
        mutationMode = 'pessimistic',
        onClick,
        mutationOptions = emptyObject as UseMutationOptions<
            RecordType,
            MutationOptionsError,
            UpdateParams<RecordType>
        > & { meta?: any },
        titleTranslateOptions = emptyObject,
        contentTranslateOptions = emptyObject,
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
        onError = (error: MutationOptionsError) => {
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

    const [update, { isPending }] = useUpdate<RecordType, MutationOptionsError>(
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

    const handleClick = (e: React.MouseEvent) => {
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
    if (React.isValidElement(recordRepresentation)) {
        recordRepresentation = `#${record?.id}`;
    }
    const label = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.action.update`,
        baseI18nKey: 'ra.action.update',
        options: {
            name: resourceName,
            recordRepresentation,
        },
        userText: labelProp,
    });
    const confirmTitle = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.message.bulk_update_title`,
        baseI18nKey: 'ra.message.bulk_update_title',
        options: {
            recordRepresentation,
            name: resourceName,
            id: record?.id,
            smart_count: 1,
            ...titleTranslateOptions,
        },
        userText: confirmTitleProp,
    });
    const confirmContent = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.message.bulk_update_content`,
        baseI18nKey: 'ra.message.bulk_update_content',
        options: {
            recordRepresentation,
            name: resourceName,
            id: record?.id,
            smart_count: 1,
            ...contentTranslateOptions,
        },
        userText: confirmContentProp,
    });

    return (
        <Fragment>
            <StyledButton
                onClick={handleClick}
                // avoid double translation
                label={<>{label}</>}
                // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
                aria-label={typeof label === 'string' ? label : undefined}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </StyledButton>
            <Confirm
                isOpen={isOpen}
                loading={isPending}
                title={<>{confirmTitle}</>}
                content={<>{confirmContent}</>}
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
    MutationOptionsError extends Error = Error,
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
    titleTranslateOptions?: object;
    contentTranslateOptions?: object;
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
const emptyObject = {};

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
