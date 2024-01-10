import * as React from 'react';
import { ReactNode } from 'react';
import { ChoicesContext, ChoicesContextValue } from './ChoicesContext';

export const ChoicesContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: ChoicesContextValue;
}) => (
    <ChoicesContext.Provider value={value}>{children}</ChoicesContext.Provider>
);
