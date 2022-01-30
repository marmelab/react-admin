import * as React from 'react';
import { useEffect } from 'react';
import { StoreContext } from './StoreContext';
import { StoreProvider } from './types';

export const StoreContextProvider = ({
    value: StoreProvider,
    children,
}: StoreContextProviderProps) => {
    useEffect(() => {
        StoreProvider.setup();
        return () => {
            StoreProvider.teardown();
        };
    }, [StoreProvider]);

    return (
        <StoreContext.Provider value={StoreProvider}>
            {children}
        </StoreContext.Provider>
    );
};

export interface StoreContextProviderProps {
    value: StoreProvider;
    children: React.ReactNode;
}
