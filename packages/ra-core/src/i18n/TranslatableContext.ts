import { createContext } from 'react';

export const TranslatableContext = createContext<
    TranslatableContextValue | undefined
>(undefined);

export interface TranslatableContextValue {
    locales: string[];
    selectedLocale: string;
    selectLocale: SelectTranslatableLocale;
}

export type SelectTranslatableLocale = (locale: string) => void;
