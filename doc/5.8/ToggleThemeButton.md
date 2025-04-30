---
layout: default
title: "ToggleThemeButton"
---

# `<ToggleThemeButton>`

The `<ToggleThemeButton>` component lets users switch from light to dark mode, and persists that choice by leveraging the [store](./Store.md).

<video controls autoplay playsinline muted loop>
  <source src="./img/ToggleThemeButton.webm" type="video/webm"/>
  <source src="./img/ToggleThemeButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

It is enabled by default in the `<AppBar>` as React-admin provides a [built-in dark theme](./AppTheme.md#default).  

## Usage

You can add the `<ToggleThemeButton>` to a custom [`<AppBar toolbar>`](./AppBar.md#toolbar):

```jsx
// in src/MyAppBar.js
import { AppBar, ToggleThemeButton } from 'react-admin';

export const MyAppBar = () => (
    <AppBar toolbar={<ToggleThemeButton />} />
);
```

Then, pass the custom App Bar in a custom `<Layout>`, and the `<Layout>` to your `<Admin>`. The `<Admin>` must define a `darkTheme` prop for the button to work:

{% raw %}
```jsx
import { Admin, Layout } from 'react-admin';
import { MyAppBar } from './MyAppBar';

const MyLayout = ({ children }) => (
    <Layout appBar={MyAppBar}>
        {children}
    </Layout>
);

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
{% endraw %}

## Removing The Button From The AppBar

The `<ToggleThemeButton>` appears by default in the `<AppBar>`. If you want to remove it, you have two solutions:

- you can set the `<Admin>` `darkTheme` prop to `null`:

```tsx
// in src/App.tsx
const App = () => (
    <Admin darkTheme={null}>
        // ...
    </Admin>
);
``` 

- or you can set a custom [`<AppBar toolbar>` prop](./AppBar.md#toolbar):

```tsx
// in src/MyAppBar.tsx
import { AppBar, LocalesMenuButton, RefreshIconButton } from 'react-admin';

export const MyAppBar = () => (
    <AppBar toolbar={
        <>
            <LocalesMenuButton />
            {/* no ToggleThemeButton here */}
            <RefreshIconButton />
        </>
    } />
);
```

## Creating A Dark Theme

For this button to work, you must provide a dark theme to the `<Admin>` component. React-admin provides a [built-in dark theme](./AppTheme.md#default), but you can override it according to your needs.

The `darkTheme` should be a JSON object that follows the [Material UI theme specification](https://material-ui.com/customization/theming/).

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

