import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { StoreContext } from './StoreContext';
import { Store } from './types';

export const StoreContextProvider = ({
    value: Store,
    children,
}: StoreContextProviderProps) => {
    const initialized = useRef(false);
    const itemsToSetAfterInitialization = useRef<Record<string, any>>([]);

    useEffect(() => {
        Store.setup();
        // Because children might call setItem before the store is initialized,
        // we store those calls parameters and apply them once the store is ready
        if (itemsToSetAfterInitialization.current.length > 0) {
            const items = Object.values(itemsToSetAfterInitialization.current);
            for (const [key, value] of items) {
                Store.setItem(key, value);
            }
            itemsToSetAfterInitialization.current = {};
        }
        initialized.current = true;
        return () => {
            Store.teardown();
            initialized.current = false;
        };
    }, [Store]);

    const wrapper = useMemo<Store>(() => {
        return {
            ...Store,
            setItem: (key, value) => {
                // Because children might call setItem before the store is initialized,
                // we store those calls parameters and apply them once the store is ready
                if (!initialized.current) {
                    itemsToSetAfterInitialization.current.push([key, value]);
                    return;
                }
                Store.setItem(key, value);
            },
        };
    }, [Store, initialized]);

    return (
        <StoreContext.Provider value={wrapper}>
            {children}
        </StoreContext.Provider>
    );
};

export interface StoreContextProviderProps {
    value: Store;
    children: React.ReactNode;
}
