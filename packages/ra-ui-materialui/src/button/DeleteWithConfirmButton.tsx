import React, {
    Fragment,
    useState,
    useCallback,
    FC,
    ReactElement,
    SyntheticEvent,
} from 'react';
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
    Record,
    RedirectionSideEffect,
} from 'ra-core';

import Confirm from '../layout/Confirm';
import Button, { ButtonProps } from './Button';

const DeleteWithConfirmButton: FC<DeleteWithConfirmButtonProps> = ({
    basePath,
    classes: classesOverride,
    className,
    confirmTitle = 'ra.message.delete_title',
    confirmContent = 'ra.message.delete_content',
    icon = defaultIcon,
    label = 'ra.action.delete',
    onClick,
    record,
    resource,
    redirect: redirectTo = 'list',
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
            onFailure: error => {
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    'warning'
                );
                setOpen(false);
            },
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

    const handleDelete = useCallback(
        event => {
            deleteOne();
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [deleteOne, onClick]
    );

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
                title={confirmTitle}
                content={confirmContent}
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

const defaultIcon = <ActionDelete />;

const sanitizeRestProps = ({
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    label,
    pristine,
    saving,
    submitOnEnter,
    undoable,
    ...rest
}: DeleteWithConfirmButtonProps) => rest;

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
    { name: 'RaDeleteWithConfirmButton' }
);

interface Props {
    basePath?: string;
    classes?: object;
    className?: string;
    confirmTitle?: string;
    confirmContent?: string;
    icon?: ReactElement;
    label?: string;
    onClick?: (e: MouseEvent) => void;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar - sanitized in DeleteWithConfirButton
    handleSubmit?: (event?: SyntheticEvent<HTMLFormElement>) => Promise<Object>;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    undoable?: boolean;
}

type DeleteWithConfirmButtonProps = Props & ButtonProps;

DeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};

export default DeleteWithConfirmButton;
