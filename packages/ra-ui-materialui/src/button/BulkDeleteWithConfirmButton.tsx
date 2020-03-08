import React, { FC, Fragment, useState, ReactElement } from 'react';
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
    CRUD_DELETE_MANY,
    Identifier,
} from 'ra-core';

import Confirm from '../layout/Confirm';
import Button, { ButtonProps } from './Button';

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
    { name: 'RaBulkDeleteWithConfirmButton' }
);

const BulkDeleteWithConfirmButton: FC<
    BulkDeleteWithConfirmButtonProps
> = props => {
    const {
        basePath,
        classes: classesOverride,
        confirmTitle,
        confirmContent,
        icon,
        label,
        onClick,
        resource,
        selectedIds,
        ...rest
    } = props;
    const [isOpen, setOpen] = useState(false);
    const classes = useStyles(props);
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteMany, { loading }] = useDeleteMany(resource, selectedIds, {
        action: CRUD_DELETE_MANY,
        onSuccess: () => {
            refresh();
            notify('ra.notification.deleted', 'info', {
                smart_count: selectedIds.length,
            });
            unselectAll(resource);
        },
        onFailure: error => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning'
            );
            setOpen(false);
        },
    });

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleDelete = e => {
        deleteMany();

        if (typeof onClick === 'function') {
            onClick(e);
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
                title={confirmTitle}
                content={confirmContent}
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

const sanitizeRestProps = ({
    basePath,
    classes,
    filterValues,
    label,
    ...rest
}: Omit<
    BulkDeleteWithConfirmButtonProps,
    'resource' | 'selectedIds' | 'icon'
>) => rest;

interface Props {
    basePath?: string;
    confirmContent?: string;
    confirmTitle?: string;
    filterValues?: any;
    icon: ReactElement;
    resource: string;
    selectedIds: Identifier[];
}

export type BulkDeleteWithConfirmButtonProps = Props & ButtonProps;

BulkDeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    icon: PropTypes.element,
};

BulkDeleteWithConfirmButton.defaultProps = {
    confirmTitle: 'ra.message.bulk_delete_title',
    confirmContent: 'ra.message.bulk_delete_content',
    label: 'ra.action.delete',
    icon: <ActionDelete />,
};

export default BulkDeleteWithConfirmButton;
