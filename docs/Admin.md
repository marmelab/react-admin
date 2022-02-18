---
layout: default
title: "Admin and Resource Components"
---

# The `<Admin>` Component

The `<Admin>` component creates an application with its own state, routing, and controller logic. `<Admin>` requires only a `dataProvider` prop, and at least one child `<Resource>` to work:

```jsx
// in src/App.js
import * as React from "react";

import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

Here are all the props accepted by the component:

- [`dataProvider`](#dataprovider)
- [`authProvider`](#authprovider)
- [`i18nProvider`](#i18nprovider)
- [`title`](#title)
- [`dashboard`](#dashboard)
- [`disableTelemetry`](#disabletelemetry)
- [`catchAll`](#catchall)
- [`menu`](#menu)
- [`theme`](#theme)
- [`layout`](#layout)
- [`loginPage`](#loginpage)
- [`history`](#history)
- [`basename`](#basename)
- [`ready`](#ready)
- [`store`](#store)

## `dataProvider`

The only required prop, it must be an object with the following methods returning a promise:

```jsx
const dataProvider = {
    getList:    (resource, params) => Promise,
    getOne:     (resource, params) => Promise,
    getMany:    (resource, params) => Promise,
    getManyReference: (resource, params) => Promise,
    create:     (resource, params) => Promise,
    update:     (resource, params) => Promise,
    updateMany: (resource, params) => Promise,
    delete:     (resource, params) => Promise,
    deleteMany: (resource, params) => Promise,
}
```

Check [the Data Provider documentation](./DataProviderIntroduction.md) for more details.

The `dataProvider` is also the ideal place to add custom HTTP headers, authentication, etc. The [Data Providers Backends ](./DataProviderList.md) chapters lists available data providers, and you can learn how to build your own in the [Writing a Data Provider](./DataProviderWriting.md) chapter.

## `authProvider`

The `authProvider` prop expect an object with 6 methods, each returning a Promise, to control the authentication strategy:

```jsx
const authProvider = {
    login: params => Promise.resolve(),
    logout: params => Promise.resolve(),
    checkAuth: params => Promise.resolve(),
    checkError: error => Promise.resolve(),
    getIdentity: params => Promise.resolve(),
    getPermissions: params => Promise.resolve(),
};

const App = () => (
    <Admin authProvider={authProvider} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        ...
    </Admin>
);
```

The [Auth Provider documentation](./Authentication.md) explains how to implement these functions in detail.

## `i18nProvider`

The `i18nProvider` props let you translate the GUI. The [Translation Documentation](./Translation.md) details this process.

## `title`

On error pages, the header of an admin app uses 'React Admin' as the main app title. Use the `title` to customize it.

```jsx
const App = () => (
    <Admin title="My Custom Admin" dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## `dashboard`

By default, the homepage of an admin app is the `list` of the first child `<Resource>`. But you can also specify a custom component instead. To fit in the general design, use MUI 's `<Card>` component, and react-admin's `<Title>` component to set the title in the AppBar:

```jsx
// in src/Dashboard.js
import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Title } from 'react-admin';
export default () => (
    <Card>
        <Title title="Welcome to the administration" />
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
    </Card>
);
```

```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import Dashboard from './Dashboard';

const App = () => (
    <Admin dashboard={Dashboard} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Custom home page](./img/dashboard.png)

## `disableTelemetry`

In production, react-admin applications send an anonymous request on mount to a telemetry server operated by marmelab. You can see this request by looking at the Network tab of your browser DevTools:

`https://react-admin-telemetry.marmelab.com/react-admin-telemetry`

The only data sent to the telemetry server is the admin domain (e.g. "example.com") - no personal data is ever sent, and no cookie is included in the response. The react-admin team uses these domains to track the usage of the framework.

You can opt out of telemetry by simply adding `disableTelemetry` to the `<Admin>` component:

```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';

const App = () => (
    <Admin disableTelemetry>
        // ...
    </Admin>
);
```

## `catchAll`

When users type URLs that don't match any of the children `<Resource>` components, they see a default "Not Found" page.

![Not Found](./img/not-found.png)

You can customize this page to use the component of your choice by passing it as the `catchAll` prop. To fit in the general design, use MUI 's `<Card>` component, and react-admin's `<Title>` component:

```jsx
// in src/NotFound.js
import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Title } from 'react-admin';

export default () => (
    <Card>
        <Title title="Not Found" />
        <CardContent>
            <h1>404: Page not found</h1>
        </CardContent>
    </Card>
);
```

```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import NotFound from './NotFound';

const App = () => (
    <Admin catchAll={NotFound} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

**Tip**: If your custom `catchAll` component contains react-router `<Route>` components, this allows you to register new routes displayed within the react-admin layout easily. Note that these routes will match *after* all the react-admin resource routes have been tested. To add custom routes *before* the react-admin ones, and therefore override the default resource routes, see the [`custom pages`](#adding-custom-pages) section instead.

## `menu`

**Tip**: This prop is deprecated. To override the menu component, use a [custom layout](#layout) instead.

React-admin uses the list of `<Resource>` components passed as children of `<Admin>` to build a menu to each resource with a `<List>` component.

If you want to add or remove menu items, for instance to link to non-resources pages, you can create your own menu component:

```jsx
// in src/Menu.js
import * as React from 'react';
import { createElement } from 'react';
import { useMediaQuery } from '@mui/material';
import { MenuItemLink, useResourceDefinitions, useSidebarState } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

const Menu = ({ onMenuClick }) => {
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const [open] = useSidebarState();
    const resources = useResourceDefinitions();
    
    return (
        <div>
            {Object.keys(resources).map(name => (
                <MenuItemLink
                    key={name}
                    to={`/${name}`}
                    primaryText={resources[name].options && resources[name].options.label || name}
                    leftIcon={createElement(resources[name].icon)}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                />
            ))}
            <MenuItemLink
                to="/custom-route"
                primaryText="Miscellaneous"
                leftIcon={<LabelIcon />}
                onClick={onMenuClick}
                sidebarIsOpen={open}
            />
        </div>
    );
}

export default Menu;
```

**Tip**: Note the `MenuItemLink` component. It must be used to avoid unwanted side effects in mobile views. It supports a custom text and icon (which must be a MUI `<SvgIcon>`).

Then, pass it to the `<Admin>` component as the `menu` prop:

```jsx
// in src/App.js
import Menu from './Menu';

const App = () => (
    <Admin menu={Menu} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

See the [Theming documentation](./Theming.md#using-a-custom-menu) for more details.

## `theme`

MUI  supports [theming](https://mui.com/customization/themes). This lets you customize the look and feel of an admin by overriding fonts, colors, and spacing. You can provide a custom MUI theme by using the `theme` prop:

```jsx
const theme = {
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
    },
};

const App = () => (
    <Admin theme={theme} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Dark theme](./img/dark-theme.png)

For more details on predefined themes and custom themes, refer to the [MUI Customization documentation](https://mui.com/customization/themes/).

## `layout`

If you want to deeply customize the app header, the menu, or the notifications, the best way is to provide a custom layout component. It must contain a `{children}` placeholder, where react-admin will render the resources. 

Use the [default layout](https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/layout/Layout.tsx) as a starting point, and check [the Theming documentation](./Theming.md#using-a-custom-layout) for examples.

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

Your custom layout can simply extend the default `<Layout>` component if you only want to override the appBar, the menu, the notification component, or the error page. For instance:

```jsx
// in src/MyLayout.js
import { Layout } from 'react-admin';
import MyAppBar from './MyAppBar';
import MyMenu from './MyMenu';
import MyNotification from './MyNotification';

const MyLayout = (props) => <Layout
    {...props}
    appBar={MyAppBar}
    menu={MyMenu}
    notification={MyNotification}
/>;

export default MyLayout;
```

For more details on custom layouts, check [the Theming documentation](./Theming.md#using-a-custom-layout).

## `loginPage`

If you want to customize the Login page, or switch to another authentication strategy than a username/password form, pass a component of your own as the `loginPage` prop. React-admin will display this component whenever the `/login` route is called.

```jsx
import MyLoginPage from './MyLoginPage';

const App = () => (
    <Admin loginPage={MyLoginPage}>
        ...
    </Admin>
);
```

You can also disable it completely along with the `/login` route by passing `false` to this prop.

See The [Authentication documentation](./Authentication.md#customizing-the-login-component) for more details.

**Tip**: Before considering writing your own login page component, please take a look at how to change the default [background image](./Theming.md#using-a-custom-login-page) or the [MUI  theme](#theme). See the [Authentication documentation](./Authentication.md#customizing-the-login-component) for more details.

## `history`

**Note**: This prop is deprecated. Check [the Routing chapter](./Routing.md) to see how to use a different router.

By default, react-admin creates URLs using a hash sign (e.g. "myadmin.acme.com/#/posts/123"). The hash portion of the URL (i.e. `#/posts/123` in the example) contains the main application route. This strategy has the benefit of working without a server, and with legacy web browsers. But you may want to use another routing strategy, e.g. to allow server-side rendering.

You can create your own `history` function (compatible with [the `history` npm package](https://github.com/reacttraining/history)), and pass it to the `<Admin>` component to override the default history strategy. For instance, to use `browserHistory`:

```jsx
import * as React from "react";
import { createBrowserHistory as createHistory } from 'history';

const history = createHistory();

const App = () => (
    <Admin history={history}>
        ...
    </Admin>
);
```

## `basename`

Use this prop to make all routes and links in your Admin relative to a "base" portion of the URL pathname that they all share. This is only needed when using the [`BrowserHistory`](https://github.com/remix-run/history/blob/main/docs/api-reference.md#createbrowserhistory) to serve the application under a sub-path of your domain (for example https://marmelab.com/ra-enterprise-demo), or when embedding react-admin inside a single-page app with its own routing. See https://reactrouter.com/docs/en/v6/api#router for more information.

```jsx
import { Admin } from 'react-admin';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const App = () => (
    <Admin basename="admin" history={history}>
        ...
    </Admin>
);
```

## `ready`

When you run an `<Admin>` with no child `<Resource>`, react-admin displays a "ready" screen:

![Empty Admin](./img/tutorial_empty.png)

You can replace that "ready" screen by passing a custom component as the `ready` prop:

```jsx
import * as React from 'react';
import { Admin } from 'react-admin';

const Ready = () => (
    <div>
        <h1>Admin ready</h1>
        <p>You can now add resources</p>
    </div>
)

const App = () => (
    <Admin ready={Ready}>
        ...
    </Admin>
);
```

## `store`

The `<Admin>` component initializes a [Store](./Store.md) using `localStorage` as the storage engine. You can override this by passing a custom `store` prop:

```jsx
import { Admin, Resource, memoryStore } from 'react-admin';

const App = () => (
    <Admin dataProvider={dataProvider} store={memoryStore()}>
        <Resource name="posts" />
    </Admin>
);
```

## Declaring resources at runtime

You might want to dynamically define the resources when the app starts. To do so, you have two options: using a function as `<Admin>` child, or unplugging it to use a combination of `AdminContext` and `<AdminUI>` instead.

### Using a Function As `<Admin>` Child

The `<Admin>` component accepts a function as one of its children and this function can return a Promise. If you also defined an `authProvider`, the child function will receive the result of a call to `authProvider.getPermissions()` (you can read more about this in the [Auth Provider](./Authentication.md#authorization) chapter).

For instance, getting the resource from an API might look like:

```jsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import { PostList } from './posts';
import { CommentList } from './comments';

const knownResources = [
    <Resource name="posts" list={PostList} />,
    <Resource name="comments" list={CommentList} />,
];

const fetchResources = permissions =>
    fetch('https://myapi/resources', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(permissions),
    })
    .then(response => response.json())
    .then(json => knownResources.filter(resource => json.resources.includes(resource.props.name)));

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api')}>
        {fetchResources}
    </Admin>
);
```

### Unplugging the `<Admin>` using `<AdminContext>` and `<AdminUI>`

Setting Resources dynamically using the children-as-function syntax may not be enough in all cases, because this function can't execute hooks.

So it's impossible, for instance, to have a dynamic list of resources based on a call to the `dataProvider` (since the `dataProvider` is only defined after the `<Admin>` component renders).

To overcome this limitation, you can build your own `<Admin>` component using two lower-level components: `<AdminContext>` (responsible for putting the providers in contexts) and `<AdminUI>` (responsible for displaying the UI). Here is an example:

``` jsx
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AdminContext, AdminUI, Resource, ListGuesser, useDataProvider } from 'react-admin';

function App() {
    return (
        <AdminContext dataProvider={myDataProvider}>
            <AsyncResources />
        </AdminContext>
    );
}

function AsyncResources() {
    const [resources, setResources] = useState([]);
    const dataProvider = useDataProvider();

    useEffect(() => {
        // Note that the `getResources` is not provided by react-admin. You have to implement your own custom verb.
        dataProvider.getResources().then(r => setResources(r));
    }, []);

    return (
        <AdminUI>
            {resources.map(resource => (
                <Resource name={resource.name} key={resource.key} list={ListGuesser} />
            ))}
        </AdminUI>
    );
}
```

## Adding Custom Pages

To register your own routes, pass one or several `<CustomRoutes>` elements as children of `<Admin>`. Declare as many [react-router-dom](https://reactrouter.com/docs/en/v6/api#routes-and-route) `<Route>` as you want inside them:

```jsx
// in src/App.js
import * as React from "react";
import { Admin, CustomRoutes } from 'react-admin';
import Foo from './foo';
import Bar from './bar';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api')}>
        <CustomRoutes>
            <Route path="/foo" element={<Foo />} />
            <Route path="/bar" element={<Bar />} />
        </CustomRoutes>
    </Admin>
);

export default App;
```

Now, when a user browses to `/foo` or `/bar`, the components you defined will appear in the main part of the screen.

**Tip**: To look like other react-admin pages, your custom pages should have the following structure:

```jsx
// in src/Foo.js
import * as React from "react";
import { Card, CardContent } from '@mui/material';
import { Title } from 'react-admin';

const Foo = () => (
    <Card>
        <Title title="My Page" />
        <CardContent>
            ...
        </CardContent>
    </Card>
);

export default Foo;
```

**Tip**: It's up to you to create a [custom menu](#menu) entry, or custom buttons, that lead to your custom pages.

If you want a custom route to render without the layout (without the menu and the appBar), e.g. for registration screens, then provide the `noLayout` prop on the `<CustomRoutes>` element:

```jsx
// in src/App.js
import * as React from "react";
import { Admin, CustomRoutes } from 'react-admin';
import Foo from './foo';
import Register from './register';

const App = () => (
    <Admin dataProvider={simpleRestProvider('http://path.to.my.api')}>
        <CustomRoutes noLayout>
            <RouteWithoutLayout path="/register" element={<Register />} />
        </CustomRoutes>
        <CustomRoutes noLayout>
            <Route path="/foo" element={<Foo />} />
        </CustomRoutes>
    </Admin>
);

export default App;
```

When a user browses to `/register`, the `<Register>` component will appear outside the defined Layout, leaving you the freedom to design the screen the way you want.

**Tip**: Custom routes can be [a `<Redirect>` route](https://reacttraining.com/react-router/web/api/Redirect), too.

