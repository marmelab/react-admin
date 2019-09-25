import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import ActionDelete from '@material-ui/icons/Delete';
import { fade } from '@material-ui/core/styles/colorManipulator';
import inflection from 'inflection';
import { makeStyles } from '@material-ui/core/styles';
import {
    useTranslate,
    useDeleteMany,
    useRefresh,
    useNotify,
    useUnselectAll,
} from 'ra-core';

import Confirm from '../layout/Confirm';
import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    classes,
    crudDeleteMany,
    filterValues,
    label,
    resource,
    selectedIds,
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

const BulkDeleteWithConfirmButton = ({
    basePath,
    classes: classesOverride,
    crudDeleteMany,
    icon,
    label,
    onClick,
    resource,
    selectedIds,
    ...rest
}) => {
    const [isOpen, setOpen] = useState(false);
    const classes = useStyles({ classes: classesOverride });
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteMany, { loading }] = useDeleteMany(resource, selectedIds, {
        onSuccess: () => {
            refresh();
            notify('ra.notification.deleted', 'info', {
                smart_count: selectedIds.length,
            });
            unselectAll(resource);
        },
        onFailure: error =>
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning'
            ),
    });

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        deleteMany();

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <Fragment>
            <Button
                onClick={handleClick}
                label={label}
                className={classes.deleteButton}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </Button>
            <Confirm
                isOpen={isOpen}
                loading={loading}
                title="ra.message.bulk_delete_title"
                content="ra.message.bulk_delete_content"
                translateOptions={{
                    smart_count: selectedIds.length,
                    name: inflection.humanize(
                        translate(`resources.${resource}.name`, {
                            smart_count: selectedIds.length,
                            _: inflection.inflect(resource, selectedIds.length),
                        }),
                        true
                    ),
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

BulkDeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    icon: PropTypes.element,
};

BulkDeleteWithConfirmButton.defaultProps = {
    label: 'ra.action.delete',
    icon: <ActionDelete />,
};

export default BulkDeleteWithConfirmButton;
