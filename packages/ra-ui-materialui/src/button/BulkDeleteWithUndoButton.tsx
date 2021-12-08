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
    CRUD_DELETE_MANY,
    useResourceContext,
    useListContext,
} from 'ra-core';
import { useQueryClient } from 'react-query';

import { Button, ButtonProps } from './Button';
import { BulkActionProps } from '../types';

export const BulkDeleteWithUndoButton = (
    props: BulkDeleteWithUndoButtonProps
) => {
    const {
        basePath,
        label = 'ra.action.delete',
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;
    const { selectedIds } = useListContext(props);
    const queryClient = useQueryClient();

    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const refresh = useRefresh();
    const resource = useResourceContext(props);
    const [deleteMany, { loading }] = useDeleteMany(resource, selectedIds, {
        action: CRUD_DELETE_MANY,
        onSuccess: () => {
            notify(
                'ra.notification.deleted',
                'info',
                { smart_count: selectedIds.length },
                true
            );
            unselectAll(resource);
            // FIXME: Remove when useDeleteMany is migrated to react-query
            queryClient.setQueriesData(
                [resource, 'getList'],
                (old: { data?: any[]; total?: number }) => {
                    if (!old || !old.data) return;
                    const newData = old.data.filter(
                        record => !selectedIds.includes(record.id)
                    );
                    if (newData.length === old.data.length) {
                        return old;
                    }
                    return {
                        data: newData,
                        total: newData.length,
                    };
                }
            );
        },
        onFailure: error => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning',
                {
                    _:
                        typeof error === 'string'
                            ? error
                            : error && error.message
                            ? error.message
                            : undefined,
                }
            );
            refresh();
        },
        mutationMode: 'undoable',
    });

    const handleClick = e => {
        deleteMany();
        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

    return (
        <StyledButton
            onClick={handleClick}
            label={label}
            className={BulkDeleteWithUndoButtonClasses.deleteButton}
            disabled={loading}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionDelete />;

const sanitizeRestProps = ({
    basePath,
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

export const BulkDeleteWithUndoButtonClasses = {
    deleteButton: `${PREFIX}-deleteButton`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
    [`&.${BulkDeleteWithUndoButtonClasses.deleteButton}`]: {
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

BulkDeleteWithUndoButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
};
