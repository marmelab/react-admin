---
layout: default
title: "Including the Admin in Another App"
---

# Including React-Admin In Another Redux Application

The `<Admin>` tag is a great shortcut to be up and running with react-admin in minutes. However, in many cases, you will want to embed the admin in another application, or customize the admin redux store deeply.

**Tip**: Before going for the Custom App route, explore all the options of [the `<Admin>` component](./Admin.md). They allow you to add custom routes, custom reducers, custom sagas, and customize the layout.

## Using an Existing Redux Provider

The `<Admin>` component detects when it's used inside an existing Redux `<Provider>`, and skips its own store initialization. That means that react-admin will work out of the box inside another Redux application - provided, of course, the store is compatible.

Beware that you need to know about [redux](https://redux.js.org/), [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start), and [redux-saga](https://github.com/yelouafi/redux-saga) to go further.

React-admin requires that the redux state contains at least 2 reducers: `admin` and `router`. You can add more, or replace some of them with your own, but you can't remove or rename them. As it relies on `connected-react-router` and `redux-saga`, react-admin also expects the store to use their middlewares.

Here is the default store creation for react-admin:

```js
// in src/createAdminStore.js
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import {
    adminReducer,
    adminSaga,
    USER_LOGOUT,
} from 'react-admin';

export default ({
    authProvider,
    dataProvider,
    history,
}) => {
    const reducer = combineReducers({
        admin: adminReducer,
        router: connectRouter(history),
        // add your own reducers here
    });
    const resettableAppReducer = (state, action) =>
        reducer(action.type !== USER_LOGOUT ? state : undefined, action);

    const saga = function* rootSaga() {
        yield all(
            [
                adminSaga(dataProvider, authProvider),
                // add your own sagas here
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();

    const composeEnhancers =
        (process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                trace: true,
                traceLimit: 25,
            })) ||
        compose;
  
    const store = createStore(
        resettableAppReducer,
        { /* set your initial state here */ },
        composeEnhancers(
            applyMiddleware(
                sagaMiddleware,
                routerMiddleware(history),
                // add your own middlewares here
            ),
            // add your own enhancers here
        ),        
    );
    sagaMiddleware.run(saga);
    return store;
};
```

You can use this script as a base and then add your own middlewares or enhancers, e.g., to allow store persistence with [redux-persist](https://github.com/rt2zz/redux-persist).

Then, use the `<Admin>` component as you would in a standalone application. Here is an example with 3 resources: `posts`, `comments`, and `users`.

```jsx
// in src/App.js
import * as React from "react";
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import createAdminStore from './createAdminStore';
import messages from './i18n';

// your app components
import Dashboard from './Dashboard';
import { PostList, PostCreate, PostEdit, PostShow } from './Post';
import { CommentList, CommentEdit, CommentCreate } from './Comment';
import { UserList, UserEdit, UserCreate } from './User';

// dependency injection
const dataProvider = restProvider('http://path.to.my.api/');
const authProvider = () => Promise.resolve();
const i18nProvider = polyglotI18nProvider(locale => {
    if (locale !== 'en') {
        return messages[locale];
    }
    return defaultMessages;
});
const history = createHashHistory();

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            history,
        })}
    >
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            history={history}
            title="My Admin"
        >
            <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} />
            <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} />
            <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
        </Admin>
    </Provider>
);

export default App;
```

**Tip**: One thing to pay attention to is that you must pass the same `history`, `dataProvider` and `authProvider` to both the redux Store creator and the `<Admin>` component. But you don't need to pass the `i18nProvider`.

## Not Using the `<Admin>` Components

The `<Admin>` component takes care of defining the store (unless you provide one, as seen above), of setting the Translation and Authentication contexts, and of bootstrapping the Router. In case you need to override any of these, you can use your own component instead of `<Admin>`.

Here is the main code for bootstrapping a barebone react-admin application without `<Admin>`:

```diff
// in src/App.js
import * as React from "react";
+import PropTypes from "prop-types";
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
+import { ConnectedRouter } from 'connected-react-router';
+import { Switch, Route } from 'react-router-dom';
+import withContext from 'recompose/withContext'; // You should add recompose/withContext to your dependencies
-import { Admin, Resource } from 'react-admin';
+import { AuthContext, DataProviderContext, TranslationProvider, Resource, Notification } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
+import { ThemeProvider } from '@material-ui/styles';
+import { createTheme } from "@material-ui/core/styles";
+import AppBar from '@material-ui/core/AppBar';
+import Toolbar from '@material-ui/core/Toolbar';
+import Typography from '@material-ui/core/Typography';

import createAdminStore from './createAdminStore';
import messages from './i18n';
import authProvider from './myAuthProvider';

// your app components
import Dashboard from './Dashboard';
import { PostList, PostCreate, PostEdit, PostShow } from './Post';
import { CommentList, CommentEdit, CommentCreate } from './Comment';
import { UserList, UserEdit, UserCreate } from './User';

// dependency injection
const dataProvider = restProvider('http://path.to.my.api/');
const i18nProvider = polyglotI18nProvider(locale => {
    if (locale !== 'en') {
        return messages[locale];
    }
    return defaultMessages;
});
const history = createHashHistory();
const theme = createTheme();

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            history,
        })}
    >
-       <Admin
-           authProvider={authProvider}
-           history={history}
-           title="My Admin"
-       >
-           <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} />
-           <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} />
-           <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
+       <AuthContext.Provider value={authProvider}>
+       <DataProviderContext.Provider value={dataProvider}>
+       <TranslationProvider
+           locale="en"
+           i18nProvider={i18nProvider}
+       >
+           <ThemeProvider theme={theme}>
+               <Resource name="posts" intent="registration" />
+               <Resource name="comments" intent="registration" />
+               <Resource name="users" intent="registration" />
+               <AppBar position="static" color="default">
+                   <Toolbar>
+                       <Typography variant="h6" color="inherit">
+                           My admin
+                       </Typography>
+                   </Toolbar>
+               </AppBar>
+               <ConnectedRouter history={history}>
+                   <Switch>
+                       <Route exact path="/" component={Dashboard} />
+                       <Route exact path="/posts" render={(routeProps) => <PostList hasCreate resource="posts" basePath={routeProps.match.url} {...routeProps} />} />
+                       <Route exact path="/posts/create" render={(routeProps) => <PostCreate resource="posts" basePath={routeProps.match.url} {...routeProps} />} />
+                       <Route exact path="/posts/:id" render={(routeProps) => <PostEdit hasShow resource="posts" basePath={routeProps.match.url} id={decodeURIComponent((routeProps.match).params.id)} {...routeProps} />} />
+                       <Route exact path="/posts/:id/show" render={(routeProps) => <PostShow hasEdit resource="posts" basePath={routeProps.match.url} id={decodeURIComponent((routeProps.match).params.id)} {...routeProps} />} />
+                       <Route exact path="/comments" render={(routeProps) => <CommentList hasCreate resource="comments" basePath={routeProps.match.url} {...routeProps} />} />
+                       <Route exact path="/comments/create" render={(routeProps) => <CommentCreate resource="comments" basePath={routeProps.match.url} {...routeProps} />} />
+                       <Route exact path="/comments/:id" render={(routeProps) => <CommentEdit resource="comments" basePath={routeProps.match.url} id={decodeURIComponent((routeProps.match).params.id)} {...routeProps} />} />
+                       <Route exact path="/users" render={(routeProps) => <UsersList hasCreate resource="users" basePath={routeProps.match.url} {...routeProps} />} />
+                       <Route exact path="/users/create" render={(routeProps) => <UsersCreate resource="users" basePath={routeProps.match.url} {...routeProps} />} />
+                       <Route exact path="/users/:id" render={(routeProps) => <UsersEdit resource="users" basePath={routeProps.match.url} id={decodeURIComponent((routeProps.match).params.id)} {...routeProps} />} />
+                   </Switch>
+               </ConnectedRouter>
+               <Notification />
+           </ThemeProvider>
+       </TranslationProvider>
+       </DataProviderContext.Provider>
+       </AuthContext.Provider>
-       </Admin>
    </Provider>
);

-export default App;
+export default withContext(
+   {
+       authProvider: PropTypes.object,
+   },
+   () => ({ authProvider })
+)(App);
```

Note that this example still uses `<Resource>`, because this component lazily initializes the store for the resource data.

This application has no sidebar, no theming, no [auth control](./Authentication.md#useauthenticated-hook) - it's up to you to add these. From there on, you can customize pretty much anything you want.
