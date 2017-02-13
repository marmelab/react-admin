---
layout: default
title: "Including the Admin in Another App"
---

# Including admin-on-rest on another React app

The `<Admin>` tag is a great shortcut got be up and running with admin-on-rest in minutes. However, in many cases, you will want to embed the admin in another application, or customize the admin deeply. Fortunately, you can do all the work that `<Admin>` does on any React application.

Beware that you need to know about [redux](http://redux.js.org/), [react-router](https://github.com/reactjs/react-router), and [redux-saga](https://github.com/yelouafi/redux-saga) to go further.

**Tip**: Before going for the Custom App route, explore all the options of [the `<Admin>` component](./AdminResource.html##the-admin-component). They allow you to add custom routes, custom reducers, custom sagas, and customize the layout.

## Basic Admin App

Here is the main code for bootstrapping an admin-on-rest application with 3 resources: `posts`, `comments`, and `users`:

```js
// in src/App.js
import React, { PropTypes } from 'react';

// redux, react-router, and saga form the 'kernel' on which admin-on-rest runs
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

// prebuilt admin-on-rest features
import { adminReducer, localeReducer, crudSaga, CrudRoute, Layout, TranslationProvider, simpleRestClient } from 'admin-on-rest';

// your app components
import Dashboard from './Dashboard';
import { PostList, PostCreate, PostEdit, PostShow } from './Post';
import { CommentList, CommentEdit, CommentCreate } from './Comment';
import { UserList, UserEdit, UserCreate } from './User';
import { Delete } from 'admin-on-rest/lib/mui';
// your app labels
import messages from './i18n';

// create a Redux app
const reducer = combineReducers({
    admin: adminReducer([{ name: 'posts' }, { name: 'comments' }, { name: 'users' }]),
    locale: localeReducer(),
    form: formReducer,
    routing: routerReducer,
});
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, undefined, compose(
    applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
));
const restClient = simpleRestClient('http://path.to.my.api/');
sagaMiddleware.run(crudSaga(restClient));

// initialize the router
const history = syncHistoryWithStore(hashHistory, store);

// bootstrap redux and the routes
const App = () => (
    <Provider store={store}>
        <TranslationProvider messages={messages}>
            <Router history={history}>
                <Route path="/" component={Layout}>
                    <IndexRoute component={Dashboard} />
                    <CrudRoute path="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={Delete} />
                    <CrudRoute path="comments" list={CommentList} create={CommentCreate} edit={CommentEdit} remove={Delete} />
                    <CrudRoute path="users" list={UserList} create={UserCreate} edit={UserEdit} remove={Delete} />
                </Route>
            </Router>
        </TranslationProvider>
    </Provider>
);
```

From then on, you can customize pretty much anything you want.

## Adding Custom routes

Since you're in control of the app, you can add `<Route>` components of your own wherever in the react-ruter configuration:

```js
const App = () => (
    <Provider store={store}>
        <TranslationProvider messages={messages}>
            <Router history={history}>
                <Route path="/" component={Layout}>
                    <IndexRoute component={Dashboard} />
                    <Route path="checkout" component={Checkout}>
                        <Route path="/:id" component={Cart} />
                    </Route>
                    <CrudRoute key="posts" path="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={Delete} />
                    <!-- ... -->
                </Route>
            </Router>
        </TranslationProvider>
    </Provider>
);
```

Check the [react-router documentation](https://github.com/reactjs/react-router/tree/master/docs) for more information on creating your own routes.

## Adding Custom reducers

If you use custom components dispatching your own actions, you will want to store the result in a custom part of the state. That's easy: add an entry in the `combineReducers()` call:

```js
import { routerReducer } from 'react-router-redux';
import { adminReducer } from 'admin-on-rest';
import { reducer as formReducer } from 'redux-form';

import checkoutReducer from './reducers/checkout';
const reducer = combineReducers({
    admin: adminReducer(['posts, comments, users']),
    locale: localeReducer(),
    form: formReducer,
    routing: routerReducer,
    // add your own reducers here
    checkout: checkoutReducer,
});
```

## Changing the Menu or the Layout

The `<Layout>` component has the responsibility for displaying the menu. So you can build your own custom menu, wrap it in a custom layout, and pass that to the `<Route path="/">` route.

{% raw %}
```js
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Notification, AppBar } from 'admin-on-rest';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router';

// in src/MyLayout
const MyMenu = () => (
    <Paper style={{ flex: '0 0 15em', order: -1 }}>
        <List>
            <ListItem containerElement={<Link to={`/posts`} />} primaryText="Posts" leftIcon={<MyPostIcon />} />
            <ListItem containerElement={<Link to={`/comments`} />} primaryText="Comments" leftIcon={<MyPostIcon />} />
            <ListItem containerElement={<Link to={`/users`} />} primaryText="Users" leftIcon={<MyPostIcon />} />
            )}
        </List>
    </Paper>
);

const MyLayout = ({ isLoading, children, route, title }) => {
    const Title = <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>{title}</Link>;
    const RightElement = isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span />;

    return (
        <MuiThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar title={Title} iconElementRight={RightElement} />
                <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                    <div style={{ flex: 1 }}>{children}</div>
                    <MyMenu />
                </div>
                <Notification />
            </div>
        </MuiThemeProvider>
    );
};

// in src/App.js
import MyLayout from './MyLayout';
const App = () => (
    <Provider store={store}>
        <TranslationProvider messages={messages}>
            <Router history={history}>
                <Route path="/" component={MyLayout}>
                    <!-- ... -->
                </Route>
            </Router>
        </TranslationProvider>
    </Provider>
);
```
{% endraw %}

## Replacing Saga by Another Side Effect library

Admin-on-rest chooses to use redux-saga for all side effects (AJAX calls, notifications, actions launched as a result of another action, etc). There is no consensus yet on the best way to code side effects in a redux app. Chances are you chose another solution (like [redux-thunk](https://github.com/gaearon/redux-thunk), [redux-loop](https://github.com/redux-loop/redux-loop)). No problem! you can just use your own side effects instead of admin-on-rest ones. Just make sure they listen and dispatch the same actions.
