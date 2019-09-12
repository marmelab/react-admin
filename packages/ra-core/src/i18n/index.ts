import defaultI18nProvider from './defaultI18nProvider';
import polyglotI18nProvider from './polyglotI18nProvider';
import translate from './translate';
import { TranslationContext } from './TranslationContext';
import TranslationProvider from './TranslationProvider';
import useLocale from './useLocale';
import useSetLocale from './useSetLocale';
import useTranslate from './useTranslate';

// Alias to translate to avoid shadowed variable names error with tslint
const withTranslate = translate;

export {
    defaultI18nProvider,
    polyglotI18nProvider,
    translate, // deprecated
    withTranslate, // deprecated
    TranslationContext,
    TranslationProvider,
    useLocale,
    useSetLocale,
    useTranslate,
};
export const DEFAULT_LOCALE = 'en';

export * from './TranslationUtils';
export * from './TranslationContext';
