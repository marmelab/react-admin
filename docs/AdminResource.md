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
* [`theme`](#theme)
* [`appLayout`](#applayout)

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

If you want to deeply customize the app header, the menu, or the notifications, the best way is to provide a custom layout component. It must contain a `{children}` placeholder, where admin-on-rest will render the resources. If you use material UI fields and inputs, it *must* contain a `<MuiThemeProvider>` element, and it should also import `injectTapEventPlugin`, as stated in [the Material UI installation doc](http://www.material-ui.com/#/get-started/installation). And finally, if you want to show the spinner in the app header when the app fetches data in the background, the Layout should connect to the redux store.

Use the [default layout](https://github.com/marmelab/admin-on-rest/blob/master/src/mui/layout/Layout.js) as a starting point:

{% raw %}
```js
// in src/myLayout.js
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Notification from './Notification';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Menu from './Menu';

injectTapEventPlugin();

const myLayout = ({ isLoading, children, route }) => {
    const Title = <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Admin on REST</Link>;
    const RightElement = isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span />;

    return (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar title={Title} iconElementRight={RightElement} />
                <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                    <div style={{ flex: 1 }}>{children}</div>
                    <Menu resources={route.resources} />
                </div>
                <Notification />
            </div>
        </MuiThemeProvider>
    );
};

myLayout.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    route: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(myLayout);
```
{% endraw %}

```js
// in src/App.js
import myLayout from './myLayout';

const App = () => (
    <Admin appLayout={myLayout} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

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
* `/:id` maps to the edit component
* `/:id/delete` maps to the `remove` component

The `<Resource>` props allow you to customize all the CRUD operations for a given resource.

* [`name`](#name)
* [`icon`](#icon)
* [`options`](#icon)

### `name`

Admin-on-rest uses the `name` prop both to determine the API endpoint (passed to the `restClient`), and to form the URL for the resource.

```js
<Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} remove={PostRemove} />
```

For this resource admin-on-rest will fetch the `http://jsonplaceholder.typicode.com/posts` endpoint for data.

The routing will map the component as follows:

* `/posts/` maps to `PostList`
* `/posts/create` maps to `PostCreate`
* `/posts/:id` maps to `PostEdit`
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
<Resource name="v2/posts" options={{ label: 'Posts' }}list={PostList} />
```
{% endraw %}

## Using admin-on-rest without `<Admin>` and `<Resource>`

Using `<Admin>` and `<Resource>` is completely optional. If you feel like bootstrapping a redux app yourself, it's totally possible. Head to [Including in another app](./CustomApp.html) for a detailed how-to.
