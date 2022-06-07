---
layout: default
title: "Setup"
---

# Setting Up Translations

If you want to add or update translations, you'll have to provide your own `i18nProvider`.

Just like for the `dataProvider` and the `authProvider`, you can inject the `i18nProvider` to your react-admin app using the `<Admin i18nProvider>` prop:

```jsx
import { i18nProvider } from './i18nProvider';

const App = () => (
    <Admin 
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
    >
        {/* ... */}
    </Admin>
);
```

In most cases, the `i18nProvider` will contain translations for both react-admin keys and your own keys.

## Changing The Default Locale

If you want to display the interface in another language than English by default, you have to set up an `i18nProvider` that provides the translation for all the keys used by react-admin. Fortunately, the react-admin community has already written translations for more than 40 locales. Check the [list of available locales](./TranslationLocales.md) to find the locale you're looking for.

For instance, to change the interface to French, install the `ra-language-french` npm package, then use it in a custom `i18nProvider`, as follows:

```jsx
// in src/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import fr from 'ra-language-french';

export const i18nProvider = polyglotI18nProvider(() => fr, 'fr');
```

**Tip**: The `ra-i18n-polyglot` package allows to build an `i18nProvider` based on translation messages. It relies on [the Polyglot.js library](https://airbnb.io/polyglot.js/).

## Supporting Multiple Languages

If you want to let users switch the interface to another locale at runtime, import more than one translation package, and configure `ra-i18n-polyglot` to use them. `ra-i18n-polyglot` generates an `i18nProvider` based on a function parameter. The function takes a locale argument and should return the translations for that locale. 

For instance, to support English and French:

```jsx
// in src/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';

const translations = { en, fr };

export const i18nProvider = polyglotI18nProvider(locale => translations[locale], 'en');
```

The second argument to the `polyglotI18nProvider` function is the default locale.

Next, create a custom App Bar containing the `<LocalesMenuButton>` button, which lets users change the current locale:

```jsx
// in src/MyAppBar.js
import { LocalesMenuButton, AppBar } from 'react-admin';
import { Typography } from '@mui/material';

export const MyAppBar = () => (
    <AppBar>
        <Typography flex="1" variant="h6" id="react-admin-title"/>
        <LocalesMenuButton
            languages={[
                { locale: 'en', name: 'English' },
                { locale: 'fr', name: 'Français' },
            ]}
        />
    </AppBar>
);
```

Then, pass the custom App Bar to a custom `<Layout>`, and the `<Layout>` to your `<Admin>`:

```jsx
import { Admin } from 'react-admin';

import { MyAppBar } from './MyAppBar';
import { i18nProvider } from './i18nProvider';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

const App = () => (
    <Admin
        i18nProvider={i18nProvider}
        dataProvider={dataProvider}
        layout={MyLayout}
    >
        ...
    </Admin>
);
```

That's all it takes to have a multilingual UI. As an added benefit, once a user has chosen a locale different than the default one, the react-admin app will always render using that locale (thanks to [the Store](./Store.md)).

## Using The Browser Locale

React-admin provides a helper function named `resolveBrowserLocale()`, which detects the user's browser locale. To use it, simply pass the function as the `initialLocale` argument of `polyglotI18nProvider`.

```jsx
// in src/i18nProvider.js
import { resolveBrowserLocale } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';

const translations = { en, fr };

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale] ? translations[locale] : translations.en,
    resolveBrowserLocale()
);
```

**Tip**: `resolveBrowserLocale` returns the main locale string ('en', 'fr', etc.), if you use a locale with a region (e.g. 'en-US', 'en-GB'), you must pass `{ fullLocale: true }` as a second argument to `resolveBrowserLocale` to obtain the full locale string.

```jsx
export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale] ? translations[locale] : translations.en,
    resolveBrowserLocale('en', { fullLocale: true }) // 'en' => Default locale when browser locale can't be resolved, { fullLocale: true } => Return full locale
);
```

Beware that users from all around the world may use your application, so make sure the `i18nProvider` returns default messages, even for unknown locales.

## Silencing Translation Warnings

By default, the `polyglotI18nProvider` logs a warning in the console each time it is called with a message that can't be found in the current translations. This is a Polyglot feature that helps to track missing translation messages.

But you may want to avoid this for some messages, e.g. error messages from a data source you don't control (like a web server).

The fastest way to do so is to use the third parameter of the `polyglotI18nProvider` function to pass the `allowMissing` option to Polyglot at initialization:

```diff
// in src/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from './i18n/englishMessages';
import fr from './i18n/frenchMessages';

const i18nProvider = polyglotI18nProvider(locale => 
    locale === 'fr' ? fr : en,
    'en', // Default locale
+   { allowMissing: true }
);
```

**Tip**: Check [the Polyglot documentation](https://airbnb.io/polyglot.js/#options-overview) for a list of options you can pass to Polyglot at startup. 

This solution is all-or-nothing: you can't silence only *some* missing translation warnings. An alternative solution consists of passing a default translation using the `_` translation option, as explained in the [Using Specific Polyglot Features section](#using-specific-polyglot-features) above. 

