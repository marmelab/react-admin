Serbian latin translations for react-admin, the frontend framework for building admin applications on top of REST/GraphQL services.

Install: npm i ra-language-serbo-latin or yarn add ra-language-serbo-latin

The react-admin by https://marmelab.com/react-admin/ translation.

sr-Latn-RS Serbian (Latin) (Serbia)

Usage:

import serboLatinMessages from 'ra-language-serbo-latin';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const messages = {
  'serbo-latin': serboLatinMessages,
};
const i18nProvider = polyglotI18nProvider(locale => messages[locale], 'serbo-latin');

<Admin i18nProvider={i18nProvider}>
  ...
</Admin>
