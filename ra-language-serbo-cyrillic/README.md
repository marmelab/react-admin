Serbian  cyrillic translations for react-admin, the frontend framework for building admin applications on top of REST/GraphQL services.

Install: npm i ra-language-serbo-cyrillic or yarn add ra-language-serbo-cyrillic

The react-admin by https://marmelab.com/react-admin/ translation.

sr-Cyrl-RS Serbian (Cyrillic) (Serbia)

Usage:

import polyglotI18nProvider from 'ra-i18n-polyglot';

const messages = {
  'serbo-cyrillic': serboCyrillicMessages,
};
const i18nProvider = polyglotI18nProvider(locale => messages[locale], 'serbo-cyrillic');

<Admin i18nProvider={i18nProvider}>
  ...
</Admin>
