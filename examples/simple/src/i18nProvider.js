import englishMessages from './i18n/en';

const messages = {
    // fr: () => import('./i18n/fr.js').then(messages => messages.default),
};

export default locale => {
    // if (locale === 'fr') {
    //     return messages[locale]();
    // }

    // Always fallback on english
  const obj = {};

  Object.values(englishMessages).forEach((value) => {
      obj[value.id] = value.defaultMessage;
  });
  return obj;
};
