---
layout: default
title: "LocalesMenuButton"
---

# `<LocalesMenuButton>`

The `<LocalesMenuButton>` component, also known as the "language switcher", displays a menu allowing users to select the language of the interface. It leverages the [store](./Store.md) so that their selection is persisted.

![LocalesMenuButton](./img/LocalesMenuButton.gif)

## Usage

**Tip**: For most users, this component will be automatically added to `<AppBar>` if the `i18nProvider` is configured properly to return a list of available locales. React-admin will use the optional `getLocales` method of your `i18nProvider` (or the `availableLocales` parameter if you are using `polyglotI18nProvider`) to generate a list of locale menu items for this component.

For advanced users who wish to add `<LocalesMenuButton>` elsewhere on the `<AppBar>` or to a custom configuation page, they can do the following:

Define an `i18nProvider` with `getLocales` omitted. (or `polyglotI18nProvider` with `availableLocales` omitted).

```jsx
// in src/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

export const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en' // Default locale
    // Omit optional `availableLocales` parameter here so we don't have duplicate `<LocalesMenuButton />` in `<AppBar>`
);
```

Pass a list of supported locals as `languages` prop to `<LocalesMenuButton>` and then add to the `<AppBar>`.

```jsx
// in src/MyAppBar.js
import { LocalesMenuButton, AppBar } from 'react-admin';
import { Typography } from '@mui/material';

export const MyAppBar = (props) => (
    <AppBar {...props}>
        <LocalesMenuButton languages={[
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
        ]} />
        <Typography flex="1" variant="h6" id="react-admin-title"></Typography>
    </AppBar>
);
```

Then, pass the custom App Bar in a custom `<Layout>`, and the `<Layout>` to your `<Admin>`:

```jsx
// in src/App.js
import { Admin, Resource, Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';
import { i18nProvider } from './i18nProvider'

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

## `languages`

An array of objects (`{ locale, name }`) representing the key and the label of the languages available to end users. You can omit this prop if your `i18nProvider` has a `getLocales` function.

```jsx
<LocalesMenuButton languages={[
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'Français' },
]} />
```

The `locale` will be passed to `setLocale` when the user selects the language, and must be supported by the `i18nProvider`.

## `sx`: CSS API

The `<LocalesMenuButton>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)).

To override the style of all instances of `<LocalesMenuButton>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaLocalesMenuButton` key.

## API

* [`LocalesMenuButton`]

[`LocalesMenuButton`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/button/LocalesMenuButton.tsx
