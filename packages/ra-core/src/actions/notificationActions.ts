export const SHOW_NOTIFICATION = 'RA/SHOW_NOTIFICATION';

export type NotificationType = 'info' | 'warning' | 'error';

interface NotificationOptions {
    // The type of the notification
    autoHideDuration?: number;
    // Arguments used to translate the message
    messageArgs?: any;
}

export interface Notification {
    readonly message: string;
    readonly type: NotificationType;
    readonly notificationOptions?: NotificationOptions;
}

export interface ShowNotificationAction {
    readonly type: typeof SHOW_NOTIFICATION;
    readonly payload: Notification;
}

/**
 * Shows a snackbar/toast notification on the screen
 *
 * @see {@link https://material-ui.com/api/snackbar/|Material ui snackbar component}
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
