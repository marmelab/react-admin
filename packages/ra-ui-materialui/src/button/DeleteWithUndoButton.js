import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import classnames from 'classnames';
import {
    useDelete,
    useRefresh,
    useNotify,
    useRedirect,
    CRUD_DELETE,
} from 'ra-core';

import Button from './Button';

export const sanitizeRestProps = ({
    basePath,
    classes,
    filterValues,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    label,
    pristine,
    resource,
    saving,
    selectedIds,
    undoable,
    redirect,
    submitOnEnter,
    ...rest
}) => rest;

const useStyles = makeStyles(theme => ({
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
}));

const DeleteWithUndoButton = ({
    label = 'ra.action.delete',
    classes: classesOverride,
    className,
    icon,
    onClick,
    resource,
    record,
    basePath,
    redirect: redirectTo,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();

    const [deleteOne, { loading }] = useDelete(
        resource,
        record && record.id,
        record,
        {
            action: CRUD_DELETE,
            onSuccess: () => {
                notify(
                    'ra.notification.deleted',
                    'info',
                    { smart_count: 1 },
                    true
                );
                redirect(redirectTo, basePath);
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
        }
    );
    const handleDelete = useCallback(
        event => {
            event.stopPropagation();
            deleteOne();
            if (typeof onClick === 'function') {
                onClick();
            }
        },
        [deleteOne, onClick]
    );

    return (
        <Button
            onClick={handleDelete}
            disabled={loading}
            label={label}
            className={classnames(
                'ra-delete-button',
                classes.deleteButton,
                className
            )}
            key="button"
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

DeleteWithUndoButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};

DeleteWithUndoButton.defaultProps = {
    redirect: 'list',
    undoable: true,
    icon: <ActionDelete />,
};

export default DeleteWithUndoButton;
