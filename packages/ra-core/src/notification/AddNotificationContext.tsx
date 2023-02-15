import { createContext } from 'react';

import { NotificationPayload } from './types';

export const AddNotificationContext = createContext<
    (notification: NotificationPayload) => void
>(() => {});
