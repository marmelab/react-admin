---
layout: default
title: "Writing An I18nProvider"
---

# Writing An I18nProvider

An `i18nProvider` should be an object with three required methods and one optional method:

```jsx
// in src/i18nProvider.js
export const i18nProvider = {
    // required
    translate: (key, options) => string,
    changeLocale: locale => Promise<void>,
    getLocale: () => string,
    // optional
    getLocales: () => [{ locale: string, name: string }],
}
```

## Basic Implementation

Here is the simplest possible implementation for an `i18nProvider` with English and French messages:

```js
import lodashGet from 'lodash/get';

const englishMessages = {
    ra: {
        notification: {
            http_error: 'Network error. Please retry',
        },
        action: {
            save: 'Save',
            delete: 'Delete',
        },
    },
};
const frenchMessages = {
    ra: {
        notification: {
            http_error: 'Erreur réseau, veuillez réessayer',
        },
        action: {
            save: 'Enregistrer',
            delete: 'Supprimer',
        },
    },
};
let messages = englishMessages;

let locale = 'en';

const i18nProvider = {
    translate: key => lodashGet(messages, key),
    changeLocale: newLocale => {
        messages = (newLocale === 'fr') ? frenchMessages : englishMessages;
        locale = newLocale;
        return Promise.resolve();
    },
    getLocale: () => locale
};
```

This works, but it is too limited: react-admin expects that i18nProviders support string interpolation for translation, and asynchronous message loading for locale change. 

## Leveraging Polyglot

That's why react-admin bundles an `i18nProvider` *factory* called `ra-i18n-polyglot`. This factory relies on [polyglot.js](https://airbnb.io/polyglot.js/), which uses JSON files for translations. It only expects one argument: a function returning a list of messages based on a locale passed as an argument. 

So the previous provider can be written as:

```js
import polyglotI18nProvider from 'ra-i18n-polyglot';

const englishMessages = {
    ra: {
        notification: {
            http_error: 'Network error. Please retry',
        },
        action: {
            save: 'Save',
            delete: 'Delete',
        },
    },
};
const frenchMessages = {
    ra: {
        notification: {
            http_error: 'Erreur réseau, veuillez réessayer',
        },
        action: {
            save: 'Enregistrer',
            delete: 'Supprimer',
        },
    },
};

const i18nProvider = polyglotI18nProvider(locale => 
    locale === 'fr' ? frenchMessages : englishMessages,
    'en' // Default locale
);
```

The default (English) messages are available in [the `ra-language-english` package source](https://github.com/marmelab/react-admin/blob/master/packages/ra-language-english/src/index.ts).

Check the [Setting Up Translation](./TranslationSetup.md) for detailed instructions on how to build an `i18nProvider` this way.
