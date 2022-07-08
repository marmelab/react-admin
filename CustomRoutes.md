---
layout: default
title: "The CustomRoutes Component"
---

# `<CustomRoutes>`

To register your own routes, pass one or several `<CustomRoutes>` elements as children of `<Admin>`. Declare as many [react-router-dom](https://reactrouter.com/docs/en/v6/api#routes-and-route) `<Route>` as you want inside them:

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";
import posts from './posts';
import comments from './comments';
import Settings from './Settings';
import Profile from './Profile';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api')}>
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

**Tip**: To look like other react-admin pages, your custom pages should have the following structure:

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

**Tip**: It's up to you to create a [custom menu](./Theming.md#using-a-custom-menu) entry, or custom buttons, that lead to your custom pages.

If you want a custom route to render without the layout (without the menu and the appBar), e.g. for registration screens, then provide the `noLayout` prop on the `<CustomRoutes>` element:

```jsx
// in src/App.js
import * as React from "react";
import { Admin, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";
import Settings from './Settings';
import Register from './register';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api')}>
        <CustomRoutes noLayout>
            <Route path="/register" element={<Register />} />
        </CustomRoutes>
        <CustomRoutes noLayout>
            <Route path="/settings" element={<Settings />} />
        </CustomRoutes>
    </Admin>
);

export default App;
```

When a user browses to `/register`, the `<Register>` component will appear outside the defined Layout, leaving you the freedom to design the screen the way you want.

**Tip**: Custom routes can be [a `<Navigate>` route](https://reactrouter.com/docs/en/v6/api#navigate), too.

