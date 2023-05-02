---
layout: default
title: "ToggleThemeButton"
---

# `<ToggleThemeButton>`

The `<ToggleThemeButton>` component lets users switch from light to dark mode, and persists that choice by leveraging the [store](./Store.md).

<video controls autoplay muted loop>
  <source src="./img/ToggleThemeButton.webm" type="video/webm"/>
  Your browser does not support the video tag.
</video>


## Usage

You can add the `<ToggleThemeButton>` to a custom App Bar:

```jsx
// in src/MyAppBar.js
import { AppBar, TitlePortal, ToggleThemeButton } from 'react-admin';

export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <ToggleThemeButton />
    </AppBar>>
);
```

Then, pass the custom App Bar in a custom `<Layout>`, and the `<Layout>` to your `<Admin>`. The `<Admin>` must define a `darkTheme` prop for the button to work:

```jsx
import { Admin, Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

const App = () => (
    <Admin
        dataProvider={dataProvider}
        layout={MyLayout} 
        darkTheme={{ palette: { mode: 'dark' } }}
    >
        ...
    </Admin>
);
```

## Creating A Dark Theme

For this button to work, you must provide a dark theme to the `<Admin>` component. The `darkTheme` should be a JSON object that follows the [Material UI theme specification](https://material-ui.com/customization/theming/).

You can create such a theme from scratch:

```jsx
const darkTheme = {
    palette: { mode: 'dark' },
};
```

Of you can override react-admin's default dark theme:

```jsx
import { defaultDarkTheme } from 'react-admin';

const darkTheme = {
    ...defaultDarkTheme,
    palette: {
        ...defaultDarkTheme.palette,
        primary: {
            main: '#90caf9',
        },
    },
};
```

**Tip**: React-admin calls Material UI's `createTheme()` on the `<Admin darkTheme>` prop - don't call it yourself. 

