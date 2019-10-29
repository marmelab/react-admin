import React, { Fragment, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import {
    useTranslate,
    useDelete,
    useRefresh,
    useNotify,
    useRedirect,
    CRUD_DELETE,
} from 'ra-core';

import Confirm from '../layout/Confirm';
import Button from './Button';

const sanitizeRestProps = ({
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
    submitOnEnter,
    redirect,
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

const DeleteWithConfirmButton = ({
    basePath,
    classes: classesOverride,
    className,
    icon,
    label = 'ra.action.delete',
    onClick,
    record,
    resource,
    redirect: redirectTo,
    ...rest
}) => {
    const [open, setOpen] = useState(false);
    const translate = useTranslate();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const classes = useStyles({ classes: classesOverride });

    const [deleteOne, { loading }] = useDelete(
        resource,
        record && record.id,
        record,
        {
            action: CRUD_DELETE,
            onSuccess: () => {
                notify('ra.notification.deleted', 'info', { smart_count: 1 });
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
            undoable: false,
        }
    );

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        setOpen(false);
        e.stopPropagation();
    };

    const handleDelete = useCallback(() => {
        deleteOne();
        if (typeof onClick === 'function') {
            onClick();
        }
    }, [deleteOne, onClick]);

    return (
        <Fragment>
            <Button
                onClick={handleClick}
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
            <Confirm
                isOpen={open}
                loading={loading}
                title="ra.message.delete_title"
                content="ra.message.delete_content"
                translateOptions={{
                    name: inflection.humanize(
                        translate(`resources.${resource}.name`, {
                            smart_count: 1,
                            _: inflection.singularize(resource),
                        }),
                        true
                    ),
                    id: record.id,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

DeleteWithConfirmButton.propTypes = {
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

DeleteWithConfirmButton.defaultProps = {
    redirect: 'list',
    icon: <ActionDelete />,
};

export default DeleteWithConfirmButton;
