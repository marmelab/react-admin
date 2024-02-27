import { ReactNode } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationOptions {
    // The duration in milliseconds the notification is shown (pass null to disable auto hide)
    autoHideDuration?: number | null;
    // Arguments used to translate the message
    messageArgs?: any;
    // If true, the notification shows the message in multiple lines
    multiLine?: boolean;
    // If true, the notification shows an Undo button
    undoable?: boolean;
    [key: string]: any;
}

export interface NotificationPayload {
    readonly message: string | ReactNode;
    readonly type: NotificationType;
    readonly notificationOptions?: NotificationOptions;
}
