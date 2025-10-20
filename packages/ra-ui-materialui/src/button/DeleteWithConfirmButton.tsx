import React, { Fragment, isValidElement, ReactEventHandler } from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import clsx from 'clsx';

import {
    RaRecord,
    useRecordContext,
    useResourceContext,
    useTranslate,
    useGetRecordRepresentation,
    useResourceTranslation,
    useDeleteController,
    useNotify,
    useUnselect,
    useRedirect,
    UseDeleteControllerParams,
} from 'ra-core';
import { humanize, singularize } from 'inflection';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';

export const DeleteWithConfirmButton = <RecordType extends RaRecord = any>(
    inProps: DeleteWithConfirmButtonProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        className,
        confirmTitle: confirmTitleProp,
        confirmContent: confirmContentProp,
        confirmColor = 'primary',
        icon = defaultIcon,
        label: labelProp,
        mutationMode = 'pessimistic',
        onClick,
        redirect: redirectTo = 'list',
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
    const notify = useNotify();
    const unselect = useUnselect(resource);
    const redirect = useRedirect();
    const [open, setOpen] = React.useState(false);
    if (!resource) {
        throw new Error(
            '<DeleteWithConfirmButton> components should be used inside a <Resource> component or provided with a resource prop. (The <Resource> component set the resource prop for all its children).'
        );
    }

    const { onSuccess, onError, ...otherMutationOptions } =
        mutationOptions || {};

    const { isPending, handleDelete } = useDeleteController({
        record,
        redirect: redirectTo,
        mutationMode,
        mutationOptions: {
            ...otherMutationOptions,
            onSuccess: (...args) => {
                setOpen(false);
                if (onSuccess) {
                    onSuccess(...args);
                } else {
                    notify(
                        successMessage ??
                            `resources.${resource}.notifications.deleted`,
                        {
                            type: 'info',
                            messageArgs: {
                                smart_count: 1,
                                _: translate('ra.notification.deleted', {
                                    smart_count: 1,
                                }),
                            },
                            undoable: mutationMode === 'undoable',
                        }
                    );
                    record && unselect([record.id]);
                    redirect(redirectTo, resource);
                }
            },
            onError: (...args) => {
                setOpen(false);
                if (onError) {
                    onError(...args);
                } else {
                    const [error] = args;
                    notify(
                        typeof error === 'string'
                            ? error
                            : (error as Error)?.message ||
                                  'ra.notification.http_error',
                        {
                            type: 'error',
                            messageArgs: {
                                _:
                                    typeof error === 'string'
                                        ? error
                                        : (error as Error)?.message
                                          ? (error as Error).message
                                          : undefined,
                            },
                        }
                    );
                }
            },
        },
        resource,
        successMessage,
    });

    const handleDialogOpen: ReactEventHandler<any> = event => {
        event.stopPropagation();
        setOpen(true);
    };
    const handleDialogClose: ReactEventHandler<any> = () => {
        setOpen(false);
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
            <StyledButton
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
            </StyledButton>
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
> extends ButtonProps,
        UseDeleteControllerParams<RecordType, MutationOptionsError> {
    confirmTitle?: React.ReactNode;
    confirmContent?: React.ReactNode;
    icon?: React.ReactNode;
    confirmColor?: 'primary' | 'warning';
    onClick?: ReactEventHandler<any>;
    // May be injected by Toolbar - sanitized in Button
    /**
     * @deprecated use `titleTranslateOptions` and `contentTranslateOptions` instead
     */
    translateOptions?: object;
    titleTranslateOptions?: object;
    contentTranslateOptions?: object;
}

const PREFIX = 'RaDeleteWithConfirmButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<DeleteWithConfirmButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
