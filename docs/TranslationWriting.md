---
layout: default
title: "Writing An I18nProvider"
---

# Writing An I18nProvider

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

But this is too naive: react-admin expects that i18nProviders support string interpolation for translation, and asynchronous message loading for locale change. That's why react-admin bundles an `i18nProvider` *factory* called `polyglotI18nProvider`. This factory relies on [polyglot.js](https://airbnb.io/polyglot.js/), which uses JSON files for translations. It only expects one argument: a function returning a list of messages based on a locale passed as argument. 

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
