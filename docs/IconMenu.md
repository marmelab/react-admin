---
layout: default
title: "The IconMenu Component"
---

# `<IconMenu>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative menu user interface. It renders a reduced menu bar with a sliding panel for second-level menu items. This menu saves a lot of screen real estate, and allows for sub menus of any level of complexity.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-multilevelmenu-categories.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-multilevelmenu-categories.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Test it live on [the Enterprise Edition Storybook](https://storybook.ra-enterprise.marmelab.com/?path=/story/ra-navigation-iconmenu--basic).

## Usage

Create a custom menu component using the `<IconMenu>` and `<IconMenu.Item>` components from the `ra-navigation` package:

```jsx
// in src/MyMenu.js
import { IconMenu } from "@react-admin/ra-navigation";

import DashboardIcon from '@mui/icons-material/Dashboard';
import MusicIcon from '@mui/icons-material/MusicNote';
import PeopleIcon from '@mui/icons-material/People';

const MyMenu = () => (
  <IconMenu>
    <IconMenu.Item name="dashboard" to="/" label="Dashboard" icon={<DashboardIcon />} />
    <IconMenu.Item name="songs" to="/songs" label="Songs" icon={<MusicIcon />}  />
    <IconMenu.Item name="artists" to="/artists" label="Artists" icon={<PeopleIcon />} />
  </IconMenu>
);
```

Then, create a custom layout using [the `<Layout>` component](./Layout.md) and pass your custom menu component to it. Make sure you wrap the layout with the `<AppLocationContext>` component. 

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import { AppLocationContext } from '@react-admin/ra-navigation';

import { MyMenu } from './MyMenu';

export const MyLayout = (props) => (
  <AppLocationContext>
    <Layout {...props} menu={MyMenu} />
  </AppLocationContext>
);
```

`<AppLocationContext>` is necessary because `ra-navigation` doesn't use the URL to detect the current location. Instead, page components *declare* their location using a custom hook (`useDefineAppLocation()`). This allows complex site maps, with multiple levels of nesting. Check [the ra-navigation documentation](https://marmelab.com/ra-enterprise/modules/ra-navigation) to learn more about App Location. 

Finally, pass this custom layout to the `<Admin>` component. You should apply the theme provided by ra-navigation:

```jsx
// in src/App.js
import { Admin, Resource } from "react-admin";
import { theme } from '@react-admin/ra-navigation';

import { MyLayout } from './MyLayout';

const App = () => (
    <Admin
        layout={MyLayout}
        dataProvider={...}
        theme={theme}
    >
        // ...
    </Admin>
);
```

## Props

| Prop        | Required | Type        | Default  | Description                            |
| ----------- | -------- | ----------- | -------- | -------------------------------------- |
| `children`  | Optional | `ReactNode` | -        | The Menu Item Links to be rendered.    |
| `sx`        | Optional | `SxProps`   | -        | Style overrides, powered by MUI System |

Additional props are passed down to the root `<div>` component.

## `children`

Pass `<IconMenu.Item>` children to `<IconMenu>` to define the main menu entries.

```jsx
// in src/MyMenu.js
import { IconMenu } from "@react-admin/ra-navigation";

import DashboardIcon from '@mui/icons-material/Dashboard';
import MusicIcon from '@mui/icons-material/MusicNote';
import PeopleIcon from '@mui/icons-material/People';

const MyMenu = () => (
  <IconMenu>
    <IconMenu.Item name="dashboard" to="/" label="Dashboard" icon={<DashboardIcon />} />
    <IconMenu.Item name="songs" to="/songs" label="Songs" icon={<MusicIcon />}  />
    <IconMenu.Item name="artists" to="/artists" label="Artists" icon={<PeopleIcon />} />
  </IconMenu>
);
```

Check [the `<IconMenu.Item>` section](#iconmenuitem) for more information.

## `sx`: CSS API

Pass an `sx` prop to customize the style of the main component and the underlying elements.

{% raw %}
```jsx
export const MyMenu = () => (
    <IconMenu sx={{ marginTop: 0 }}>
        // ...
    </IconMenu>
);
```
{% endraw %}

To override the style of `<IconMenu>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaMenuRoot` key.

## `<IconMenu.Item>`

The `<IconMenu.Item>` component displays a menu item with a label and an icon.

```jsx
<IconMenu.Item 
    name="dashboard"
    to="/"
    label="Dashboard"
    icon={<DashboardIcon />}
/>
```

It requires the following props:

- `name`: the name of the location to match. This is used to highlight the current location.
- `to`: the location to link to.
- `label`: The menu item label.
- `icon`: the icon to display.

It accepts optional props:

- `children`: Content of a sliding panel displayed when the menu is clicked (see [Adding sub menus](#adding-sub-menus) below)
- `sx`: Style overrides, powered by MUI System

Additional props are passed down to [the underling Material UI `<listItem>` component](https://mui.com/material-ui/api/list-item/).

## Adding Sub Menus

You can define the content of the sliding panel revealed when the user clicks on a menu by adding children to `<IconMenu.Item>`. `<IconMenu>` renders its children inside a Material UI `<Card>`, so it's common to wrap the content in `<CardContent>`.

For instance, here is how to add a sub menu to the Artists menu with one entry for each artist category:

```jsx
import {
  IconMenu,
  MenuItemList,
  MenuItemNode,
} from "@react-admin/ra-navigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MusicIcon from '@mui/icons-material/MusicNote';
import PeopleIcon from '@mui/icons-material/People';

const MyMenu = () => (
  <IconMenu>
    <IconMenu.Item name="dashboard" to="/" label="Dashboard" icon={<DashboardIcon />} />
    <IconMenu.Item name="songs" to="/songs" label="Songs" icon={<MusicIcon />}  />
    <IconMenu.Item name="artists" to="/artists" label="Artists" icon={<PeopleIcon />}>
      <CardContent>
        {/* to get consistent spacing */}
        <Typography variant="h3" gutterBottom>
          Artist Categories
        </Typography>
        {/* Note that we must wrap our MenuItemNode components in a MenuItemList */}
        <MenuItemList>
          <MenuItemNode
            name="artists.rock"
            to={'/artists?filter={"type":"rock"}'}
            label="Rock"
          />
          <MenuItemNode
            name="artists.jazz"
            to={'/artists?filter={"type":"jazz"}'}
            label="Jazz"
          />
          <MenuItemNode
            name="artists.classical"
            to={'/artists?filter={"type":"classical"}'}
            label="Rock"
          />
        </MenuItemList>
      </CardContent>
    </IconMenu.Item>
  </IconMenu>
);
```

## Creating Menu Items For Resources

If you want to render a custom menu item and the default resource menu items, use the `useResourceDefinitions` hook to retrieve the list of resources and create one menu item per resource.

```jsx
// in src/MyMenu.js
import { createElement } from 'react';
import { useResourceDefinitions } from 'react-admin';
import { IconMenu } from "@react-admin/ra-navigation";
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => {
    const resources = useResourceDefinitions();
    
    return (
        <IconMenu>
            {Object.keys(resources).map(name => (
                <IconMenu.Item
                    key={name}
                    name={name}
                    to={`/${name}`}
                    label={resources[name].options && resources[name].options.label || name}
                    icon={createElement(resources[name].icon)}
                />
            ))}
            <IconMenu.Item name="custom.route" to="/custom-route" label="Miscellaneous" icon={<LabelIcon />} />
        </IconMenu>
    );
};
```
