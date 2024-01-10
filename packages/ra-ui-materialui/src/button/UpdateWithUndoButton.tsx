import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionUpdate from '@mui/icons-material/Update';
import {
    useRefresh,
    useNotify,
    useResourceContext,
    RaRecord,
    useRecordContext,
    useUpdate,
    UpdateParams,
} from 'ra-core';
import { UseMutationOptions } from 'react-query';

import { Button, ButtonProps } from './Button';
import { BulkActionProps } from '../types';

export const UpdateWithUndoButton = (props: UpdateWithUndoButtonProps) => {
    const record = useRecordContext(props);
    const notify = useNotify();
    const resource = useResourceContext(props);
    const refresh = useRefresh();

    const {
        data,
        label = 'ra.action.update',
        icon = defaultIcon,
        onClick,
        mutationOptions = {},
        ...rest
    } = props;

    const [updateMany, { isLoading }] = useUpdate();

    const {
        meta: mutationMeta,
        onSuccess = () => {
            notify('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: 1 },
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
            disabled={isLoading}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionUpdate />;

const sanitizeRestProps = ({
    filterValues,
    label,
    selectedIds,
    ...rest
}: Omit<UpdateWithUndoButtonProps, 'resource' | 'icon' | 'data'>) => rest;

export interface UpdateWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> extends BulkActionProps,
        ButtonProps {
    icon?: ReactElement;
    data: any;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UpdateParams<RecordType>
    > & { meta?: any };
}

UpdateWithUndoButton.propTypes = {
    label: PropTypes.string,
    resource: PropTypes.string,
    record: PropTypes.object,
    icon: PropTypes.element,
    data: PropTypes.any.isRequired,
};

const PREFIX = 'RaUpdateWithUndoButton';

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
