import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

export default polyglotI18nProvider(() => defaultMessages, 'en', {
    allowMissing: true,
});
