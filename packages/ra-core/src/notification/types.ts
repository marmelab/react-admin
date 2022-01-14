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
