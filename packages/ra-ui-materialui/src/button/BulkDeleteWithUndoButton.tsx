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

import Button, { ButtonProps } from './Button';
import { BulkActionProps } from '../types';

const PREFIX = 'RaBulkDeleteWithUndoButton';

const classes = {
    deleteButton: `${PREFIX}-deleteButton`,
};

const StyledButton = styled(Button)(({ theme }) => ({
    [`&.${classes.deleteButton}`]: {
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

const BulkDeleteWithUndoButton = (props: BulkDeleteWithUndoButtonProps) => {
    const {
        basePath,
        classes: classesOverride,
        label = 'ra.action.delete',
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;
    const { selectedIds } = useListContext(props);

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
            refresh();
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
        undoable: true,
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
            className={classes.deleteButton}
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

BulkDeleteWithUndoButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
};

export default BulkDeleteWithUndoButton;
