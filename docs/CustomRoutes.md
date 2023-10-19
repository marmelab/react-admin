---
layout: default
title: "The CustomRoutes Component"
---

# `<CustomRoutes>`

Lets you define custom pages in your react-admin application, using [react-router-dom](https://reactrouter.com/en/6/start/concepts#defining-routes) `<Routes>` elements.

## Usage

To register your own routes, pass one or several `<CustomRoutes>` elements as children of `<Admin>`. Declare as many [react-router-dom](https://reactrouter.com/en/6/start/concepts#defining-routes) `<Route>` as you want inside them.
Alternatively, you can add your custom routes to resources. They will be available under the resource prefix.

```jsx
// in src/App.js
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";

import dataProvider from './dataProvider';
import posts from './posts';
import comments from './comments';
import Settings from './Settings';
import Profile from './Profile';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" {...posts} />
        <Resource name="comments" {...comments} />
        <CustomRoutes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </CustomRoutes>
    </Admin>
);

export default App;
```

Now, when a user browses to `/settings` or `/profile`, the components you defined will appear in the main part of the screen.

## `children`

`children` of the `<CustomRoutes>` component must be `<Route>` elements from [react-router-dom](https://reactrouter.com/en/6/start/concepts#defining-routes), and map a path with a custom element.

```jsx
// in src/App.js
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";

import dataProvider from './dataProvider';
import Settings from './Settings';
import Profile from './Profile';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <CustomRoutes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </CustomRoutes>
    </Admin>
);

export default App;
```

## `noLayout`

By default, custom routes render within the application layout (with the menu and the app bar). If you want a custom route to render without the layout, e.g. for registration screens, then provide the `noLayout` prop on the `<CustomRoutes>` element:

```jsx
// in src/App.js
import { Admin, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";

import dataProvider from './dataProvider';
import Register from './Register';
import Settings from './Settings';
import Profile from './Profile';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <CustomRoutes noLayout>
            <Route path="/register" element={<Register />} />
        </CustomRoutes>
        <CustomRoutes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </CustomRoutes>
    </Admin>
);
```

As illustrated above, there can be more than one `<CustomRoutes>` element inside an `<Admin>` component.

## Custom Page Title

To define the page title (displayed in the app bar), your custom pages can use [the `<Title>` component](./Title.md) from react-admin:

```jsx
// in src/Settings.js
import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Title } from 'react-admin';

const Settings = () => (
    <Card>
        <Title title="My Page" />
        <CardContent>
            ...
        </CardContent>
    </Card>
);

export default Settings;
```

`<Title>` uses a [React Portal](https://react.dev/reference/react-dom/createPortal), so it doesn't matter *where* you put it in your component. The title will always be rendered in the app bar.

## Linking To Custom Routes

You can link to your pages using [react-router's Link component](https://reactrouter.com/en/main/components/link):

```jsx
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

const SettingsButton = () => (
    <Link component={RouterLink} to="/settings">
        Settings
    </Link>
);
```

Alternately, create a [custom menu](./Menu.md) with entries for the custom pages.

```jsx
// in src/MyMenu.js
import { Menu } from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.ResourceItem name="posts"  />
        <Menu.ResourceItem name="comments" />
        <Menu.Item to="/settings" primaryText="Users" leftIcon={<SettingsIcon />}/>
        <Menu.Item to="/profile" primaryText="Miscellaneous" leftIcon={<PeopleIcon />}/>
    </Menu>
);
```

## Sub-Routes

If you want to add sub-routes to a resource, add the `<Route>` elements as [children of the `<Resource>` element](./Resource.md#children):

```jsx
import { Admin, Resource } from 'react-admin';
import { Route } from "react-router-dom";

import dataProvider from './dataProvider';
import posts from './posts';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" {...posts}>
            <Route path="analytics" element={<PostAnalytics/>} />
        </Resource>
    </Admin>
);

// is equivalent to
const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" {...posts} />
        <CustomRoutes>
            <Route path="/posts/analytics" element={<PostAnalytics />} />
        </CustomRoutes>
    </Admin>
);
```

This is usually useful for nested resources, such as books on authors:

{% raw %}
```jsx
// in src/App.jss
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { Route } from "react-router-dom";

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="authors" list={ListGuesser} edit={EditGuesser}>
            <Route path=":authorId/books" element={<BookList />} />
        </Resource>
    </Admin>
);

// in src/BookList.jss
import { useParams } from 'react-router-dom';
import { List, Datagrid, TextField } from 'react-admin';

const BookList = () => {
    const { authorId } = useParams();
    return (
        <List resource="books" filter={{ authorId }}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="year" />
            </Datagrid>
        </List>
    );
};
```
{% endraw %}

**Tip**: In the above example, the `resource="books"` prop is required in `<List>` because the `ResourceContext` defaults to `authors` inside the `<Resource name="authors">`.

Check [the `<Resource>` element documentation](./Resource.md#children) for more information.