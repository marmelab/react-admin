import * as React from 'react';
import { useEffect } from 'react';
import { PreferenceContext } from './PreferenceContext';
import { PreferenceProvider } from './types';

export const PreferenceContextProvider = ({
    value: preferenceProvider,
    children,
}: PreferenceContextProviderProps) => {
    useEffect(() => {
        preferenceProvider.setup();
        return () => {
            preferenceProvider.teardown();
        };
    }, [preferenceProvider]);

    return (
        <PreferenceContext.Provider value={preferenceProvider}>
            {children}
        </PreferenceContext.Provider>
    );
};

export interface PreferenceContextProviderProps {
    value: PreferenceProvider;
    children: React.ReactNode;
}
