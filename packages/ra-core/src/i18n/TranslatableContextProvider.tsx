import * as React from 'react';
import {
    TranslatableContext,
    TranslatableContextValue,
} from './TranslatableContext';

export const TranslatableContextProvider = ({
    children,
    value,
}: {
    children: React.ReactNode;
    value: TranslatableContextValue;
}): React.ReactNode => {
    return (
        <TranslatableContext.Provider value={value}>
            {children}
        </TranslatableContext.Provider>
    );
};
