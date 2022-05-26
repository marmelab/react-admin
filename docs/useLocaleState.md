---
layout: default
title: "useLocaleState"
---

# `useLocaleState`

The `useLocaleState` hook allows to read and update the locale. It uses a syntax similar to react's `useState` hook.

```jsx
const [locale, setLocale] = useLocaleState();
```

If you want to offer the ability to change locale at runtime, this hook will come in handy. First, you must provide an `i18nProvider` that contains the messages for all possible locales:

```jsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};
const i18nProvider = polyglotI18nProvider(locale => messages[locale]);

const App = () => (
    <Admin locale="en" i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

Then, use the `useLocaleState` hook to read and update the locale. For instance, the following component allows the user to switch the interface language between English and French:

```jsx
import * as React from "react";
import Button from '@mui/material/Button';
import { useLocaleState } from 'react-admin';

const LocaleSwitcher = () => {
    const [locale, setLocale] = useLocaleState();
    return (
        <div>
            <div>Language</div>
            <Button 
                disabled={locale === 'fr'}
                onClick={() => setLocale('fr')}
            >
                English
            </Button>
            <Button
                disabled={locale === 'en'}
                onClick={() => setLocale('en')}
            >
                French
            </Button>
        </div>
    );
};

export default LocaleSwitcher;
```

As this is a very common need, react-admin provides the [`<LocalesMenuButton>`](./LocalesMenuButton.md) component.
