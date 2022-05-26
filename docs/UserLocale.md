---
layout: default
title: "User Locale"
---

# User Locale

It is often necessary to support multiple locales. This means setting a good default locale for each user but also letting them choose one they prefer.

## Using The Browser Locale

React-admin provides a helper function named `resolveBrowserLocale()`, which detects the user's browser locale. To use it, simply pass the function as the `initialLocale` argument of `polyglotI18nProvider`.

```jsx
import * as React from "react";
import { 
    Admin,
    Resource,
    resolveBrowserLocale,
} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};
const i18nProvider = polyglotI18nProvider(
    locale => messages[locale] ? messages[locale] : messages.en,
    resolveBrowserLocale()
);

const App = () => (
    <Admin i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

**Tip**: `resolveBrowserLocale` returns the main locale string ('en', 'fr', etc.), if you use a locale with a region (e.g. 'en-US', 'en-GB'), you must pass { fullLocale:`true` } as a second argument to `resolveBrowserLocale` in order to obtain the full locale string.

```jsx
const i18nProvider = polyglotI18nProvider(
    locale => messages[locale] ? messages[locale] : messages.en,
    resolveBrowserLocale('en', { fullLocale: true }) // 'en' => Default locale when browser locale can't be resolved, { fullLocale: true } => Return full locale
);
```

Beware that users from all around the world may use your application, so make sure the `i18nProvider` returns default messages, even for unknown locales.

## Adding A Locale Selector

To let users choose their locale, we recommend you add the [`<LocalesMenuButton>`](./LocalesMenuButton.md) inside a custom `<AppBar>`:

{% raw %}
```jsx
// in src/MyAppBar.js
import * as React from 'react';
import { AppBar, LocalesMenuButton } from 'react-admin';
import Typography from '@mui/material/Typography';

const languages = [
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'Français' },
];
]
const MyAppBar = (props) => (
    <AppBar {...props}>
        <Typography
            variant="h6"
            color="inherit"
            sx={{
                flex: 1,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
            }}
            id="react-admin-title"
        />
        <LocalesMenuButton languages={languages} />
    </AppBar>
);

export default MyAppBar;
```
{% endraw %}

To use this custom `MyAppBar` component, pass it as prop to a custom `Layout`, as shown below:

```jsx
// in src/MyLayout.js
import * as React from 'react';
import { Layout } from 'react-admin';
import MyAppBar from './MyAppBar';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

export default MyLayout;
```

Then, use this layout in the `<Admin>` with the `layout` prop:

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={...}>
        // ...
    </Admin>
);
```
