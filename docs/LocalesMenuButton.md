---
layout: default
title: "LocalesMenuButton"
---

# `<LocalesMenuButton>`

The `<LocalesMenuButton>` component, also known as the "language switcher", displays a menu allowing users to select the language of the interface. It leverages the [store](./Store.md) so that their selection is persisted.

<video controls autoplay playsinline muted loop>
  <source src="./img/LocalesMenuButton.webm" type="video/webm"/>
  <source src="./img/LocalesMenuButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

**Tip**: For most users, this component will be automatically added to react-admin's `<AppBar>` if the `i18nProvider` is configured properly to return a list of available locales. React-admin will use the optional `getLocales` method of your `i18nProvider` (or the `availableLocales` parameter if you are using `polyglotI18nProvider`) to generate a list of locale menu items for this component.

For advanced users who wish to use the customized `<AppBar>` from Material UI package or place `<LocalesMenuButton>` elsewhere e.g. on a custom configuration page, they can do the following:

```jsx
// in src/MyAppBar.js
import { LocalesMenuButton, TitlePortal } from 'react-admin';
import { AppBar, Toolbar } from '@mui/material';

export const MyAppBar = () => (
    <AppBar>
        <Toolbar>
            <TitlePortal />
            <LocalesMenuButton />
        </Toolbar>
    </AppBar>
);
```

Then, pass the custom App Bar in a custom `<Layout>`, and the `<Layout>` to your `<Admin>`:

```jsx
// in src/App.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { Admin, Resource, Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en', // Default locale
    [{ locale: 'en', name: 'English' }, { locale: 'fr', name: 'Français' }]
);

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

The `<LocalesMenuButton>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)).

To override the style of all instances of `<LocalesMenuButton>` using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaLocalesMenuButton` key.

## API

* [`LocalesMenuButton`]

[`LocalesMenuButton`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/button/LocalesMenuButton.tsx
