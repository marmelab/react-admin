---
layout: default
title: "The Menu Component"
---

# `<Menu>`

This component renders a menu, with one menu item per resource by default. You can also set menu items by hand.

![standard menu](./img/menu.webp)

## Usage

You can create a custom menu component using react-admin's `<Menu>` and `<Menu.Item>` components:

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';

import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/posts" primaryText="Posts" leftIcon={<BookIcon />}/>
        <Menu.Item to="/comments" primaryText="Comments" leftIcon={<ChatBubbleIcon />}/>
        <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />}/>
        <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>
    </Menu>
);
```

Then, create a custom layout using [the `<Layout>` component](./Layout.md) and pass your custom menu component to it:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';

import { MyMenu } from './MyMenu';

export const MyLayout = props => <Layout {...props} menu={MyMenu} />;
```

Finally, pass this custom layout to the `<Admin>` component:

```jsx
// in src/App.js
import { MyLayout } from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={...}>
        // ...
    </Admin>
);
```

**Tip**: `<Menu.DashboardItem>` is a shortcut for `<DashboardMenuItem>`, and `<Menu.Item>` is a shortcut for `<MenuItemLink>`.

## Props

| Prop        | Required | Type        | Default  | Description                                                                          |
| ----------- | -------- | ----------- | -------- | ------------------------------------------------------------------------------------ |
| `children`  | Optional | `ReactNode` | -        | The Menu Item Links to be rendered. If not provided, defaults to the Resource names. |
| `sx`        | Optional | `SxProps`   | -        | Style overrides, powered by MUI System                                               |

Additional props are passed down to the root component (the MUI [`<MenuList>`](https://mui.com/material-ui/api/menu-list/) component)

## `children`

`<Menu>` without children renders one menu item per resource, in the same order as they are declared in `<Admin>`, using the `<Resource icon>` prop as menu icon. The menu target is the `list` route of the resource. If you define a `<Admin dashboard>` component, react-admin adds a dashboard menu item at the top of the menu.

```jsx
import { Admin, Resource, Layout, Menu } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';

import { dataProvider } from './dataProvider';

const MyMenu = () => <Menu />;
const MyLayout = (props) => <Layout {...props} menu={MyMenu} />

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout} dashboard={MyDashboard}>
        <Resource name="posts" list={PostList} icon={BookIcon} />
        <Resource name="comments" list={CommentList} icon={ChatBubbleIcon} />
        <Resource name="tags" list={TagList} />
        <Resource name="users" list={UserList} icon={PeopleIcon} />
    </Admin>
);
```

![standard menu with dashboard](./img/menu-with-dashboard.webp)

If you pass children to `<Menu>`, they will override the default menu items. Use `<Menu.Item>` to add custom menu items, and `<Menu.DashboardItem>` to add a menu item for the dashboard.

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';

import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/posts" primaryText="Posts" leftIcon={<BookIcon />}/>
        <Menu.Item to="/comments" primaryText="Comments" leftIcon={<ChatBubbleIcon />}/>
        <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />}/>
        <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>
    </Menu>
);
```

Check [the `<Menu.Item>` section](#menuitem) for more information.

## `sx`: CSS API

Pass an `sx` prop to customize the style of the main component and the underlying elements.

{% raw %}
```jsx
export const MyMenu = () => (
    <Menu sx={{ 
        marginTop: 0
        '&.RaMenu-closed': {
            opacity: 0.8,
        },
    }} >
);
```
{% endraw %}

This property accepts the following subclasses:

| Rule name         | Description                          |
|-------------------|------------------------------------- |
| `&.RaMenu-open`   | Applied the menu when it's open      |
| `&.RaMenu-closed` | Applied to the menu when it's closed |

To override the style of `<Layout>` using the [MUI style overrides](https://mui.com/customization/theme-components/), use the `RaMenu` key.

## `<Menu.Item>`

The `<Menu.Item>` component displays a menu item with a label and an icon - or only the icon with a tooltip when the sidebar is minimized. It also handles the automatic closing of the menu on tap on mobile.

The `primaryText` prop accepts a string or a React node. You can use it e.g. to display a badge on top of the menu item:

```jsx
import Badge from '@mui/material/Badge';

<Menu.Item to="/custom-route" primaryText={
    <Badge badgeContent={4} color="primary">
        Notifications
    </Badge>
} />
``` 

The `letfIcon` prop allows setting the menu left icon.

Additional props are passed down to [the underling MUI `<MenuItem>` component](https://mui.com/api/menu-item/#menuitem-api).

**Tip**: The `<Menu.Item>` component makes use of the React Router [NavLink](https://reactrouter.com/docs/en/v6/components/nav-link) component, hence allowing to customize the active menu style. For instance, here is how to use a custom theme to show a left border for the active menu:

```jsx
export const theme = {
    palette: {
        // ...
    },
  components: {
    // ... 
    RaMenuItemLink: {
        styleOverrides: {
            root: {
                // invisible border when not active, to avoid position flashs
                borderLeft: '3px solid transparent', 
                '&.RaMenuItemLink-active': {
                    borderLeft: '10px solid #4f3cc9',
                },
                '& .RaMenuItemLink-icon': {
                    color: '#EFC44F',
                },
            },
        },
    },
};
```

## `<Menu.DashboardItem>`

The `<Menu.DashboardItem>` component displays a menu item for the dashboard.

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';

import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/posts" primaryText="Posts" leftIcon={<BookIcon />}/>
        <Menu.Item to="/comments" primaryText="Comments" leftIcon={<ChatBubbleIcon />}/>
        <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />}/>
        <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>
    </Menu>
);
```

Clicking on the dashboard menu item leads to the `/` route and renders the component defined in [the `<Admin dashboard>` prop](./Admin.md#dashboard).

## Creating Menu Items For Resources

Developers often want to *add* custom menu items in addition to the default ones. But passing `children` to `<Menu>` actually *replaces* the default menu items.

If you want to render a custom menu item and the default resource menu items, use the `useResourceDefinitions` hook to retrieve the list of resources and create one menu item per resource.

```jsx
// in src/MyMenu.js
import * as React from 'react';
import { createElement } from 'react';
import { useMediaQuery } from '@mui/material';
import { Menu, useResourceDefinitions } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => {
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const resources = useResourceDefinitions();
    
    return (
        <Menu>
            {Object.keys(resources).map(name => (
                <Menu.Item
                    key={name}
                    to={`/${name}`}
                    primaryText={resources[name].options && resources[name].options.label || name}
                    leftIcon={createElement(resources[name].icon)}
                />
            ))}
            <Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />} />
        </Menu>
    );
};
```

## Adding A Menu To A Filtered List

As the filter values are taken from the URL, you can link to a pre-filtered list by setting the `filter` query parameter.

For instance, to include a menu to a list of published posts:

{% raw %}
```jsx
<Menu.Item
    to={{
        pathname: '/posts',
        search: `filter=${JSON.stringify({ is_published: true })}`,
    }}
    primaryText="Posts"
    leftIcon={<BookIcon />}
/>
```
{% endraw %}

## Resetting Filters On Menu Click

By default, a click on `<Menu.Item >` for a list page opens the list with the same filters as they were applied the last time the user saw them. This is usually the expected behavior, but your users may prefer that clicking on a menu item resets the list filters.

Just use an empty `filter` query parameter to force empty filters:

```jsx
<Menu.Item
    to="/posts?filter=%7B%7D" // %7B%7D is JSON.stringify({})
    primaryText="Posts"
    leftIcon={<BookIcon />}
/>
```
