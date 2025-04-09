import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import ActionUpdate from '@mui/icons-material/Update';
import {
    useRefresh,
    useNotify,
    useResourceContext,
    type RaRecord,
    useRecordContext,
    useUpdate,
    type UpdateParams,
    useTranslate,
} from 'ra-core';
import type { UseMutationOptions } from '@tanstack/react-query';

import { Button, type ButtonProps } from './Button';

export const UpdateWithUndoButton = (inProps: UpdateWithUndoButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const record = useRecordContext(props);
    const notify = useNotify();
    const resource = useResourceContext(props);
    const refresh = useRefresh();
    const translate = useTranslate();

    const {
        data,
        label = 'ra.action.update',
        icon = defaultIcon,
        onClick,
        mutationOptions = {},
        ...rest
    } = props;

    const [updateMany, { isPending }] = useUpdate();

    const {
        meta: mutationMeta,
        onSuccess = () => {
            notify(`resources.${resource}.notifications.updated`, {
                type: 'info',
                messageArgs: {
                    smart_count: 1,
                    _: translate('ra.notification.updated', { smart_count: 1 }),
                },
                undoable: true,
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
            refresh();
        },
        ...otherMutationOptions
    } = mutationOptions;

    const handleClick = e => {
        if (!record) {
            throw new Error(
                'The UpdateWithUndoButton must be used inside a RecordContext.Provider or must be passed a record prop.'
            );
        }
        updateMany(
            resource,
            { id: record.id, data, meta: mutationMeta, previousData: record },
            {
                onSuccess,
                onError,
                mutationMode: 'undoable',
                ...otherMutationOptions,
            }
        );
        if (typeof onClick === 'function') {
            onClick(e);
        }
        e.stopPropagation();
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
    ...rest
}: Omit<UpdateWithUndoButtonProps, 'resource' | 'icon' | 'data'>) => rest;

export interface UpdateWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    icon?: React.ReactNode;
    data: any;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UpdateParams<RecordType>
    > & { meta?: any };
}

const PREFIX = 'RaUpdateWithUndoButton';

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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaUpdateWithUndoButton: 'root';
    }

    interface ComponentsPropsList {
        RaUpdateWithUndoButton: Partial<UpdateWithUndoButtonProps>;
    }

    interface Components {
        RaUpdateWithUndoButton?: {
            defaultProps?: ComponentsPropsList['RaUpdateWithUndoButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaUpdateWithUndoButton'];
        };
    }
}
