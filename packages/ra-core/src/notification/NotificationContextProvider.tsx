import * as React from 'react';
import { useState, useCallback } from 'react';

import { NotificationPayload } from './types';
import { NotificationContext } from './NotificationContext';

export const NotificationContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationPayload[]>(
        []
    );

    const addNotification = useCallback((notification: NotificationPayload) => {
        setNotifications(notifications => [...notifications, notification]);
    }, []);

    const takeNotification = useCallback(() => {
        const [notification, ...rest] = notifications;
        setNotifications(rest);
        return notification;
    }, [notifications]);

    const resetNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                takeNotification,
                resetNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
