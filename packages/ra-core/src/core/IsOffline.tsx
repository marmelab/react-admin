import React from 'react';
import { useIsOffine } from './useIsOffline';

export const IsOffline = ({ children }: { children: React.ReactNode }) => {
    const isOffline = useIsOffine();
    return isOffline ? children : null;
};
