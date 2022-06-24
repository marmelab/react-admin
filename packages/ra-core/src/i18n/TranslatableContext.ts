import { createContext } from 'react';

export const TranslatableContext = createContext<
    TranslatableContextValue | undefined
>(undefined);

export interface TranslatableContextValue {
    getLabel: GetTranslatableLabel;
    getSource: GetTranslatableSource;
    locales: string[];
    selectedLocale: string;
    selectLocale: SelectTranslatableLocale;
}

export type GetTranslatableSource = (field: string, locale?: string) => string;
export type GetTranslatableLabel = (field: string, label?: string) => string;
export type SelectTranslatableLocale = (locale: string) => void;
