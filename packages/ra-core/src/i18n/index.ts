import defaultI18nProvider from './defaultI18nProvider';
import translate from './translate';
import TranslationProvider from './TranslationProvider';
import useTranslate from './useTranslate';

// Alias to translate to avoid shadowed variable names error with tslint
const withTranslate = translate;

export {
    defaultI18nProvider,
    translate,
    withTranslate,
    useTranslate,
    TranslationProvider,
};
export const DEFAULT_LOCALE = 'en';

export * from './TranslationUtils';
export * from './TranslationContext';
