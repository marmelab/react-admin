import { useContext } from 'react';
import { CloseNotificationContext } from './CloseNotificationContext';

export const useCloseNotification = () => {
    const closeNotification = useContext(CloseNotificationContext);
    if (!closeNotification) {
        throw new Error(
            'useCloseNotification must be used within a CloseNotificationContext.Provider'
        );
    }
    return closeNotification;
};
