import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslate } from '../i18n/useTranslate';
import { useNotificationContext } from '../notification/useNotificationContext';
import { CloseNotificationContext } from '../notification/CloseNotificationContext';
import type { NotificationPayload } from '../notification/types';
import undoableEventEmitter from '../dataProvider/undoableEventEmitter';
import { useTakeUndoableMutation } from '../dataProvider/undo/useTakeUndoableMutation';

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
export const Notification = () => {
    const { notifications, takeNotification } = useNotificationContext();
    const takeMutation = useTakeUndoableMutation();
    const [open, setOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = React.useState<
        NotificationPayload | undefined
    >(undefined);
    const translate = useTranslate();

    useEffect(() => {
        if (notifications.length && !currentNotification) {
            // Set a new snack when we don't have an active one
            const notification = takeNotification();
            if (notification) {
                setCurrentNotification(notification);
                setOpen(true);
            }
        }

        if (currentNotification) {
            const beforeunload = (e: BeforeUnloadEvent) => {
                e.preventDefault();
                const confirmationMessage = '';
                e.returnValue = confirmationMessage;
                return confirmationMessage;
            };

            if (currentNotification?.notificationOptions?.undoable) {
                window.addEventListener('beforeunload', beforeunload);
                return () => {
                    window.removeEventListener('beforeunload', beforeunload);
                };
            }
        }
    }, [notifications, currentNotification, open, takeNotification]);

    const handleRequestClose = useCallback(() => {
        setOpen(false);
        setCurrentNotification(undefined);
    }, [setOpen]);

    const handleExited = useCallback(() => {
        if (
            currentNotification &&
            currentNotification.notificationOptions?.undoable
        ) {
            const mutation = takeMutation();
            if (mutation) {
                mutation({ isUndo: false });
            } else {
                // FIXME kept for BC: remove in v6
                undoableEventEmitter.emit('end', { isUndo: false });
            }
        }
        setCurrentNotification(undefined);
    }, [currentNotification, takeMutation]);

    const handleUndo = useCallback(() => {
        const mutation = takeMutation();
        if (mutation) {
            mutation({ isUndo: true });
        } else {
            // FIXME kept for BC: remove in v6
            undoableEventEmitter.emit('end', { isUndo: true });
        }
        setOpen(false);
    }, [takeMutation]);

    const { message, notificationOptions } = currentNotification || {};
    const { messageArgs, undoable } = notificationOptions || {};

    useEffect(() => {
        if (!undoable) return;
        const timer = setTimeout(() => {
            handleExited();
        }, notificationOptions?.autoHideDuration || 4000);
        return () => clearTimeout(timer);
    }, [undoable, handleExited, notificationOptions]);

    if (!currentNotification) return null;
    return (
        <CloseNotificationContext.Provider value={handleRequestClose}>
            <div
                className="ra-notification"
                style={{
                    color: 'white',
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1400,
                    display: open ? 'flex' : 'none',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderRadius: '4px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }}
            >
                <p>
                    {message && typeof message === 'string'
                        ? translate(message, messageArgs)
                        : message}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {undoable ? (
                        <button onClick={handleUndo} type="button">
                            {translate('ra.action.undo')}
                        </button>
                    ) : null}
                    <button onClick={handleExited} type="button">
                        {translate('ra.action.close')}
                    </button>
                </div>
            </div>
        </CloseNotificationContext.Provider>
    );
};
