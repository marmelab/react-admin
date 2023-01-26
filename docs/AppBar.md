---
layout: default
title: "The AppBar Component"
---

# `<AppBar>`

The default react-admin layout renders a horizontal app bar at the top, which is rendered by the `<AppBar>` component.

![standard layout](./img/layout-component.gif)

By default, the `<AppBar>` component displays:

- a hamburger icon to toggle the sidebar width,
- the application title,
- a button to change locales (it the application uses [i18n](./Translation.md)),
- a loading indicator,
- a button to display the user menu.

You can customize the App Bar by creating a custom component based on `<AppBar>`, with different props. 

## Usage

Create a custom app bar based on react-admin's `<AppBar>`:

```jsx
// in src/MyAppBar.js
import { AppBar } from 'react-admin';
import { Typography } from '@mui/material';

const MyAppBar = props => (
    <AppBar {...props} color="primary">
        <Typography
            variant="h6"
            color="inherit"
            className={classes.title}
            id="react-admin-title"
        />
    </AppBar>
);
```

Then, create a custom layout based on react-admin's `<Layout>`:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

export const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;
```

Then pass this custom layout to the `<Admin>` component:

```jsx
// in src/App.js
import { MyLayout } from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={...}>
        // ...
    </Admin>
);
```

## Props

| Prop                | Required | Type           | Default  | Description                                         |
| ------------------- | -------- | -------------- | -------- | --------------------------------------------------- |
| `children`          | Optional | `ReactElement` | -        | What to display in the central part of the app bar  |
| `color`             | Optional | `string`       | -        | The backgroubd color of the app bar                 |
| `enableColorOnDark` | Optional | `boolean`      | -        | If true, the `color` prop is applied in dark mode   |
| `position`          | Optional | `string`       | -        | The positioning type.                               |
| `sx`                | Optional | `SxProps`      | -        | Style overrides, powered by MUI System              |
| `title`             | Optional | `ReactElement` | -        | A React element rendered at left side of the screen |
| `userMenu`          | Optional | `ReactElement` | -        | The content of the dropdown user menu               |

Additional props are passed to [the underlying MUI `<AppBar>` element](https://mui.com/material-ui/api/app-bar/).

## Adding Buttons

## Customizing the User Menu