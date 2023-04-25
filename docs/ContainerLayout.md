---
layout: default
title: "ContainerLayout"
---

# ContainerLayout

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative to react-admin's `<Layout>` for applications with a limited number of resources. It replaces the sidebar menu by an AppBar menu, and displays the content in a centered container.

![Container layout](https://marmelab.com/ra-enterprise/modules/assets/ra-navigation/latest/container-layout.png)

## Usage

Set `<ContainerLayout>` as the `<Admin layout>` value:

```jsx
import { Admin, Resource } from 'react-admin';
import { ContainerLayout } from '@react-admin/ra-navigation';

export const App = () => (
    <Admin dataProvider={dataProvider} layout={ContainerLayout}>
        <Resource name="songs" list={SongList} />
        <Resource name="artists" list={ArtistList} />
    </Admin>
);
```

See more details in the [ra-navigation documentation](https://marmelab.com/ra-enterprise/modules/ra-navigation#containerlayout).

## Props

`<ContainerLayout>` accepts the following props, all optional:

-   `appBar`: The component to use to render the top AppBar. Defaults to `<Header>`
-   `fixed`: Whether the content `<Container>` should be fixed. Defaults to false.
-   `maxWidth`: The maximum width of the content `<Container>`. Defaults to `md`.
-   `menu`: The menu component to use. Defaults to `<HorizontalMenu>`.
-   `sx`: The style of the layout, and the underlying component. 
-   `toolbar`: The buttons to render on the top right of the toolbar.
-   `userMenu`: The component to use to render the user menu. Defaults to `<UserMenu>`.

## `appBar`

If you want to use a different color for the AppBar, or to make it sticky, pass a custom `appBar` element based on `<Header>`, which is a simple wrapper around [Material UI's `<AppBar>` component](https://mui.com/material-ui/react-app-bar/).

```jsx
import { ContainerLayout, Header } from '@react-admin/ra-navigation';

const myAppBar = <Header color="primary" position="sticky" />;
const MyLayout = props => <ContainerLayout {...props} appBar={myAppBar} />;
```

## `fixed`

If you prefer to design for a fixed set of sizes instead of trying to accommodate a fully fluid viewport, you can set the `fixed` prop. The max-width matches the min-width of the current breakpoint.

```jsx
import { ContainerLayout } from '@react-admin/ra-navigation';

const MyLayout = props => <ContainerLayout {...props} fixed />;
```

## `maxWidth`

This prop allows to set the maximum width of the content [`<Container>`](https://mui.com/material-ui/react-container/). It accepts a string, one of `xs`, `sm`, `md`, `lg`, `xl`, or `false` to remove side margins and occupy the full width of the screen.

```jsx
import { ContainerLayout } from '@react-admin/ra-navigation';

const MyLayout = props => <ContainerLayout {...props} maxWidth="md" />;
```

## `menu`

By default, `<ContainerLayout>` renders one menu item per resource in the admin. To reorder the menu, omit resources, or add custom pages, pass a custom menu element to the `menu` prop. This element should be [a `<HorizontalMenu>` component](./HorizontalMenu.md) with `<HorizontalMenu.Item>` children. Each child should have a `value` corresponding to the [application location](https://marmelab.com/ra-enterprise/modules/ra-navigation#concepts) of the target, and can have a `to` prop corresponding to the target location if different from the app location.

```jsx
import {
    Admin,
    Resource,
    CustomRoutes,
    ListGuesser,
    EditGuesser,
} from 'react-admin';
import { Route } from 'react-router-dom';
import {
    ContainerLayout,
    HorizontalMenu,
    useDefineAppLocation,
} from '@react-admin/ra-navigation';

const Menu = () => (
    <HorizontalMenu>
        <HorizontalMenu.Item label="Dashboard" to="/" value="" />
        <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
        <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
        <HorizontalMenu.Item label="Custom" to="/custom" value="custom" />
    </HorizontalMenu>
);

const MyLayout = props => <ContainerLayout {...props} menu={<Menu />} />;

const CustomPage = () => {
    useDefineAppLocation('custom');
    return <h1>Custom page</h1>;
};

const Dashboard = () => <h1>Dashboard</h1>;
const CustomPage = () => <h1>Custom page</h1>;

export const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout} dashboard={Dashboard}>
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource name="artists" list={ListGuesser} edit={EditGuesser} />
        <CustomRoutes>
            <Route path="custom" element={<CustomPage />} />
        </CustomRoutes>
    </Admin>
);
```

## `sx`

The `sx` prop allows to customize the style of the layout, and the underlying component. It accepts a [Material UI `sx` prop](https://mui.com/system/the-sx-prop/).

{% raw %}
```jsx
import { ContainerLayout } from '@react-admin/ra-navigation';

const MyLayout = props => (
    <ContainerLayout
        {...props}
        sx={{
            '& .MuiToolbar-root': { padding: 0 },
        }}
    />
);
```
{% endraw %}

## `toolbar`

The `toolbar` prop allows to add buttons to the top right of the toolbar. It accepts an element.

```jsx
import { LocalesMenuButton, LoadingIndicator } from 'react-admin';
import { ContainerLayout } from '@react-admin/ra-navigation';

const toolbar = (
    <>
        <LocalesMenuButton />
        <LoadingIndicator />
    </>
);
const MyLayout = props => <ContainerLayout {...props} toolbar={toolbar} />;
```

## `userMenu`

By default, the `<ContainerLayout>` shows a user menu with a single item (logout) when the application has an `authProvider`. You can customize the user menu by passing a custom element to the `userMenu` prop.

{% raw %}
```jsx
import * as React from 'react';
import { Logout, UserMenu, useUserMenu } from 'react-admin';
import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ContainerLayout } from '@react-admin/ra-navigation';

// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const ConfigurationMenu = React.forwardRef((props, ref) => {
    const { onClose } = useUserMenu();
    return (
        <MenuItem
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
            to="/configuration"
            onClick={onClose}
        >
            <ListItemIcon>
                <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Configuration</ListItemText>
        </MenuItem>
    );
});

const CustomUserMenu = () => (
    <UserMenu>
        <MenuList>
            <ConfigurationMenu />
            <Logout />
        </MenuList>
    </UserMenu>
);

export const MyLayout = props => (
    <ContainerLayout {...props} userMenu={<CustomUserMenu />} />
);
```
{% endraw %}