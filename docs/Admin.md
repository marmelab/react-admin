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
- [`customReducers`](#customreducers)
- [`customSagas`](#customsagas)
- [`customRoutes`](#customroutes)
- [`loginPage`](#loginpage)
- [`logoutButton`](#logoutbutton)
- [`initialState`](#initialstate)
- [`history`](#history)
- [`ready`](#ready)

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

The `dataProvider` is also the ideal place to add custom HTTP headers, authentication, etc. The [Data Providers Chapter](./DataProviders.md) of the documentation lists available data providers, and explains how to build your own.

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

By default, the homepage of an admin app is the `list` of the first child `<Resource>`. But you can also specify a custom component instead. To fit in the general design, use Material UI's `<Card>` component, and react-admin's `<Title>` component to set the title in the AppBar:

```jsx
// in src/Dashboard.js
import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

You can customize this page to use the component of your choice by passing it as the `catchAll` prop. To fit in the general design, use Material UI's `<Card>` component, and react-admin's `<Title>` component:

```jsx
// in src/NotFound.js
import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

**Tip**: If your custom `catchAll` component contains react-router `<Route>` components, this allows you to register new routes displayed within the react-admin layout easily. Note that these routes will match *after* all the react-admin resource routes have been tested. To add custom routes *before* the react-admin ones, and therefore override the default resource routes, use the [`customRoutes` prop](#customroutes) instead.

## `menu`

**Tip**: This prop is deprecated. To override the menu component, use a [custom layout](#layout) instead.

React-admin uses the list of `<Resource>` components passed as children of `<Admin>` to build a menu to each resource with a `<List>` component.

If you want to add or remove menu items, for instance to link to non-resources pages, you can create your own menu component:

```jsx
// in src/Menu.js
import * as React from 'react';
import { createElement } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources } from 'react-admin';
import { withRouter } from 'react-router-dom';
import LabelIcon from '@material-ui/icons/Label';

const Menu = ({ onMenuClick, logout }) => {
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    const resources = useSelector(getResources);
    return (
        <div>
            {resources.map(resource => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={resource.options && resource.options.label || resource.name}
                    leftIcon={createElement(resource.icon)}
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
            {isXSmall && logout}
        </div>
    );
}

export default withRouter(Menu);
```

**Tip**: Note the `MenuItemLink` component. It must be used to avoid unwanted side effects in mobile views. It supports a custom text and icon (which must be a material-ui `<SvgIcon>`).

**Tip**: Note that we include the `logout` item only on small devices. Indeed, the `logout` button is already displayed in the AppBar on larger devices.

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

Material UI supports [theming](https://v4.mui.com/customization/themes). This lets you customize the look and feel of an admin by overriding fonts, colors, and spacing. You can provide a custom material ui theme by using the `theme` prop:

```jsx
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

const App = () => (
    <Admin theme={theme} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Dark theme](./img/dark-theme.png)

For more details on predefined themes and custom themes, refer to the [Material UI Customization documentation](https://v4.mui.com/customization/themes/).

## `layout`

If you want to deeply customize the app header, the menu, or the notifications, the best way is to provide a custom layout component. It must contain a `{children}` placeholder, where react-admin will render the resources. If you use material UI fields and inputs, it should contain a `<ThemeProvider>` element. And finally, if you want to show the spinner in the app header when the app fetches data in the background, the Layout should connect to the redux store.

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

## `customReducers`

The `<Admin>` app uses [Redux](https://redux.js.org/) to manage state. The state has the following keys:

```json
{
    "admin": { /*...*/ }, // used by react-admin
    "routing": { /*...*/ }, // used by connected-react-router
}
```

If your components dispatch custom actions, you probably need to register your own reducers to update the state with these actions. Let's imagine that you want to keep the bitcoin exchange rate inside the `bitcoinRate` key in the state. You probably have a reducer looking like the following:

```jsx
// in src/bitcoinRateReducer.js
export default (previousState = 0, { type, payload }) => {
    if (type === 'BITCOIN_RATE_RECEIVED') {
        return payload.rate;
    }
    return previousState;
}
```

To register this reducer in the `<Admin>` app, simply pass it in the `customReducers` prop:

{% raw %}
```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';

import bitcoinRateReducer from './bitcoinRateReducer';

const App = () => (
    <Admin customReducers={{ bitcoinRate: bitcoinRateReducer }} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        ...
    </Admin>
);

export default App;
```
{% endraw %}

Now the state will look like:

```json
{
    "admin": { /*...*/ }, // used by react-admin
    "routing": { /*...*/ }, // used by connected-react-router
    "bitcoinRate": 123, // managed by rateReducer
}
```

## `customSagas`

The `<Admin>` app uses [redux-saga](https://github.com/redux-saga/redux-saga) to handle side effects (AJAX calls, notifications, redirections, etc.).

If your components dispatch custom actions, you probably need to register your own side effects as sagas. Let's imagine that you want to show a notification whenever the `BITCOIN_RATE_RECEIVED` action is dispatched. You probably have a saga looking like the following:

```jsx
// in src/bitcoinSaga.js
import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'react-admin';

export default function* bitcoinSaga() {
    yield takeEvery('BITCOIN_RATE_RECEIVED', function* () {
        yield put(showNotification('Bitcoin rate updated'));
    })
}
```

To register this saga in the `<Admin>` app, simply pass it in the `customSagas` prop:

```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';

import bitcoinSaga from './bitcoinSaga';

const App = () => (
    <Admin customSagas={[ bitcoinSaga ]} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        ...
    </Admin>
);

export default App;
```

## `customRoutes`

To register your own routes, create a module returning a list of [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) `<Route>` component:

```jsx
// in src/customRoutes.js
import * as React from "react";
import { Route } from 'react-router-dom';
import Foo from './Foo';
import Bar from './Bar';

export default [
    <Route exact path="/foo" component={Foo} />,
    <Route exact path="/bar" component={Bar} />,
];
```

Then, pass this array as `customRoutes` prop in the `<Admin>` component:

```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';

import customRoutes from './customRoutes';

const App = () => (
    <Admin customRoutes={customRoutes} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        ...
    </Admin>
);

export default App;
```

Now, when a user browses to `/foo` or `/bar`, the components you defined will appear in the main part of the screen.

**Tip**: To look like other react-admin pages, your custom pages should have the following structure:

```jsx
// in src/Foo.js
import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

**Tip**: It's up to you to create a [custom menu](#menu) entry, or custom buttons, to lead to your custom pages.

Your custom pages take precedence over react-admin's own routes. That means that `customRoutes` lets you override any route you want! If you want to add routes *after* all the react-admin routes, use the [`catchAll` prop](#catchall) instead.

If you want a custom route to render without the layout (without the menu and the appBar), e.g. for registration screens, then use the `<RouteWithoutLayout>` component from `react-admin` instead of `react-router-dom`'s `<Route>`:

```jsx
// in src/customRoutes.js
import * as React from "react";
import { Route } from 'react-router-dom';
import { RouteWithoutLayout } from 'react-admin';
import Foo from './Foo';
import Register from './Register';

export default [
    <Route exact path="/foo" component={Foo} />,
    <RouteWithoutLayout exact path="/register" component={Register} />,
];
```

When a user browses to `/register`, the `<Register>` component will appear outside of the defined Layout, leaving you the freedom to design the screen the way you want.

**Tip**: In previous versions of react-admin, you had to write `<Route noLayout>` instead of `<RouteWithoutLayout>`. The former still works in Js projects but TypeScript won't compile it.

**Tip**: Custom routes can be [a `<Redirect>` route](https://reacttraining.com/react-router/web/api/Redirect), too.

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

See The [Authentication documentation](./Authentication.md#customizing-the-login-and-logout-components) for more details.

**Tip**: Before considering writing your own login page component, please take a look at how to change the default [background image](./Theming.md#using-a-custom-login-page) or the [Material UI theme](#theme). See the [Authentication documentation](./Authentication.md#customizing-the-login-and-logout-components) for more details.

## `logoutButton`

If you customize the `loginPage`, you probably need to override the `logoutButton`, too - because they share the authentication strategy.

```jsx
import MyLoginPage from './MyLoginPage';
import MyLogoutButton from './MyLogoutButton';

const App = () => (
    <Admin loginPage={MyLoginPage} logoutButton={MyLogoutButton}>
        ...
    </Admin>
);
```

## `initialState`

The `initialState` prop lets you pass preloaded state to Redux. See the [Redux Documentation](https://redux.js.org/docs/api/createStore.html#createstorereducer-preloadedstate-enhancer) for more details.

It accepts either a function or an object:

```jsx
const initialState = {
    theme: 'dark',
    grid: 5,
};

const App = () => (
    <Admin initialState={initialState} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

```jsx
const initialState = () => ({
    theme: localStorage.getItem('theme'),
    grid: localStorage.getItem('grid'),
});

const App = () => (
    <Admin initialState={initialState} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## `history`

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

**Caution**: Do not use the 5.x version of the `history` package. It's currently incompatible with another dependency of react-admin, `connected-react-router`. `history@4.10.1` works fine. 

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

## Declaring resources at runtime

You might want to dynamically define the resources when the app starts. To do so, you have two options: using a function as `<Admin>` child, or unplugging it to use a combination of `AdminContext` and `<AdminUI>` instead.

### Using a Function As `<Admin>` Child

The `<Admin>` component accepts a function as its child and this function can return a Promise. If you also defined an `authProvider`, the child function will receive the result of a call to `authProvider.getPermissions()` (you can read more about this in the [Auth Provider](./Authentication.md#authorization) chapter).

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

## Using react-admin without `<Admin>` and `<Resource>`

Using `<Admin>` and `<Resource>` is completely optional. If you feel like bootstrapping a redux app yourself, it's totally possible. Head to [Including in another app](./CustomApp.md) for a detailed how-to.
