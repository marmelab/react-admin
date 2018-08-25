import englishMessages from './i18n/en';

const messages = {
    fr: () => import('./i18n/fr.js').then(messages => messages.default),
};

export default locale => {
    if (locale === 'fr') {
        return messages[locale]();
    }

    console.log({ englishMessages });

    // Always fallback on english
    return englishMessages;
};
