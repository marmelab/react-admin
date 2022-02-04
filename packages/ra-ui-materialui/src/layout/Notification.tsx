import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';

import {
    hideNotification,
    getNotification,
    undo,
    complete,
    undoableEventEmitter,
    useTranslate,
} from 'ra-core';

export interface NotificationProps extends Omit<SnackbarProps, 'open'> {
    type?: string;
    autoHideDuration?: number;
    multiLine?: boolean;
}

const useStyles = makeStyles(
    (theme: Theme) => ({
        success: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
        },
        error: {
            backgroundColor: theme.palette.error.dark,
            color: theme.palette.error.contrastText,
        },
        warning: {
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
        },
        undo: (props: NotificationProps) => ({
            color:
                props.type === 'success'
                    ? theme.palette.success.contrastText
                    : theme.palette.primary.light,
        }),
        multiLine: {
            whiteSpace: 'pre-wrap',
        },
    }),
    { name: 'RaNotification' }
);

const Notification = (props: NotificationProps) => {
    const {
        classes: classesOverride,
        type,
        className,
        autoHideDuration,
        multiLine,
        ...rest
    } = props;
    const [open, setOpen] = useState(false);
    const notification = useSelector(getNotification);
    const dispatch = useDispatch();
    const translate = useTranslate();
    const styles = useStyles(props);

    useEffect(() => {
        setOpen(!!notification);
    }, [notification]);

    const handleRequestClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleExited = useCallback(() => {
        if (notification && notification.undoable) {
            dispatch(complete());
            undoableEventEmitter.emit('end', { isUndo: false });
        }
        dispatch(hideNotification());
    }, [dispatch, notification]);

    const handleUndo = useCallback(() => {
        dispatch(undo());
        undoableEventEmitter.emit('end', { isUndo: true });
    }, [dispatch]);

    if (!notification) return null;

    return (
        <Snackbar
            open={open}
            message={
                notification.message &&
                translate(notification.message, notification.messageArgs)
            }
            autoHideDuration={notification.autoHideDuration || autoHideDuration}
            disableWindowBlurListener={notification.undoable}
            TransitionProps={{ onExited: handleExited }}
            onClose={handleRequestClose}
            ContentProps={{
                className: classnames(
                    styles[notification.type || type],
                    className,
                    {
                        [styles['multiLine']]:
                            notification.multiLine || multiLine,
                    }
                ),
            }}
            action={
                notification.undoable ? (
                    <Button
                        color="primary"
                        className={styles.undo}
                        size="small"
                        onClick={handleUndo}
                    >
                        {translate('ra.action.undo')}
                    </Button>
                ) : null
            }
            {...rest}
        />
    );
};

Notification.propTypes = {
    type: PropTypes.string,
    autoHideDuration: PropTypes.number,
    multiLine: PropTypes.bool,
};

Notification.defaultProps = {
    type: 'info',
    autoHideDuration: 4000,
    multiLine: false,
};

export default Notification;
