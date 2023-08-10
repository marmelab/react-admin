import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar, SnackbarProps, SnackbarOrigin } from '@mui/material';
import clsx from 'clsx';

import {
    useNotificationContext,
    undoableEventEmitter,
    useTranslate,
} from 'ra-core';

const defaultAnchorOrigin: SnackbarOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
};

/**
 * Provides a way to show a notification.
 * @see useNotify
 *
 * @example <caption>Basic usage</caption>
 * <Notification />
 *
 * @param props The component props
 * @param {string} props.type The notification type. Defaults to 'info'.
 * @param {number} props.autoHideDuration Duration in milliseconds to wait until hiding a given notification. Defaults to 4000.
 * @param {boolean} props.multiLine Set it to `true` if the notification message should be shown in more than one line.
 */
export const Notification = (props: NotificationProps) => {
    const {
        className,
        type = 'info',
        autoHideDuration = 4000,
        multiLine = false,
        anchorOrigin = defaultAnchorOrigin,
        ...rest
    } = props;
    const { notifications, takeNotification } = useNotificationContext();
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = React.useState(undefined);
    const translate = useTranslate();

    useEffect(() => {
        const beforeunload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            const confirmationMessage = '';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        if (messageInfo?.notificationOptions?.undoable) {
            window.addEventListener('beforeunload', beforeunload);
        }

        if (notifications.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo(takeNotification());
            setOpen(true);
        } else if (notifications.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }

        return () => {
            if (messageInfo?.notificationOptions?.undoable) {
                window.removeEventListener('beforeunload', beforeunload);
            }
        };
    }, [notifications, messageInfo, open, takeNotification]);

    const handleRequestClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleExited = useCallback(() => {
        if (messageInfo && messageInfo.notificationOptions.undoable) {
            undoableEventEmitter.emit('end', { isUndo: false });
        }
        setMessageInfo(undefined);
    }, [messageInfo]);

    const handleUndo = useCallback(() => {
        undoableEventEmitter.emit('end', { isUndo: true });
        setOpen(false);
    }, []);

    if (!messageInfo) return null;
    const {
        message,
        type: typeFromMessage,
        notificationOptions: {
            autoHideDuration: autoHideDurationFromMessage,
            messageArgs,
            multiLine: multilineFromMessage,
            undoable,
            ...options
        },
    } = messageInfo;

    return (
        <StyledSnackbar
            className={className}
            open={open}
            message={
                message &&
                typeof message === 'string' &&
                translate(message, messageArgs)
            }
            autoHideDuration={
                // Only apply the default autoHideDuration when autoHideDurationFromMessage is undefined
                // as 0 and null are valid values
                autoHideDurationFromMessage === undefined
                    ? autoHideDuration
                    : autoHideDurationFromMessage
            }
            disableWindowBlurListener={undoable}
            TransitionProps={{ onExited: handleExited }}
            onClose={handleRequestClose}
            ContentProps={{
                className: clsx(NotificationClasses[typeFromMessage || type], {
                    [NotificationClasses.multiLine]:
                        multilineFromMessage || multiLine,
                }),
            }}
            action={
                undoable ? (
                    <Button
                        color="primary"
                        className={NotificationClasses.undo}
                        size="small"
                        onClick={handleUndo}
                    >
                        <>{translate('ra.action.undo')}</>
                    </Button>
                ) : null
            }
            anchorOrigin={anchorOrigin}
            {...rest}
            {...options}
        >
            {message && typeof message !== 'string' ? message : null}
        </StyledSnackbar>
    );
};

Notification.propTypes = {
    type: PropTypes.string,
    autoHideDuration: PropTypes.number,
    multiLine: PropTypes.bool,
};

const PREFIX = 'RaNotification';

export const NotificationClasses = {
    success: `${PREFIX}-success`,
    error: `${PREFIX}-error`,
    warning: `${PREFIX}-warning`,
    undo: `${PREFIX}-undo`,
    multiLine: `${PREFIX}-multiLine`,
};

const StyledSnackbar = styled(Snackbar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme, type }: NotificationProps & { theme?: Theme }) => ({
    [`& .${NotificationClasses.success}`]: {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },

    [`& .${NotificationClasses.error}`]: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
    },

    [`& .${NotificationClasses.warning}`]: {
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
    },

    [`& .${NotificationClasses.undo}`]: {
        color:
            type === 'success'
                ? theme.palette.success.contrastText
                : theme.palette.primary.light,
    },
    [`& .${NotificationClasses.multiLine}`]: {
        whiteSpace: 'pre-wrap',
    },
}));

export interface NotificationProps extends Omit<SnackbarProps, 'open'> {
    type?: string;
    autoHideDuration?: number;
    multiLine?: boolean;
}
