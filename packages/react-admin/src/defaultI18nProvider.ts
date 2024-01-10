import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

export const defaultI18nProvider = polyglotI18nProvider(
    () => defaultMessages,
    'en',
    [{ name: 'en', value: 'English' }],
    { allowMissing: true }
);
