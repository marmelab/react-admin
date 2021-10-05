import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import classnames from 'classnames';

import {
    hideNotification,
    getNotification,
    undo,
    complete,
    undoableEventEmitter,
    useTranslate,
} from 'ra-core';

interface Props {
    type?: string;
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
        undo: (props: Props & Omit<SnackbarProps, 'open'>) => ({
            color:
                props.type === 'success'
                    ? theme.palette.success.contrastText
                    : theme.palette.primary.light,
        }),
    }),
    { name: 'RaNotification' }
);

const Notification = (props: Props & Omit<SnackbarProps, 'open'>) => {
    const {
        classes: classesOverride,
        type,
        className,
        autoHideDuration,
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

    return (
        <Snackbar
            open={open}
            message={
                notification &&
                notification.message &&
                translate(notification.message, notification.messageArgs)
            }
            autoHideDuration={
                (notification && notification.autoHideDuration) ||
                autoHideDuration
            }
            disableWindowBlurListener={notification && notification.undoable}
            TransitionProps={{ onExited: handleExited }}
            onClose={handleRequestClose}
            ContentProps={{
                className: classnames(
                    styles[(notification && notification.type) || type],
                    className
                ),
            }}
            action={
                notification && notification.undoable ? (
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
};

Notification.defaultProps = {
    type: 'info',
    autoHideDuration: 4000,
};

export default Notification;
