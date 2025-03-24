import { createContext } from 'react';

export type CloseNotificationContextValue = () => void;

export const CloseNotificationContext =
    createContext<CloseNotificationContextValue | null>(null);
