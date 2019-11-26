import React from 'react';
import PropTypes from 'prop-types';
import ActionDelete from '@material-ui/icons/Delete';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import {
    useDeleteMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    CRUD_DELETE_MANY,
} from 'ra-core';

import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    classes,
    dispatchCrudDeleteMany,
    filterValues,
    label,
    resource,
    selectedIds,
    startUndoable,
    undoable,
    ...rest
}) => rest;

const useStyles = makeStyles(
    theme => ({
        deleteButton: {
            color: theme.palette.error.main,
            '&:hover': {
                backgroundColor: fade(theme.palette.error.main, 0.12),
                // Reset on mouse devices
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
        },
    }),
    { name: 'RaBulkDeleteWithUndoButton' }
);

const BulkDeleteWithUndoButton = ({
    basePath,
    classes: classesOverride,
    icon,
    label,
    onClick,
    resource,
    selectedIds,
    startUndoable,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const refresh = useRefresh();
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
        onFailure: error =>
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning'
            ),
        undoable: true,
    });

    const handleClick = () => {
        deleteMany();
        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <Button
            onClick={handleClick}
            label={label}
            className={classes.deleteButton}
            disabled={loading}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

BulkDeleteWithUndoButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    startUndoable: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    icon: PropTypes.element,
};

BulkDeleteWithUndoButton.defaultProps = {
    label: 'ra.action.delete',
    undoable: true,
    icon: <ActionDelete />,
};

export default BulkDeleteWithUndoButton;
