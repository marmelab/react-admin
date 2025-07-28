import React from 'react';
import { useIsOffline } from './useIsOffline';

export const IsOffline = ({ children }: { children: React.ReactNode }) => {
    const isOffline = useIsOffline();
    return isOffline ? children : null;
};
