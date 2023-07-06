---
layout: default
title: "The Menu Component"
---

# `<Menu>`

This component renders a menu, with one menu item per resource by default. You can also set menu items by hand.

![standard menu](./img/menu.webp)

## Usage

You can create a custom menu component using react-admin's `<Menu>`, `<Menu.ResourceItem>`, and `<Menu.Item>` components:

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.ResourceItem name="posts" />
        <Menu.ResourceItem name="comments" />
        <Menu.ResourceItem name="users" />
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

Additional props are passed down to the root component (the Material UI [`<MenuList>`](https://mui.com/material-ui/api/menu-list/) component)

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

If you pass children to `<Menu>`, they will override the default menu items. Use `<Menu.DashboardItem>` to add a menu item for the dashboard, `<Menu.ResourceItem>` to add menu items for a resource list, and `<Menu.Item>` to add custom menu items.

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.ResourceItem name="posts" />
        <Menu.ResourceItem name="comments" />
        <Menu.ResourceItem name="users" />
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
        marginTop: 0,
        '&.RaMenu-closed': {
            opacity: 0.8,
        },
    }} />
);
```
{% endraw %}

This property accepts the following subclasses:

| Rule name         | Description                          |
|-------------------|------------------------------------- |
| `&.RaMenu-open`   | Applied the menu when it's open      |
| `&.RaMenu-closed` | Applied to the menu when it's closed |

To override the style of `<Menu>` using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaMenu` key.

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

Additional props are passed down to [the underling Material UI `<MenuItem>` component](https://mui.com/material-ui/api/menu-item/).

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

## `<Menu.ResourceItem>`

The `<Menu.ResourceItem>` component displays a menu item for the list page of a resource, based on the resource name.

```jsx
import { Menu } from 'react-admin';

export const MyMenu = () => (
    <Menu>
        <Menu.ResourceItem name="posts" />
        <Menu.ResourceItem name="comments" />
        <Menu.ResourceItem name="tags" />
        <Menu.ResourceItem name="users" />
    </Menu>
);
```

`<Menu.ResourceItem>` renders a menu item for a resource based on its name, using the resource label and icon defined in the corresponding `<Resource>` component.

So the following code:

```jsx
<Menu.ResourceItem name="posts" />
```

uses the following resource definition:

```jsx
<Resource name="posts" list={PostList} icon={BookIcon} />
```

and translates to:

```jsx
<Menu.Item to="/posts" primaryText="Posts" leftIcon={<BookIcon />}/>
```

## Creating Menu Items For Resources

If you want to reorder the default menu, create a new Menu and use `<Menu.ResourceItem>` components as children.

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';

export const MyMenu = () => (
    <Menu>
        <Menu.ResourceItem name="posts" />
        <Menu.ResourceItem name="comments" />
        <Menu.ResourceItem name="tags" />
        <Menu.ResourceItem name="users" />
    </Menu>
);
```

Passing `children` to `<Menu>` actually *replaces* the default menu items. If you want to render a custom menu item **in addition to** the default resource menu items, use the `useResourceDefinitions` hook to retrieve the list of resources, and the `<Menu.ResourceItem>` component to create one menu item per resource.

```jsx
// in src/MyMenu.js
import { Menu, useResourceDefinitions } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => {
    const resources = useResourceDefinitions();
    return (
        <Menu>
            {Object.keys(resources).map(name => (
                <Menu.ResourceItem key={name} name={name} />
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

## Nested Menu Items

If you need to display a menu item with a submenu, you should use [the `<MultiLevelMenu>` component](./MultiLevelMenu.md) instead of `<Menu>`.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-multilevelmenu-item.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-multilevelmenu-item.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Live Updates

You can display a badge on the menu item to indicate that new data is available. Use [the `<MenuLive>` component](./MenuLive.md) instead of `<Menu>` to enable this feature.

```tsx
import { Admin, Layout, LayoutProps, Resource } from 'react-admin';
import { MenuLive } from '@react-admin/ra-realtime';
import { PostList, PostShow, PostEdit, realTimeDataProvider } from '.';

const CustomLayout = (props: LayoutProps) => (
    <Layout {...props} menu={MenuLive} />
);

const MyReactAdmin = () => (
    <Admin dataProvider={realTimeDataProvider} layout={CustomLayout}>
        <Resource name="posts" list={PostList} show={PostShow} edit={PostEdit} />
    </Admin>
);
```

![MenuLive](./img/MenuLive.png)
