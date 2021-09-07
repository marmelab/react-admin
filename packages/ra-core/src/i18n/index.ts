import translate from './translate';
import { TranslationContext } from './TranslationContext';
import TranslationProvider, {
    TranslationProviderProps,
} from './TranslationProvider';
import TestTranslationProvider from './TestTranslationProvider';
import useLocale from './useLocale';
import useSetLocale from './useSetLocale';
import useTranslate from './useTranslate';

// Alias to translate to avoid shadowed variable names error with tslint
const withTranslate = translate;

export {
    translate, // deprecated
    withTranslate, // deprecated
    TranslationContext,
    TranslationProvider,
    TestTranslationProvider,
    useLocale,
    useSetLocale,
    useTranslate,
};

export type { TranslationProviderProps };

export const DEFAULT_LOCALE = 'en';

export * from './TranslationUtils';
export * from './TranslationContext';
export * from './TranslationMessages';
export * from './TranslatableContext';
export * from './TranslatableContextProvider';
export * from './useTranslatable';
export * from './useTranslatableContext';
