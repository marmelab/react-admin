---
layout: default
title: "Including the Admin in Another App"
---

# Including React-Admin In Another Redux Application

The `<Admin>` tag is a great shortcut got be up and running with react-admin in minutes. However, in many cases, you will want to embed the admin in another application, or customize the admin redux store deeply.

**Tip**: Before going for the Custom App route, explore all the options of [the `<Admin>` component](./Admin.md). They allow you to add custom routes, custom reducers, custom sagas, and customize the layout.

Fortunately, the `<Admin>` component detects when it's used inside an existing Redux `<Provider>`, and skips its own store initialization. That means that react-admin will work out of the box inside another redux application - provided, of course, the store is compatible.

Beware that you need to know about [redux](http://redux.js.org/), [react-router](https://github.com/reactjs/react-router), and [redux-saga](https://github.com/yelouafi/redux-saga) to go further.

React-admin requires that the redux state contains at least 4 reducers: `admin`, `i18n`, `form`, and `router`. You can add more, or replace some of them with your own, but you can't remove or rename them. As it relies on redux-form, react-router, and redux-saga, react-admin also expects the store to use their middlewares.

Here is the default store creation for react-admin:

```js
// in src/createAdminStore.js
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import {
    adminReducer,
    adminSaga,
    createAppReducer,
    defaultI18nProvider,
    i18nReducer,
    formMiddleware,
    USER_LOGOUT,
} from 'react-admin';

export default ({
    authProvider,
    dataProvider,
    i18nProvider = defaultI18nProvider,
    history,
    locale = 'en',
}) => {
    const reducer = combineReducers({
        admin: adminReducer,
        i18n: i18nReducer(locale, i18nProvider(locale)),
        form: formReducer,
        router: routerReducer,
        { /* add your own reducers here */ },
    });
    const resettableAppReducer = (state, action) =>
        reducer(action.type !== USER_LOGOUT ? state : undefined, action);

    const saga = function* rootSaga() {
        yield all(
            [
                adminSaga(dataProvider, authProvider, i18nProvider),
                // add your own sagas here
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        resettableAppReducer,
        { /* set your initial state here */ },
        compose(
            applyMiddleware(
                sagaMiddleware,
                formMiddleware,
                routerMiddleware(history),
                // add your own middlewares here
            ),
            typeof window !== 'undefined' && window.devToolsExtension
                ? window.devToolsExtension()
                : f => f
            // add your own enhancers here
        )
    );
    sagaMiddleware.run(saga);
    return store;
};
```

You can use this script as a base and then add your own middleares or enhancers, e.g. to allow store persistence with [redux-persist](https://github.com/rt2zz/redux-persist).

Then, use the `<Admin>` component as you would in a standalone application. Here is an example with 3 resources: `posts`, `comments`, and `users`

```js
// in src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Admin, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import defaultMessages from 'ra-language-english';

import createAdminStore from './createAdminStore';
import messages from './i18n';

// your app components
import Dashboard from './Dashboard';
import { PostList, PostCreate, PostEdit, PostShow } from './Post';
import { CommentList, CommentEdit, CommentCreate } from './Comment';
import { UserList, UserEdit, UserCreate } from './User';

// side effects
const authProvider = () => Promise.resolve();
const dataProvider = restProvider('http://path.to.my.api/');
const i18nProvider = locale => {
    if (locale !== 'en') {
        return messages[locale];
    }
    return defaultMessages;
};
const history = createHistory();

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            i18nProvider,
            history,
        })}
    >
        <Admin
            authProvider={authProvider}
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

**Tip**: One thing to pay attention to is that you must pass the same `history` and `authProvider` to both the redux Store creator and the `<Admin>` component. But you don't need to pass the `dataProvider` or the `i18nProvider`.

## Not Using the `<Admin>` Components

The `<Admin>` component takes care of defining the store (unless you provide one, as seen above), of setting the Translation and Authentication contexts, and of bootstrapping the Router. In case you need to override any of these, you can use your own component instead of `<Admin>`.

Here is the main code for bootstrapping a barebones react-admin application without `<Admin>`:

```diff
// in src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
+import { ConnectedRouter } from 'react-router-redux';
+import { Switch, Route } from 'react-router-dom';
+import withContext from 'recompose/withContext';
-import { Admin, Resource } from 'react-admin';
+import { TranslationProvider, Resource } from 'react-admin';
import restProvider from 'ra-data-simple-rest';
import defaultMessages from 'ra-language-english';
+import { MuiThemeProvider } from '@material-ui/core/styles';
+import AppBar from '@material-ui/core/AppBar';
+import Toolbar from '@material-ui/core/Toolbar';
+import Typography from '@material-ui/core/Typography';

import createAdminStore from './createAdminStore';
import messages from './i18n';

// your app components
import Dashboard from './Dashboard';
import { PostList, PostCreate, PostEdit, PostShow } from './Post';
import { CommentList, CommentEdit, CommentCreate } from './Comment';
import { UserList, UserEdit, UserCreate } from './User';

// side effects
const authProvider = () => Promise.resolve();
const dataProvider = restProvider('http://path.to.my.api/');
const i18nProvider = locale => {
    if (locale !== 'en') {
        return messages[locale];
    }
    return defaultMessages;
};
const history = createHistory();

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            i18nProvider,
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
+       <TranslationProvider>
+           <ConnectedRouter history={history}>
+               <Resource name="posts" context="registration" />
+               <Resource name="comments" context="registration" />
+               <Resource name="users" context="registration" />
+               <MuiThemeProvider>
+                   <AppBar position="static" color="default">
+                       <Toolbar>
+                           <Typography variant="title" color="inherit">
+                               My admin
+                           </Typography>
+                       </Toolbar>
+                   </AppBar>
+                   <Switch>
+                       <Route exact path="/" component={Dashboard} />
+                       <Route exact path="/posts" hasCreate render={(routeProps) => <PostList resource="posts" {...routeProps} />} />
+                       <Route exact path="/posts/create" render={(routeProps) => <PostCreate resource="posts" {...routeProps} />} />
+                       <Route exact path="/posts/:id" hasShow render={(routeProps) => <PostEdit resource="posts" {...routeProps} />} />
+                       <Route exact path="/posts/:id/show" hasEdit render={(routeProps) => <PostShow resource="posts" {...routeProps} />} />
+                       <Route exact path="/comments" hasCreate render={(routeProps) => <CommentList resource="comments" {...routeProps} />} />
+                       <Route exact path="/comments/create" render={(routeProps) => <CommentCreate resource="comments" {...routeProps} />} />
+                       <Route exact path="/comments/:id" render={(routeProps) => <CommentEdit resource="comments" {...routeProps} />} />
+                       <Route exact path="/users" hasCreate render={(routeProps) => <UsersList resource="users" {...routeProps} />} />
+                       <Route exact path="/users/create" render={(routeProps) => <UsersCreate resource="users" {...routeProps} />} />
+                       <Route exact path="/users/:id" render={(routeProps) => <UsersEdit resource="users" {...routeProps} />} />
+                   </Switch>
+               </MuiThemeProvider>
+           </ConnectedRouter>
+       </TranslationProvider>
-       </Admin>
    </Provider>
);

-export default App;
+export default withContext(
+   {
+       authProvider: PropTypes.func,
+   },
+   () => ({ authProvider })
```

Note that this example still uses `<Resource>`, because this component lazily initializes the store for the resource data.

This application has no sidebar, no theming, no [auth control](./Authentication.md#restricting-access-to-a-custom-page) - it's up to you to add these. From there on, you can customize pretty much anything you want.
