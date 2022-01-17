import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar, SnackbarProps } from '@mui/material';
import classnames from 'classnames';

import {
    useNotificationContext,
    undoableEventEmitter,
    useTranslate,
} from 'ra-core';

export const Notification = (props: NotificationProps) => {
    const {
        classes: classesOverride,
        type = 'info',
        autoHideDuration = 4000,
        className,
        multiLine = false,
        ...rest
    } = props;
    const { notifications, takeNotification } = useNotificationContext();
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = React.useState(undefined);
    const translate = useTranslate();

    useEffect(() => {
        if (notifications.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo(takeNotification());
            setOpen(true);
        } else if (notifications.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
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

    return (
        <StyledSnackbar
            open={open}
            message={
                messageInfo.message &&
                translate(
                    messageInfo.message,
                    messageInfo.notificationOptions.messageArgs
                )
            }
            autoHideDuration={
                messageInfo.notificationOptions.autoHideDuration ||
                autoHideDuration
            }
            disableWindowBlurListener={messageInfo.notificationOptions.undoable}
            TransitionProps={{ onExited: handleExited }}
            onClose={handleRequestClose}
            ContentProps={{
                className: classnames(
                    NotificationClasses[messageInfo.type || type],
                    className,
                    { [NotificationClasses.multiLine]: multiLine }
                ),
            }}
            action={
                messageInfo.notificationOptions.undoable ? (
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
            {...rest}
        />
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

const StyledSnackbar = styled(Snackbar, { name: PREFIX })(
    ({ theme, type }: NotificationProps & { theme?: Theme }) => ({
        [`& .${NotificationClasses.success}`]: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
        },

        [`& .${NotificationClasses.error}`]: {
            backgroundColor: theme.palette.error.dark,
            color: theme.palette.error.contrastText,
        },

        [`& .${NotificationClasses.warning}`]: {
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
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
    })
);

export interface NotificationProps extends Omit<SnackbarProps, 'open'> {
    type?: string;
    autoHideDuration?: number;
    multiLine?: boolean;
}
