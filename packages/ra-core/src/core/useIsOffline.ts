import * as React from 'react';
import { onlineManager } from '@tanstack/react-query';

/**
 * Hook to determine if the application is offline.
 * It uses the onlineManager from react-query to check the online status.
 * It returns true if the application is offline, false otherwise.
 * @returns {boolean} - True if offline, false if online.
 */
export const useIsOffline = () => {
    const [isOnline, setIsOnline] = React.useState(onlineManager.isOnline());

    React.useEffect(() => {
        const handleChange = () => {
            setIsOnline(onlineManager.isOnline());
        };
        return onlineManager.subscribe(handleChange);
    }, []);

    return !isOnline;
};
