---
layout: default
title: "LocalesMenuButton"
---

# `<LocalesMenuButton>`

The `<LocalesMenuButton>` component displays a menu allowing users to select the language. It leverages the [store](./Store.md) so that their selection is persisted.

## Usage

```tsx
import React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import {
    Admin,
    Resource,
    LocalesMenuButton,
    List,
    SimpleList,
    Layout,
    AppBar,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

const MyAppBar = (props) => (
    <AppBar {...props}>
        <Box flex="1">
            <Typography variant="h6" id="react-admin-title"></Typography>
        </Box>
        <LocalesMenuButton
            languages={[
                { locale: 'en', name: 'English' },
                { locale: 'fr', name: 'Français' },
            ]}
        />
    </AppBar>
);

const MyLayout = (props) => (
    <Layout {...props} appBar={MyAppBar} />
);

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en' // Default locale
);

const App = () => (
    <Admin
        i18nProvider={i18nProvider}
        dataProvider={dataProvider}
        layout={MyLayout}
    >
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

## API

* [`LocalesMenuButton`]

[`LocalesMenuButton`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/button/LocalesMenuButton.tsx

## `sx`: CSS API

The `<LocalesMenuButton>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                 | Description                                             |
|---------------------------|---------------------------------------------------------|
| `& .RaLocalesMenuButton-selectedLanguage`      | Applied to the `Typography` component that shows the current language |

To override the style of all instances of `<LocalesMenuButton>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaLocalesMenuButton` key.
