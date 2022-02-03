import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionUpdate from '@mui/icons-material/Update';
import { alpha } from '@mui/material/styles';
import {
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    useResourceContext,
    useListContext,
} from 'ra-core';

import { Button, ButtonProps } from './Button';
import { BulkActionProps } from '../types';

export const BulkUpdateWithUndoButton = (
    props: BulkUpdateWithUndoButtonProps
) => {
    const { selectedIds } = useListContext(props);

    const notify = useNotify();
    const resource = useResourceContext(props);
    const unselectAll = useUnselectAll(resource);
    const refresh = useRefresh();

    const {
        classes: classesOverride,
        data,
        label = 'ra.action.update',
        icon = defaultIcon,
        onClick,
        onSuccess = () => {
            notify('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: selectedIds.length },
                undoable: true,
            });
            unselectAll();
            refresh();
        },
        onError = (error: Error | string) => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                {
                    type: 'warning',
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
        ...rest
    } = props;

    const [updateMany, { isLoading }] = useUpdateMany(
        resource,
        { ids: selectedIds, data },
        {
            onSuccess,
            onError,
            mutationMode: 'undoable',
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
            className={BulkUpdateWithUndoButtonClasses.updateButton}
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
    onSuccess,
    onError,
    ...rest
}: Omit<BulkUpdateWithUndoButtonProps, 'resource' | 'icon' | 'data'>) => rest;

export interface BulkUpdateWithUndoButtonProps
    extends BulkActionProps,
        ButtonProps {
    icon?: ReactElement;
    data: any;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

BulkUpdateWithUndoButton.propTypes = {
    classes: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
    data: PropTypes.any.isRequired,
};

const PREFIX = 'RaBulkUpdateWithUndoButton';

export const BulkUpdateWithUndoButtonClasses = {
    updateButton: `${PREFIX}-updateButton`,
};

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`&.${BulkUpdateWithUndoButtonClasses.updateButton}`]: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));
