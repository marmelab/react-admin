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


## Usage

You can add the `<ToggleThemeButton>` to a custom App Bar:

```jsx
import { AppBar, TitlePortal, ToggleThemeButton, defaultTheme } from 'react-admin';

const darkTheme = {
    palette: { mode: 'dark' },
};

export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
    </AppBar>>
);
```

Then, pass the custom App Bar in a custom `<Layout>`, and the `<Layout>` to your `<Admin>`:

```jsx
import { Admin, Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        ...
    </Admin>
);
```

## `darkTheme`

Required: A theme object to use when the user chooses the dark mode. It must be serializable to JSON.

```jsx
const darkTheme = {
    palette: { mode: 'dark' },
};

<ToggleThemeButton darkTheme={darkTheme} />
```

**Tip**: React-admin calls Material UI's `createTheme()` on this object. 

## `lightTheme`

A theme object to use when the user chooses the light mode. It must be serializable to JSON.

```jsx
const darkTheme = {
    palette: { mode: 'dark' },
};
const lightTheme = {
    palette: {
        type: 'light',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
};

<ToggleThemeButton lightTheme={lightTheme} darkTheme={darkTheme} />
```

React-admin uses the `<Admin theme>` prop as default theme.

**Tip**: React-admin calls Material UI's `createTheme()` on this object. 

## API

* [`ToggleThemeButton`]

[`ToggleThemeButton`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/button/ToggleThemeButton.jsx

