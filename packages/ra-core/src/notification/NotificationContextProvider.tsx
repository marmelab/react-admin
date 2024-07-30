import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';

import { NotificationPayload } from './types';
import { NotificationContext } from './NotificationContext';
import { AddNotificationContext } from './AddNotificationContext';

export const NotificationContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationPayload[]>(
        []
    );

    const addNotification = useCallback((notification: NotificationPayload) => {
        setNotifications(notifications => [...notifications, notification]);
    }, []);

    const takeNotification = useCallback(() => {
        if (notifications.length === 0) return;
        const [notification, ...rest] = notifications;
        setNotifications(rest);
        return notification;
    }, [notifications]);

    const resetNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const contextValue = useMemo(
        () => ({
            notifications,
            addNotification,
            takeNotification,
            resetNotifications,
            setNotifications,
        }),
        [notifications] // eslint-disable-line react-hooks/exhaustive-deps
    );

    // we separate the addNotification context to avoid rerendering all components
    // that depend on useNotify when a notification is dispatched
    return (
        <NotificationContext.Provider value={contextValue}>
            <AddNotificationContext.Provider value={addNotification}>
                {children}
            </AddNotificationContext.Provider>
        </NotificationContext.Provider>
    );
};
