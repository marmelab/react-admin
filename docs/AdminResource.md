---
layout: default
title: "Admin and Resource Components"
---

# `<Admin>` and `<Resource>` Components

The `<Admin>` and `<Resource>` components form the basis of the configuration of an admin-on-rest application. Knowing each of their options will help you build admin apps faster.

## The `<Admin>` component

The `<Admin>` component creates an application with its own state, routing, and controller logic. `<Admin>` requires only a `restClient` and at least one child `<Resource>` to work:

```js
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

### `restClient`

The only required prop, it must be a function returning a promise, with the following signature:

```js
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

The `restClient` is also the ideal place to add custom HTTP headers, authentication, etc. The [Rest Clients Chapter](./RestClients.html) of the documentation lists available REST clients, and how to build your own.

### `title`

By default, the header of an admin app uses 'Admin on REST' as the main app title. It's probably the first thing you'll want to customize. The `title` prop serves exactly that purpose.

```js
const App = () => (
    <Admin title="My Custom Admin" restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

### `dashboard`

By default, the homepage of an an admin app is the `list` of the first child `<Resource>`. But you can also specify a custom component instead. To fit in the general design, use Material UI's `<Card>` component:

{% raw %}
```js
// in src/Dashboard.js
import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export default () => (
    <Card style={{ margin: '2em' }}>
        <CardHeader title="Welcome to the administration" />
        <CardText>Lorem ipsum sic dolor amet...</CardText>
    </Card>
);
```
{% endraw %}

```js
// in src/App.js
import Dashboard from './Dashboard';

const App = () => (
    <Admin dashboard={Dashboard} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Custom home page](http://static.marmelab.com/admin-on-rest/dashboard.png)

### `menu`

Admin-on-rest uses the list of `<Resource>` components passed as children of `<Admin>` to build a menu to each resource with a `list` component.

If you want to add or remove menu items, for instance to link to non-resources pages, you can create your own menu component:

```js
// in src/Menu.js
import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

export default ({ resources, onMenuTap, logout }) => (
    <div>
        <MenuItem containerElement={<Link to="/posts" />} primaryText="Posts" onTouchTap={onMenuTap} />
        <MenuItem containerElement={<Link to="/comments" />} primaryText="Comments" onTouchTap={onMenuTap} />
        <MenuItem containerElement={<Link to="/custom-route" />} primaryText="Miscellaneous" onTouchTap={onMenuTap} />
        {logout}
    </div>
);
```

Then, pass it to the `<Admin>` component as the `menu` prop:

```js
// in src/App.js
import Menu from './Menu';

const App = () => (
    <Admin menu={Menu} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

**Tip**: If you use authentication, don't forget to render the `logout` prop in your custom menu component. Also, the `onMenuTap` function passed as prop is used to close the sidebar on mobile.

### `theme`

Material UI supports [theming](http://www.material-ui.com/#/customization/themes). This lets you customize the look and feel of an admin by overriding fonts, colors, and spacing. You can provide a custom material ui theme by using the `theme` prop:

```js
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

### `appLayout`

If you want to deeply customize the app header, the menu, or the notifications, the best way is to provide a custom layout component. It must contain a `{children}` placeholder, where admin-on-rest will render the resources. If you use material UI fields and inputs, it *must* contain a `<MuiThemeProvider>` element. And finally, if you want to show the spinner in the app header when the app fetches data in the background, the Layout should connect to the redux store.

Use the [default layout](https://github.com/marmelab/admin-on-rest/blob/master/src/mui/layout/Layout.js) as a starting point, and check [the Theming documentation](./Theming.html#using-a-custom-layout) for examples.

```js
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin appLayout={MyLayout} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

### `customReducers`

The `<Admin>` app uses [Redux](http://redux.js.org/) to manage state. The state has the following keys:

```js
{
    admin: { /*...*/ }, // used by admin-on-rest
    form: { /*...*/ }, // used by redux-form
    routing: { /*...*/ }, // used by react-router-redux
}
```

If your components dispatch custom actions, you probably need to register your own reducers to update the state with these actions. Let's imagine that you want to keep the bitcoin exchange rate inside the `bitcoinRate` key in the state. You probably have a reducer looking like the following:

```js
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
```js
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

```js
{
    admin: { /*...*/ }, // used by admin-on-rest
    form: { /*...*/ }, // used by redux-form
    routing: { /*...*/ }, // used by react-router-redux
    bitcoinRate: 123, // managed by rateReducer
}
```

### `customSagas`

The `<Admin>` app uses [redux-saga](https://github.com/redux-saga/redux-saga) to handle side effects.

If your components dispatch custom actions, you probably need to register your own side effects as sagas. Let's imagine that you want to show a notification whenever the `BITCOIN_RATE_RECEIVED` action is dispatched. You probably have a saga looking like the following:

```js
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

```js
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

### `customRoutes`

To register your own routes, create a function returning a [react-router](https://github.com/ReactTraining/react-router) `<Route>` component:

```js
// in src/customRoutes.js
import React from 'react';
import { Route } from 'react-router';
import Foo from './Foo';
import Bar from './Bar';

export default () => (
    <Route>
        <Route path="/foo" component={Foo} />
        <Route path="/bar" component={Bar} />
    </Route>
);
```

Then, pass this function as `customRoutes` prop to the `<Admin>` component:

```js
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

**Tip**: It's up to you to create a [custom menu](#applayout) entry, or custom buttons, to lead to your custom pages.

**Tip**: Your custom pages take precedence over admin-on-rest's own routes. That means that `customRoutes` lets you override any route you want!

**Tip**: To look like other admin-on-rest pages, your custom pages should have the following structure:

```js
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

### `authClient`

The `authClient` prop expect a function returning a Promise, to control the application authentication strategy:

```js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK } from 'admin-on-rest';

const authClient(type, params) {
    // type can be any of AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK
    // ...
    return Promise.resolve();
};

const App = () => (
    <Admin authClient={authClient} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        ...
    </Admin>
);
```

The [Authentication documentation](./Authentication.html) explains how to implement these functions in detail.

### `loginPage`

If you want to customize the Login page, or switch to another authentication strategy than a username/password form, pass a component of your own as the `loginPage` prop. Admin-on-rest will display this component whenever the `/login` route is called.

```js
import MyLoginPage from './MyLoginPage';

const App = () => (
    <Admin loginPage={MyLoginPage}>
        ...
    </Admin>
);
```

See The [Authentication documentation](./Authentication.html#customizing-the-login-and-logout-components) for more explanations.

### `logoutButton`

If you customize the `loginPage`, you probably need to override the `logoutButton`, too - because they share the authentication strategy.

```js
import MyLoginPage from './MyLoginPage';
import MyLogoutButton from './MyLogoutButton';

const App = () => (
    <Admin loginPage={MyLoginPage} logoutButton={MyLogoutButton}>
        ...
    </Admin>
);
```

### `initialState`
The `initialState` prop lets you pass preloaded state to Redux. See the [Redux Documentation](http://redux.js.org/docs/api/createStore.html#createstorereducer-preloadedstate-enhancer) for more details.

### Internationalization

The `locale` and `messages` props let you translate the GUI. The [Translation Documentation](./Translation.html) details this process.

## The `<Resource>` component

A `<Resource>` component maps one API endpoint to a CRUD interface. For instance, the following admin app offers a read-only interface to the resources exposed by the JSONPlaceholder API at  [`http://jsonplaceholder.typicode.com/posts`](http://jsonplaceholder.typicode.com/posts) and [`http://jsonplaceholder.typicode.com/users`](http://jsonplaceholder.typicode.com/users):

```js
// in src/App.js
import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';
import { UserList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
        <Resource name="users" list={UserList} />
    </Admin>
);
```

Under the hood, the `<Resource>` component uses react-router to create several routes:

* `/` maps to the `list` component
* `/create` maps to the `create` component
* `/:id` maps to the `edit` component
* `/:id/show` maps to the `show` component
* `/:id/delete` maps to the `remove` component

The `<Resource>` props allow you to customize all the CRUD operations for a given resource.

* [`name`](#name)
* [`icon`](#icon)
* [`options`](#icon)

### `name`

Admin-on-rest uses the `name` prop both to determine the API endpoint (passed to the `restClient`), and to form the URL for the resource.

```js
<Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={PostRemove} />
```

For this resource admin-on-rest will fetch the `http://jsonplaceholder.typicode.com/posts` endpoint for data.

The routing will map the component as follows:

* `/posts/` maps to `PostList`
* `/posts/create` maps to `PostCreate`
* `/posts/:id` maps to `PostEdit`
* `/posts/:id/show` maps to `PostShow`
* `/posts/:id/delete` maps to `PostRemove`

**Tip**: If you want to use a special API endpoint without altering the URL, write the translation from the resource `name` to the API endpoint in your own `restClient`

### `icon`

Admin-on-rest will render the `icon` prop component in the menu:

```js
// in src/App.js
import React from 'react';
import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} icon={PostIcon} />
        <Resource name="users" list={UserList} icon={UserIcon} />
    </Admin>
);
```

### options

`options.label` allows to customize the display name of a given resource in the menu.

{% raw %}
```js
<Resource name="v2/posts" options={{ label: 'Posts' }} list={PostList} />
```
{% endraw %}

## Using admin-on-rest without `<Admin>` and `<Resource>`

Using `<Admin>` and `<Resource>` is completely optional. If you feel like bootstrapping a redux app yourself, it's totally possible. Head to [Including in another app](./CustomApp.html) for a detailed how-to.
