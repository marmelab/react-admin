import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export const useNotificationContext = () => useContext(NotificationContext);
