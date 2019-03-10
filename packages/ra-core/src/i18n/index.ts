import defaultI18nProvider from './defaultI18nProvider';
import translate from './translate';
import TranslationProvider from './TranslationProvider';

// Alias to translate to avoid shadowed variable names error with tsling
const withTranslate = translate;

export { defaultI18nProvider, translate, withTranslate, TranslationProvider };
export const DEFAULT_LOCALE = 'en';

export * from './TranslationUtils';
export * from './TranslationContext';
