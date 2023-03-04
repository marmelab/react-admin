import { useCallback, ReactNode } from 'react';

import { useAddNotificationContext } from './useAddNotificationContext';
import { NotificationType, NotificationOptions } from './types';

/**
 * Hook for Notification Side Effect
 *
 * @example
 *
 * const notify = useNotify();
 * // simple message (info level)
 * notify('Level complete');
 * // specify level
 * notify('A problem occurred', { type: 'error' })
 * // pass arguments to the translation function
 * notify('Deleted %{count} elements', { type: 'info', messageArgs: { smart_count: 23 } })
 * // show the action as undoable in the notification
 * notify('Post renamed', { type: 'info', undoable: true })
 */
export const useNotify = () => {
    const addNotification = useAddNotificationContext();
    return useCallback(
        (
            message: string | ReactNode,
            options: NotificationOptions & { type?: NotificationType } = {}
        ) => {
            const {
                type: messageType = 'info',
                ...notificationOptions
            } = options;
            addNotification({
                message,
                type: messageType,
                notificationOptions,
            });
        },
        [addNotification]
    );
};
