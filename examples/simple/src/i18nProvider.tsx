import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from './i18n/en';

const messages = {
    fr: () => import('./i18n/fr').then(messages => messages.default),
};

export default polyglotI18nProvider(locale => {
    if (locale === 'fr') {
        return messages[locale]();
    }

    // Always fallback on english
    return englishMessages;
}, 'en');
