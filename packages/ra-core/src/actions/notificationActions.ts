export const SHOW_NOTIFICATION = 'RA/SHOW_NOTIFICATION';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationOptions {
    // The duration in milliseconds the notification is shown
    autoHideDuration?: number;
    // Arguments used to translate the message
    messageArgs?: any;
    // If true, the notification shows the message in multiple lines
    multiLine?: boolean;
    // If true, the notification shows an Undo button
    undoable?: boolean;
}

export interface NotificationPayload {
    readonly message: string;
    readonly type: NotificationType;
    readonly notificationOptions?: NotificationOptions;
}

export interface ShowNotificationAction {
    readonly type: typeof SHOW_NOTIFICATION;
    readonly payload: NotificationPayload;
}

/**
 * Shows a snackbar/toast notification on the screen
 *
 * @see {@link https://v4.mui.com/api/snackbar/|Material ui snackbar component}
 * @see {@link https://material.io/guidelines/components/snackbars-toasts.html|Material ui reference document on snackbar}
 */
export const showNotification = (
    // A translatable label or text to display on notification
    message: string,
    // The type of the notification
    type: NotificationType = 'info',
    // Specify additional parameters of notification
    notificationOptions?: NotificationOptions
): ShowNotificationAction => ({
    type: SHOW_NOTIFICATION,
    payload: {
        ...notificationOptions,
        type,
        message,
    },
});

export const HIDE_NOTIFICATION = 'RA/HIDE_NOTIFICATION';

export interface HideNotificationAction {
    readonly type: typeof HIDE_NOTIFICATION;
}

export const hideNotification = (): HideNotificationAction => ({
    type: HIDE_NOTIFICATION,
});

export const RESET_NOTIFICATION = 'RA/RESET_NOTIFICATION';

export interface ResetNotificationAction {
    readonly type: typeof RESET_NOTIFICATION;
}

export const resetNotification = (): ResetNotificationAction => ({
    type: RESET_NOTIFICATION,
});
