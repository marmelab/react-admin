---
layout: default
title: "Admin and Resource Components"
---

# The `<Admin>` Component

The `<Admin>` component creates an application with its own state, routing, and controller logic. `<Admin>` requires only a `restClient` and at least one child `<Resource>` to work:

```jsx
// in src/App.js
import React from 'react';

import { simpleRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={simpleRestClient('http://path.to.my.api')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

Here are all the props accepted by the component:

* [`restClient`](#restclient)
* [`title`](#title)
* [`dashboard`](#dashboard)
* [`catchAll`](#catchall)
* [`menu`](#menu)
* [`theme`](#theme)
* [`appLayout`](#applayout)
* [`customReducers`](#customreducers)
* [`customSagas`](#customsagas)
* [`customRoutes`](#customroutes)
* [`authClient`](#authclient)
* [`loginPage`](#loginpage)
* [`logoutButton`](#logoutbutton)
* [`locale`](#internationalization)
* [`messages`](#internationalization)
* [`initialState`](#initialstate)
* [`history`](#history)

## `restClient`

The only required prop, it must be a function returning a promise, with the following signature:

```jsx
/**
 * Execute the REST request and return a promise for a REST response
 *
 * @example
 * restClient(GET_ONE, 'posts', { id: 123 })
 *  => new Promise(resolve => resolve({ id: 123, title: "hello, world" }))
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the action type
 * @returns {Promise} the Promise for a REST response
 */
const restClient = (type, resource, params) => new Promise();
```

The `restClient` is also the ideal place to add custom HTTP headers, authentication, etc. The [Rest Clients Chapter](./RestClients.md) of the documentation lists available REST clients, and how to build your own.

## `title`

By default, the header of an admin app uses 'Admin on REST' as the main app title. It's probably the first thing you'll want to customize. The `title` prop serves exactly that purpose.

```jsx
const App = () => (
    <Admin title="My Custom Admin" restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## `dashboard`

By default, the homepage of an an admin app is the `list` of the first child `<Resource>`. But you can also specify a custom component instead. To fit in the general design, use Material UI's `<Card>` component, and admin-on-rest's `<ViewTitle>` component:

```jsx
// in src/Dashboard.js
import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import { ViewTitle } from 'admin-on-rest/lib/mui';

export default () => (
    <Card>
        <ViewTitle title="Dashboard" />
        <CardText>Lorem ipsum sic dolor amet...</CardText>
    </Card>
);
```

```jsx
// in src/App.js
import Dashboard from './Dashboard';

const App = () => (
    <Admin dashboard={Dashboard} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Custom home page](http://static.marmelab.com/admin-on-rest/dashboard.png)

## `catchAll`

When users type URLs that don't match any of the children `<Resource>` components, they see a default "Not Found" page. 

![Not Found](./img/not-found.png)

You can customize this page to use the component of your choice by passing it as the `catchAll` prop. To fit in the general design, use Material UI's `<Card>` component, and admin-on-rest's `<ViewTitle>` component:

```jsx
// in src/NotFound.js
import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import { ViewTitle } from 'admin-on-rest/lib/mui';

export default () => (
    <Card>
        <ViewTitle title="Not Found" />
        <CardText>
            <h1>404: Page not found</h1>
        </CardText>
    </Card>
);
```

```jsx
// in src/App.js
import NotFound from './NotFound';

const App = () => (
    <Admin catchAll={NotFound} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

**Tip**: If your custom `catchAll` component contains react-router `<Route>` components, this allows you to register new routes displayed within the admin-on-rest layout easily. Note that these routes will match *after* all the admin-on-rest resource routes have been tested. To add custom routes *before* the admin-on-rest ones, and therefore override the default resource routes, use the [`customRoutes` prop](#customroutes) instead.

## `menu`

Admin-on-rest uses the list of `<Resource>` components passed as children of `<Admin>` to build a menu to each resource with a `list` component.

If you want to add or remove menu items, for instance to link to non-resources pages, you can create your own menu component:

```jsx
// in src/Menu.js
import React from 'react';
import { MenuItemLink } from 'admin-on-rest';

export default ({ resources, onMenuTap, logout }) => (
    <div>
        <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuTap} />
        <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuTap} />
        <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuTap} />
        {logout}
    </div>
);
```

**Tip**: Note the `MenuItemLink` component. It must be used to avoid unwanted side effects in mobile views.

Then, pass it to the `<Admin>` component as the `menu` prop:

```jsx
// in src/App.js
import Menu from './Menu';

const App = () => (
    <Admin menu={Menu} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

**Tip**: If you use authentication, don't forget to render the `logout` prop in your custom menu component. Also, the `onMenuTap` function passed as prop is used to close the sidebar on mobile.

## `theme`

Material UI supports [theming](http://www.material-ui.com/#/customization/themes). This lets you customize the look and feel of an admin by overriding fonts, colors, and spacing. You can provide a custom material ui theme by using the `theme` prop:

```jsx
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const App = () => (
    <Admin theme={getMuiTheme(darkBaseTheme)} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Dark theme](./img/dark-theme.png)

For more details on predefined themes and custom themes, refer to the [Material UI Customization documentation](http://www.material-ui.com/#/customization/themes).

## `appLayout`

If you want to deeply customize the app header, the menu, or the notifications, the best way is to provide a custom layout component. It must contain a `{children}` placeholder, where admin-on-rest will render the resources. If you use material UI fields and inputs, it *must* contain a `<MuiThemeProvider>` element. And finally, if you want to show the spinner in the app header when the app fetches data in the background, the Layout should connect to the redux store.

Use the [default layout](https://github.com/marmelab/admin-on-rest/blob/master/src/mui/layout/Layout.js) as a starting point, and check [the Theming documentation](./Theming.md#using-a-custom-layout) for examples.

```jsx
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin appLayout={MyLayout} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## `customReducers`

The `<Admin>` app uses [Redux](http://redux.js.org/) to manage state. The state has the following keys:

```jsx
{
    admin: { /*...*/ }, // used by admin-on-rest
    form: { /*...*/ }, // used by redux-form
    routing: { /*...*/ }, // used by react-router-redux
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
import React from 'react';
import { Admin } from 'admin-on-rest';

import bitcoinRateReducer from './bitcoinRateReducer';

const App = () => (
    <Admin customReducers={{ bitcoinRate: bitcoinRateReducer }} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        ...
    </Admin>
);

export default App;
```
{% endraw %}

Now the state will look like:

```jsx
{
    admin: { /*...*/ }, // used by admin-on-rest
    form: { /*...*/ }, // used by redux-form
    routing: { /*...*/ }, // used by react-router-redux
    bitcoinRate: 123, // managed by rateReducer
}
```

## `customSagas`

The `<Admin>` app uses [redux-saga](https://github.com/redux-saga/redux-saga) to handle side effects.

If your components dispatch custom actions, you probably need to register your own side effects as sagas. Let's imagine that you want to show a notification whenever the `BITCOIN_RATE_RECEIVED` action is dispatched. You probably have a saga looking like the following:

```jsx
// in src/bitcoinSaga.js
import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'admin-on-rest';

export default function* bitcoinSaga() {
    yield takeEvery('BITCOIN_RATE_RECEIVED', function* () {
        yield put(showNotification('Bitcoin rate updated'));
    })
}
```

To register this saga in the `<Admin>` app, simply pass it in the `customSagas` prop:

```jsx
// in src/App.js
import React from 'react';
import { Admin } from 'admin-on-rest';

import bitcoinSaga from './bitcoinSaga';

const App = () => (
    <Admin customSagas={[ bitcoinSaga ]} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        ...
    </Admin>
);

export default App;
```

## `customRoutes`

To register your own routes, create a module returning a list of [react-router](https://github.com/ReactTraining/react-router) `<Route>` component:

```jsx
// in src/customRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import Foo from './Foo';
import Bar from './Bar';
import Baz from './Baz';

export default [
    <Route exact path="/foo" component={Foo} />,
    <Route exact path="/bar" component={Bar} />,
    <Route exact path="/baz" component={Baz} noLayout />,
];
```

Then, pass this array as `customRoutes` prop in the `<Admin>` component:

```jsx
// in src/App.js
import React from 'react';
import { Admin } from 'admin-on-rest';

import customRoutes from './customRoutes';

const App = () => (
    <Admin customRoutes={customRoutes} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        ...
    </Admin>
);

export default App;
```

Now, when a user browses to `/foo` or `/bar`, the components you defined will appear in the main part of the screen.
When a user browses to `/baz`, the component will appear outside of the defined Layout, leaving you the freedom
to design the screen the way you want.

**Tip**: It's up to you to create a [custom menu](#applayout) entry, or custom buttons, to lead to your custom pages.

**Tip**: Your custom pages take precedence over admin-on-rest's own routes. That means that `customRoutes` lets you override any route you want! If you want to add routes *after* all the admin-on-rest routes, use the [`catchAll` prop](#catchall) instead.

**Tip**: To look like other admin-on-rest pages, your custom pages should have the following structure:

```jsx
// in src/Foo.js
import React from 'react';
import { Card } from 'material-ui/Card';
import { ViewTitle } from 'admin-on-rest';

const Foo = () => (
    <Card>
        <ViewTitle title="My Page" />
        ...
    </Card>
));

export default Foo;
```

## `authClient`

The `authClient` prop expect a function returning a Promise, to control the application authentication strategy:

```jsx
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest';

const authClient(type, params) {
    // type can be any of AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, and AUTH_CHECK
    // ...
    return Promise.resolve();
};

const App = () => (
    <Admin authClient={authClient} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        ...
    </Admin>
);
```

The [Authentication documentation](./Authentication.md) explains how to implement these functions in detail.

## `loginPage`

If you want to customize the Login page, or switch to another authentication strategy than a username/password form, pass a component of your own as the `loginPage` prop. Admin-on-rest will display this component whenever the `/login` route is called.

```jsx
import MyLoginPage from './MyLoginPage';

const App = () => (
    <Admin loginPage={MyLoginPage}>
        ...
    </Admin>
);
```

See The [Authentication documentation](./Authentication.md#customizing-the-login-and-logout-components) for more explanations.

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
The `initialState` prop lets you pass preloaded state to Redux. See the [Redux Documentation](http://redux.js.org/docs/api/createStore.html#createstorereducer-preloadedstate-enhancer) for more details.

## `history`

By default, admin-on-rest creates URLs using a hash sign (e.g. "myadmin.acme.com/#/posts/123"). The hash portion of the URL (i.e. `#/posts/123` in the example) contains the main application route. This strategy has the benefit of working without a server, and with legacy web browsers. But you may want to use another routing strategy, e.g. to allow server-side rendering.

You can create your own `history` function (compatible with [the `history` npm package](https://github.com/reacttraining/history)), and pass it to the `<Admin>` component to override the default history strategy. For instance, to use `browserHistory`:

```js
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

const App = () => (
    <Admin history={history}>
        ...
    </Admin>
);
```

## Internationalization

The `locale` and `messages` props let you translate the GUI. The [Translation Documentation](./Translation.md) details this process.

## Using admin-on-rest without `<Admin>` and `<Resource>`

Using `<Admin>` and `<Resource>` is completely optional. If you feel like bootstrapping a redux app yourself, it's totally possible. Head to [Including in another app](./CustomApp.md) for a detailed how-to.
