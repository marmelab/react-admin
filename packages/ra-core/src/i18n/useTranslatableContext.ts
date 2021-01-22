import { useContext } from 'react';
import {
    TranslatableContext,
    TranslatableContextValue,
} from './TranslatableContext';

/**
 * Gives access to the current TranslatableContext.
 */
export const useTranslatableContext = (): TranslatableContextValue => {
    const context = useContext(TranslatableContext);

    if (!context) {
        throw new Error(
            'useTranslatableContext must be used inside a TranslatableContextProvider'
        );
    }

    return context;
};
