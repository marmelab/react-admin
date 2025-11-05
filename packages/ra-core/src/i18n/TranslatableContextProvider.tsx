import * as React from 'react';
import { ReactNode } from 'react';
import {
    TranslatableContext,
    TranslatableContextValue,
} from './TranslatableContext';

export const TranslatableContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: TranslatableContextValue;
}) => {
    return (
        <TranslatableContext.Provider value={value}>
            {children}
        </TranslatableContext.Provider>
    );
};
