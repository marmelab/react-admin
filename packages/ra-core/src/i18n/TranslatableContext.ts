import { createContext } from 'react';

export const TranslatableContext = createContext<TranslatableContextValue>(
    undefined
);

export interface TranslatableContextValue {
    getInputLabel: GetTranslatableInputLabel;
    getSource: GetTranslatableSource;
    languages: string[];
    selectedLanguage: string;
    selectLanguage: SelectTranslatableLanguage;
}

export type GetTranslatableSource = (
    field: string,
    language?: string
) => string;
export type GetTranslatableInputLabel = (field: string) => string;
export type SelectTranslatableLanguage = (language: string) => void;
