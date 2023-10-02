# i18next i18n provider for react-admin

i18next i18n provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services. It relies on [i18next](https://www.i18next.com/).

## Installation

```sh
npm install --save ra-i18n-i18next
```

## Usage

```tsx
import { Admin } from 'react-admin';
import { useI18nextProvider, convertRaMessagesToI18next } from 'ra-i18n-i18next';
import englishMessages from 'ra-language-english';

const App = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                translations: convertRaMessagesToI18next(englishMessages)
            }
        }
    });
    if (!i18nProvider) return (<div>Loading...</div>);

    return (
        <Admin i18nProvider={i18nProvider}>
           ...
        </Admin>
    );
};
```

## API

### `useI18nextProvider` hook

A hook that returns an i18nProvider for react-admin applications, based on i18next.

You can provide your own i18next instance but don't initialize it, the hook will do it for you with the options you may provide. Besides, this hook already adds the `initReactI18next` plugin to i18next.

#### Usage

```tsx
import { Admin } from 'react-admin';
import { useI18nextProvider, convertRaMessagesToI18next } from 'ra-i18n-i18next';
import englishMessages from 'ra-language-english';

const App = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                translations: convertRaMessagesToI18next(englishMessages)
            }
        }
    });
    if (!i18nProvider) return (<div>Loading...</div>);

    return (
        <Admin i18nProvider={i18nProvider}>
           ...
        </Admin>
    );
};
```

#### Parameters

| Parameter            | Required | Type        | Default | Description                                                      |
| -------------------- | -------- | ----------- | ------- | ---------------------------------------------------------------- |
| `i18nextInstance`    | Optional | I18n        |         | Your own i18next instance. If not provided, one will be created. |
| `options`            | Optional | InitOptions |         | The options passed to the i18next init function                  |
| `availableLocales`   | Optional | Locale[]    |         | An array describing the available locales. Used to automatically include the locale selector menu in the default react-admin AppBar |

##### `i18nextInstance`

This parameter lets you pass your own instance of i18next, allowing you to customize its plugins such as the backends.

```tsx
import { Admin } from 'react-admin';
import { useI18nextProvider } from 'ra-i18n-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const App = () => {
    const i18nextInstance = i18n
        .use(Backend)
        .use(LanguageDetector);

    const i18nProvider = useI18nextProvider({
        i18nextInstance
    });

    if (!i18nProvider) return (<div>Loading...</div>);

    return (
        <Admin i18nProvider={i18nProvider}>
           ...
        </Admin>
    );
};
```

##### `options`

This parameter lets you pass your own options for the i18n `init` function.

Please refer to [the i18next documentation](https://www.i18next.com/overview/configuration-options) for details.

```tsx
import { Admin } from 'react-admin';
import { useI18nextProvider } from 'ra-i18n-i18next';
import i18n from 'i18next';

const App = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            debug: true,
        }
    });

    if (!i18nProvider) return (<div>Loading...</div>);

    return (
        <Admin i18nProvider={i18nProvider}>
           ...
        </Admin>
    );
};
```

#### `availableLocales`

This parameter lets you provide the list of available locales for your application. This is used by the default react-admin AppBar to detect whether to display a locale selector.

```tsx
import { Admin } from 'react-admin';
import { useI18nextProvider } from 'ra-i18n-i18next';
import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const App = () => {
    const i18nextInstance = i18n.use(
        // Here we use a Backend provided by i18next that allows us to load
        // the translations however we want.
        // See https://www.i18next.com/how-to/add-or-load-translations#lazy-load-in-memory-translations
        resourcesToBackend(language => {
            if (language === 'fr') {
                // Load the ra-language-french package and convert its translations in i18next format
                return import(
                    `ra-language-french`
                ).then(({ default: messages }) =>
                    convertRaTranslationsToI18next(messages)
                );
            }
            // Load the ra-language-english package and convert its translations in i18next format
            return import(`ra-language-english`).then(({ default: messages }) =>
                convertRaTranslationsToI18next(messages)
            );
        })
    );

    const i18nProvider = useI18nextProvider({
        i18nextInstance,
        availableLocales: [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'French' },
        ],
    });

    if (!i18nProvider) return (<div>Loading...</div>);

    return (
        <Admin i18nProvider={i18nProvider}>
           ...
        </Admin>
    );
};
```

### `convertRaMessagesToI18next` function

A function that takes translations from a standard react-admin language package and converts them to i18next format.
It transforms the following:
- interpolations wrappers from `%{foo}` to `{{foo}}` unless a prefix and/or a suffix are provided
- pluralization messages from a single key containing text like `"key": "foo |||| bar"` to multiple keys `"foo_one": "foo"` and `"foo_other": "bar"`

#### Usage

```ts
import englishMessages from 'ra-language-english';
import { convertRaMessagesToI18next } from 'ra-i18n-18next';

const messages = convertRaMessagesToI18next(englishMessages);
```

#### Parameters

| Parameter            | Required | Type        | Default | Description                                                      |
| -------------------- | -------- | ----------- | ------- | ---------------------------------------------------------------- |
| `raMessages`         | Required | object      |         | An object containing standard react-admin translations such as provided by ra-language-english |
| `options`            | Optional | object      |         | An object providing custom interpolation suffix and/or suffix |

@example Convert the english translations from ra-language-english to i18next format with custom interpolation wrappers

##### `options`

If you provided interpolation options to your i18next instance, you should provide them when calling this function:

```ts
import englishMessages from 'ra-language-english';
import { convertRaMessagesToI18next } from 'ra-i18n-18next';

const messages = convertRaMessagesToI18next(englishMessages, {
   prefix: '#{',
  suffix: '}#',
});
```
