import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionUpdate from '@material-ui/icons/Update';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(
    theme => ({
        updateButton: {
            color: theme.palette.primary.main,
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                // Reset on mouse devices
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
        },
    }),
    { name: 'RaBulkUpdateWithUndoButton' }
);

const BulkUpdateWithUndoButton = (props: BulkUpdateWithUndoButtonProps) => {
    const { selectedIds } = useListContext(props);
    const classes = useStyles(props);
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const refresh = useRefresh();
    const resource = useResourceContext(props);

    const {
        basePath,
        classes: classesOverride,
        data,
        icon,
        label,
        onClick,
        onSuccess = () => {
            notify('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: selectedIds.length },
                undoable: true,
            });
            unselectAll(resource);
            refresh();
        },
        onFailure = error => {
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
        <Button
            onClick={handleClick}
            label={label}
            className={classes.updateButton}
            disabled={loading}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

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

BulkUpdateWithUndoButton.defaultProps = {
    label: 'ra.action.update',
    icon: <ActionUpdate />,
};

export default BulkUpdateWithUndoButton;
