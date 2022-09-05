import { useContext } from 'react';
import { AddNotificationContext } from './AddNotificationContext';

export const useAddNotificationContext = () =>
    useContext(AddNotificationContext);
