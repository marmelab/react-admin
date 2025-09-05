---
title: "I18N"
sidebar:
  order: 7
---

<video controls autoplay playsinline muted loop>
  <source src="../img/translation.webm" type="video/webm"/>
  <source src="../img/translation.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The ra-core user interface uses English as the default language. But you can also display the UI and content in other languages, allow changing language at runtime, and even lazy-loading optional languages to avoid increasing the bundle size with all translations. 

You will use translation features mostly via the `i18nProvider`, and a set of hooks (`useTranslate`, `useLocaleState`).

We'll use a bit of custom vocabulary in this section:
 
- "i18n" is a shorter way to write "internationalization" (an "i" followed by 18 letters followed by "n") 
- "locale" is a concept similar to language, but it also includes the concept of country. For instance, there are several English locales (like `en_us` and `en_gb`) because US and UK citizens don't use exactly the same language. For ra-core, the "locale" is just a key for your i18nProvider, so it can have any value you want.
- "translation key" is a string that is used to identify a piece of text in your application, e.g. "ra.action.save" for a save button label

## Anatomy Of An `i18nProvider` 

Just like for data fetching and authentication, ra-core is agnostic to your translation backend. It relies on a provider for internationalization. It's called the `i18nProvider`, and it manages translation and language changes.

It should be an object with the following methods:

```ts
// in src/i18nProvider.ts
export const i18nProvider = {
    // required
    translate: (key, options) => string,
    changeLocale: locale => Promise<void>,
    getLocale: () => string,
    // optional
    getLocales: () => [{ locale: string, name: string }],
}
```

Use the `<CoreAdmin i18nProvider>` prop to define the `i18nProvider` of a ra-core app:

```jsx
import { i18nProvider } from './i18nProvider';

const App = () => (
    <CoreAdmin 
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
    >
        {/* ... */}
    </CoreAdmin>
);
```

If you want to add or update translations, you’ll have to provide your own `i18nProvider`.

## Translation Keys

Ra-core components use translation keys for their text and rely on the `i18nProvider` to translate them.

For instance, the following save button renders the word 'Save' in English and 'Enregistrer' in French. This is because the button actually renders the return value of the `i18nProvider.translate('ra.action.save')` method:

```jsx
import { useTranslate } from 'ra-core';

const SaveButton = ({ doSave }) => {
    const translate = useTranslate(); // returns the i18nProvider.translate() method
    return (
        <button onClick={doSave}>
            {translate('ra.action.save')}
        </button>
    );
};
```

If you build an app for users from several countries, you should do the same: always use translation keys instead of plain text in your own components:

```jsx
// in src/MyHelloButton.js
import * as React from "react";
import { useTranslate } from 'ra-core';

export const MyHelloButton = () => {
    const translate = useTranslate();
    const handleClick = () => {
        /* ... */
    };
    return (
        <button>{translate('myroot.hello.world')}</button>
    );
};
```

Check the [Translating the UI](./TranslationTranslating.md) for example usage of the `useTranslate` hook. 

## `ra-i18n-polyglot`

Although you can build an `i18nProvider` from scratch, ra-core provides a package called `ra-i18n-polyglot` that leverages [the Polyglot.js library](https://airbnb.io/polyglot.js/) to build an `i18nProvider` based on a dictionary of translations.

```jsx
// in src/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';

const translations = { en, fr };

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale],
    'en', // default locale
    [{ locale: 'en', name: 'English' }, { locale: 'fr', name: 'Français' }],
);

// in src/App.js
import { CoreAdmin } from 'ra-core';
import { i18nProvider } from './i18nProvider';

const App = () => (
    <CoreAdmin
        i18nProvider={i18nProvider}
        dataProvider={dataProvider}
    >
        ...
    </CoreAdmin>
);
```

Check [the translation setup documentation](./TranslationSetup.md) for details about `ra-i18n-polyglot` and how to configure it.

## `ra-i18n-i18next`

Ra-core also provides a package called `ra-i18n-i18next` that leverages [the i18next library](https://www.i18next.com/) to build an `i18nProvider` based on a dictionary of translations.

You might prefer this package over `ra-i18n-polyglot` when:
- you already use i18next services such as [locize](https://locize.com/)
- you want more control on how you organize translations, leveraging [multiple files and namespaces](https://www.i18next.com/principles/namespaces)
- you want more control on how you [load translations](https://www.i18next.com/how-to/add-or-load-translations)
- you want to use features not available in Polyglot such as:
    - [advanced formatting](https://www.i18next.com/translation-function/formatting);
    - [nested translations](https://www.i18next.com/translation-function/nesting)
    - [context](https://www.i18next.com/translation-function/context)

```tsx
// in src/i18nProvider.js
import i18n from 'i18next';
import { useI18nextProvider, convertRaTranslationsToI18next } from 'ra-i18n-i18next';

const i18nInstance = i18n.use(
    resourcesToBackend(language => {
        if (language === 'fr') {
            return import(
                `ra-language-french`
            ).then(({ default: messages }) =>
                convertRaTranslationsToI18next(messages)
            );
        }
        return import(`ra-language-english`).then(({ default: messages }) =>
            convertRaTranslationsToI18next(messages)
        );
    })
);

export const useMyI18nProvider = () => useI18nextProvider({
    i18nInstance,
    availableLocales: [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'French' },
    ],
});

// in src/App.tsx
import { CoreAdmin } from 'ra-core';
import { useMyI18nProvider } from './i18nProvider';

const App = () => {
    const i18nProvider = useMyI18nProvider();
    if (!i18nProvider) return null;

    return (
        <CoreAdmin
            i18nProvider={i18nProvider}
            dataProvider={dataProvider}
        >
            ...
        </CoreAdmin>
    );
};
```

Check [the ra-i18n-i18next documentation](https://github.com/marmelab/react-admin/tree/master/packages/ra-i18n-i18next) for details.

## Translation Files

`ra-i18n-polyglot` relies on JSON objects for translations. This means that the only thing required to add support for a new language is a JSON file.

Translation files match a translation key to a translated text. They look like the following:

```js
const englishMessages = {
    // ra-core components
    ra: {
        action: {
            cancel: 'Cancel',
            clone: 'Clone',
            confirm: 'Confirm',
            create: 'Create',
            delete: 'Delete',
            edit: 'Edit',
            export: 'Export',
            list: 'List',
            refresh: 'Refresh',
            save: 'Save',
        },
        boolean: {
            true: 'Yes',
            false: 'No',
            null: ' ',
        },
        /* ...*/
    },
    // resources and fields
    resources: {
        shoe: {
            name: 'Shoe |||| Shoes',
            fields: {
                model: 'Model',
                stock: 'Nb in stock',
                color: 'Color',
            },
        },
        customer: {
            name: 'Customer |||| Customers',
            fields: {
                first_name: 'First name',
                last_name: 'Last name',
                dob: 'Date of birth',
            }
        }
        /* ...*/
    },
    // custom components
    acme: {
        buttons: {
            allow: 'Allow',
            deny: 'Deny',
        },
        notifications: {
            error: 'An error occurred',
            success: 'Success',
        },
        /* ...*/
    }
};
```

**Tip**: The default (English) messages are available in [the `ra-language-english` package source](https://github.com/marmelab/react-admin/blob/master/packages/ra-language-english/src/index.ts).

When building an internationalized app with ra-core, the usual workflow is therefore to let developers write the main translation file. Then, pass this file to a team of translators, with the task to translate it. They can use any software they want for that (even software using Gettext/PO files, as it's possible to convert POT to and from JSON). Finally, aggregate all the translations into an `i18nProvider`.

Check [the translation setup documentation](./TranslationSetup.md) to understand how to build your own translation file, the [list of available translations](./TranslationLocales.md) to find a translation for your language, and  [Translating the UI](./TranslationTranslating.md) to understand how to translate ra-core components.

## Localization

For numeric and temporal values, ra-core benefits from the Single-Page Application architecture. As the application executes in the browser, it uses the browser's locale by default to format numbers and dates.

For instance, you can format dates using the `Intl.DateTimeFormat` API in your custom components:

```tsx
import { useRecordContext } from 'ra-core';

const DateField = ({ source, locale }) => {
    const record = useRecordContext();
    const value = record?.[source];
    if (!value) return null;
    
    const formatter = new Intl.DateTimeFormat(locale || navigator.language);
    return <span>{formatter.format(new Date(value))}</span>;
};

// Default usage
<DateField source="published_at" />
// renders the record { id: 1234, published_at: new Date('2017-04-23') } as
// <span>4/23/2017</span>

// Usage with a specific locale
<DateField source="published_at" locale="fr-FR" />
// renders the record { id: 1234, published_at: new Date('2017-04-23') } as
// <span>23/04/2017</span>
```

You can force a specific locale by passing the `locale` prop to your custom formatting functions, or use the browser's default locale for automatic localization based on the user's preferences.
