---
layout: default
title: "The AppBar Component"
---

# `<AppBar>`

The default react-admin layout renders a horizontal app bar at the top, which is rendered by the `<AppBar>` component.

![standard layout](./img/layout-component.gif)

By default, the `<AppBar>` component displays:

- a hamburger icon to toggle the sidebar width,
- the page title,
- a button to change locales (if the application uses [i18n](./Translation.md)),
- a loading indicator,
- a button to display the user menu.

You can customize the App Bar by creating a custom component based on `<AppBar>`, with different props.

**Tip**: Don't mix react-admin's `<AppBar>` component with [MUI's `<AppBar>` component](https://mui.com/material-ui/api/app-bar/). The first one leverages the second, but adds some react-admin-specific features.

## Usage

Create a custom app bar based on react-admin's `<AppBar>`:

```jsx
// in src/MyAppBar.js
import { AppBar } from 'react-admin';
import { Typography } from '@mui/material';

const MyAppBar = () => <AppBar color="primary" position="sticky" />;
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
| `alwaysOn`          | Optional | `boolean`      | -        | When true, the app bar is always visible            |
| `children`          | Optional | `ReactElement` | -        | What to display in the central part of the app bar  |
| `color`             | Optional | `string`       | -        | The background color of the app bar                 |
| `sx`                | Optional | `SxProps`      | -        | Style overrides, powered by MUI System              |
| `toolbar`           | Optional | `ReactElement` | -        | The content of the toolbar                          |
| `userMenu`          | Optional | `ReactElement` | -        | The content of the dropdown user menu               |

Additional props are passed to [the underlying MUI `<AppBar>` element](https://mui.com/material-ui/api/app-bar/).

## `alwaysOn`

By default, the app bar is hidden when the user scrolls down the page. This is useful to save space on small screens. But if you want to keep the app bar always visible, you can set the `alwaysOn` prop to `true`.

```jsx
// in src/MyAppBar.js
import { AppBar } from 'react-admin';

const MyAppBar = () => <AppBar alwaysOn />;
```

## `children`

The `<AppBar>` component accepts a `children` prop, which is displayed in the central part of the app bar. This is useful to display a logo or a search bar, for example.

```jsx
// in src/MyAppBar.js
import { AppBar } from 'react-admin';
import { Box } from '@mui/material';
import { Search } from "@react-admin/ra-search";

import { Logo } from './Logo';

const MyAppBar = () => (
    <AppBar>
        <Logo />
        <Box component="span" flex={1} />
        <Search />
        <Box component="span" flex={1} />
    </AppBar>
);
```

The above example removes the page title from the app bar. Why? Page components like `<List>` and `<Edit>` set the page title via a [React Portal](https://reactjs.org/docs/portals.html). The default `<AppBar>` child is a component called `<TitlePortal>`, which renders this title portal. So if you want to keep the page title in the app bar, you must include the `<TitlePortal>` component in the children.

```jsx
// in src/MyAppBar.js
import { AppBar, TitlePortal } from 'react-admin';

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        {/* Your custom appbar content here */}
    </AppBar>
);
```

**Tip**: The `<TitlePortal>` component takes all the available space in the app bar, so it "pushes" the following children to the right.

## `color`

React-admin's `<AppBar>` renders a MUI `<AppBar>`, which supports a `color` prop top set the app bar color depending on the theme. By default, the app bar color is set to the `secondary` theme color.

This means you can set the app bar color to 'default', 'inherit', 'primary', 'secondary', 'transparent', or any string.

```jsx
// in src/MyAppBar.js
import { AppBar } from 'react-admin';

export const MyAppBar = () => <AppBar color="primary" />;
```

## `sx`: CSS API

Pass an `sx` prop to customize the style of the main component and the underlying elements.

{% raw %}
```jsx
// in src/MyAppBar.js
import { AppBar } from 'react-admin';

export const MyAppBar = () => (
    <AppBar
        sx={{
            color: 'lightblue',
            '& .RaAppBar-toolbar': { padding: 0 },
        }}
    />
);
```
{% endraw %}

This property accepts the following subclasses:

| Rule name                | Description                   |
|--------------------------|------------------------------ |
| `& .RaAppBar-toolbar`    | Applied the main toolbar      |
| `& .RaAppBar-menuButton` | Applied to the hamburger icon |
| `& .RaAppBar-title`      | Applied to the title portal   |

To override the style of `<AppBar>` using the [MUI style overrides](https://mui.com/customization/theme-components/), use the `RaAppBar` key.

## `toolbar`

By default, the `<AppBar>` renders two buttons in addition to the user menu: the language menu and the refresh button.

If you want to reorder or remove these buttons, you can customize the toolbar by passing a `toolbar` prop.

```jsx 
// in src/MyAppBar.js
import { 
    AppBar,
    LocalesMenuButton,
    RefreshIconButton,
    ToggleThemeButton,
    defaultTheme,
} from 'react-admin';

const darkTheme = {
    palette: { mode: 'dark' },
};

export const MyAppBar = () => (
    <AppBar toolbar={
        <>
            <LocalesMenuButton />
            <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
            <RefreshIconButton />
        </>
    } >
);
```

**Tip**: If you only need to *add* buttons to the toolbar, you can pass them as children instead of overriding the entire toolbar.

```jsx
// in src/MyAppBar.js
import { AppBar, TitlePortal, ToggleThemeButton, defaultTheme } from 'react-admin';

const darkTheme = { palette: { mode: 'dark' } };

export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
    </AppBar>
);
```

## `userMenu`

If your app uses [authentication](./Authentication.md), the `<AppBar>` component displays a button to display the user menu on the right side. By default, the user menu only contains a logout button.

The content of the user menu depends on the return value of `authProvider.getIdentity()`. The user menu icon renders an anonymous avatar, or the `avatar` property of the identity object if present. If the identity object contains a `fullName` property, it is displayed after the avatar. 

You can customize the user menu by passing a `userMenu` prop to the `<AppBar>` component.

```jsx
import { AppBar, UserMenu, useUserMenu } from 'react-admin';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const SettingsMenuItem = () => {
    const { onClose } = useUserMenu();
    return (
        <MenuItem onClick={onClose}>
            <ListItemIcon>
                <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Customize</ListItemText>
        </MenuItem>
    );
};

const MyAppBar = () => (
    <AppBar
        userMenu={
            <UserMenu>
                <SettingsMenuItem />
                <Logout />
            </UserMenu>
        }
    />
);
```

Note that you still have to include the `<Logout>` component in the user menu, as it is responsible for the logout action. Also, for other menu items to work, you must call the `onClose` callback when the user clicks on them to close the user menu.

You can also hide the user menu by setting the `userMenu` prop to `false`.

```jsx
const MyAppBar = () => <AppBar userMenu={false} />;
```

## Changing The Page Title

The app bar displays the page title. CRUD page components (`<List>`, `<Edit>`, `<Create>`, `<Show>`) set the page title based on the current resource and record, and you can override the title by using their `title` prop:

```jsx
// in src/posts/PostList.js
import { List } from 'react-admin';

export const PostList = () => (
    <List title="All posts">
        ...
    </List>
);
```

On your custom pages, you need to use the `<Title>` component to set the page title:

```jsx
// in src/MyCustomPage.js
import { Title } from 'react-admin';

export const MyCustomPage = () => (
    <>
        <Title title="My custom page" />
        <div>My custom page content</div>
    </>
);
```

**Tip**: The `<Title>` component uses a [React Portal](https://reactjs.org/docs/portals.html) to modify the title in the app bar. This is why you need to [include the `<TitlePortal>` component](#children) when you customize the `<AppBar>` children.

## Adding Buttons

To add buttons to the app bar, you can use the `<AppBar>` [`children` prop](#children).

For instance, to add `<ToggleThemeButton>`:

```jsx
// in src/MyAppBar.js
import { 
    AppBar,
    TitlePortal,
    ToggleThemeButton,
    defaultTheme
} from 'react-admin';

const darkTheme = { palette: { mode: 'dark' } };

export const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <ToggleThemeButton lightTheme={defaultTheme} darkTheme={darkTheme} />
    </AppBar>
);
```

**Tip**: The `<TitlePortal>` component displays the page title. As it takes all the available space in the app bar, it "pushes" the following children to the right.

## Adding a Search Input

A common use case for app bar customization is to add a site-wide search engine. The `<Search>` component is a good starting point for this:

```jsx
// in src/MyAppBar.jsx
import { AppBar, TitlePortal } from "react-admin";
import { Search } from "@react-admin/ra-search";

export const MyAppbar = () => (
  <AppBar>
    <TitlePortal />
    <Search />
  </AppBar>
);
```

**Tip**: The `<TitlePortal>` component takes all the available space in the app bar, so it "pushes" the search input to the right.

## Building Your Own AppBar

If react-admin's `<AppBar>` component doesn't meet your needs, you can build your own component using MUI's `<AppBar>`. Here is an example:

```jsx
// in src/MyAppBar.js
import { AppBar, Toolbar, Box } from '@mui/material';
import { TitlePortal, RefreshIconButton } from 'react-admin';

export const MyAppBar = () => (
    <AppBar position="static">
        <Toolbar>
            <TitlePortal />
            <Box flex="1">
            <RefreshIconButton />
        </Toolbar>
    </AppBar>
);
```

Then, use your custom app bar in a custom `<Layout>` component:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';

import { MyAppBar } from './MyAppBar';

export const MyLayout = (props) => (
    <Layout {...props} appBar={MyAppBar} />
);
```