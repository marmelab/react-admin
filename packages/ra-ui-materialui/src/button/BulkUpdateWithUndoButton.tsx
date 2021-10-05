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
    CRUD_UPDATE_MANY,
    useResourceContext,
    useListContext,
} from 'ra-core';

import Button, { ButtonProps } from './Button';
import { BulkActionProps } from '../types';

const PREFIX = 'RaBulkUpdateWithUndoButton';

const classes = {
    updateButton: `${PREFIX}-updateButton`,
};

const StyledButton = styled(Button)(({ theme }) => ({
    [`&.${classes.updateButton}`]: {
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

const BulkUpdateWithUndoButton = (props: BulkUpdateWithUndoButtonProps) => {
    const { selectedIds } = useListContext(props);

    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const refresh = useRefresh();
    const resource = useResourceContext(props);

    const {
        basePath,
        classes: classesOverride,
        data,
        label = 'ra.action.update',
        icon = defaultIcon,
        onClick,
        onSuccess = () => {
            notify(
                'ra.notification.updated',
                'info',
                { smart_count: selectedIds.length },
                true
            );
            unselectAll(resource);
            refresh();
        },
        onFailure = error => {
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
        ...rest
    } = props;

    const [updateMany, { loading }] = useUpdateMany(
        resource,
        selectedIds,
        data,
        {
            action: CRUD_UPDATE_MANY,
            onSuccess,
            onFailure,
            undoable: true,
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
            className={classes.updateButton}
            disabled={loading}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionUpdate />;

const sanitizeRestProps = ({
    basePath,
    classes,
    filterValues,
    label,
    selectedIds,
    onSuccess,
    onFailure,
    ...rest
}: Omit<BulkUpdateWithUndoButtonProps, 'resource' | 'icon' | 'data'>) => rest;

export interface BulkUpdateWithUndoButtonProps
    extends BulkActionProps,
        ButtonProps {
    icon?: ReactElement;
    data: any;
    onSuccess?: () => void;
    onFailure?: (error: any) => void;
}

BulkUpdateWithUndoButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
    data: PropTypes.any.isRequired,
};

export default BulkUpdateWithUndoButton;
