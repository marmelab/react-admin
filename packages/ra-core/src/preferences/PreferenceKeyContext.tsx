import * as React from 'react';
import { createContext, useContext } from 'react';

export const PreferenceKeyContext = createContext<string | null>('');

export const PreferenceKeyContextProvider = ({
    value = '',
    children,
}: {
    value?: string | null;
    children: React.ReactNode;
}) => (
    <PreferenceKeyContext.Provider value={value}>
        {children}
    </PreferenceKeyContext.Provider>
);

export const usePreferenceKey = () => {
    return useContext(PreferenceKeyContext);
};
