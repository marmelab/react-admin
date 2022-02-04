import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionDelete from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';
import {
    useDeleteMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    useResourceContext,
    useListContext,
} from 'ra-core';

import { Button, ButtonProps } from './Button';
import { BulkActionProps } from '../types';

export const BulkDeleteWithUndoButton = (
    props: BulkDeleteWithUndoButtonProps
) => {
    const {
        label = 'ra.action.delete',
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;
    const { selectedIds } = useListContext(props);

    const notify = useNotify();
    const resource = useResourceContext(props);
    const unselectAll = useUnselectAll(resource);
    const refresh = useRefresh();
    const [deleteMany, { isLoading }] = useDeleteMany();

    const handleClick = e => {
        deleteMany(
            resource,
            { ids: selectedIds },
            {
                onSuccess: () => {
                    notify('ra.notification.deleted', {
                        type: 'info',
                        messageArgs: { smart_count: selectedIds.length },
                        undoable: true,
                    });
                    unselectAll();
                },
                onError: (error: Error) => {
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
                mutationMode: 'undoable',
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
            disabled={isLoading}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionDelete />;

const sanitizeRestProps = ({
    classes,
    filterValues,
    label,
    selectedIds,
    ...rest
}: Omit<BulkDeleteWithUndoButtonProps, 'resource' | 'icon'>) => rest;

export interface BulkDeleteWithUndoButtonProps
    extends BulkActionProps,
        ButtonProps {
    icon?: ReactElement;
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

BulkDeleteWithUndoButton.propTypes = {
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
};
