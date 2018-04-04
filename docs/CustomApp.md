---
layout: default
title: "Including the Admin in Another App"
---

# Including react-admin on another React app

The `<Admin>` tag is a great shortcut got be up and running with react-admin in minutes. However, in many cases, you will want to embed the admin in another application, or customize the admin deeply. Fortunately, you can do all the work that `<Admin>` does on any React application.

Beware that you need to know about [redux](http://redux.js.org/), [react-router](https://github.com/reactjs/react-router), and [redux-saga](https://github.com/yelouafi/redux-saga) to go further.

**Tip**: Before going for the Custom App route, explore all the options of [the `<Admin>` component](./Admin.md). They allow you to add custom routes, custom reducers, custom sagas, and customize the layout.

Here is the main code for bootstrapping a barebones react-admin application with 3 resources: `posts`, `comments`, and `users`:

```jsx
// in src/App.js
import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';

// redux, react-router, redux-form, saga, and material-ui
// form the 'kernel' on which react-admin runs
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { MuiThemeProvider } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

// prebuilt react-admin features
import {
    adminReducer,
    localeReducer,
    adminSaga,
    TranslationProvider,
    declareResources,
} from 'react-admin';
import simpleRestClient from 'ra-data-simple-rest';
import defaultMessages from 'ra-language-english';

// your app components
import Dashboard from './Dashboard';
import { PostList, PostCreate, PostEdit, PostShow } from './Post';
import { CommentList, CommentEdit, CommentCreate } from './Comment';
import { UserList, UserEdit, UserCreate } from './User';
// your app labels
import messages from './i18n';

const i18nProvider = locale => {
    if (locale !== 'en') {
        return messages[locale];
    }

    return defaultMessages;
};


// create a Redux app
const reducer = combineReducers({
    admin: adminReducer('en', messages['en']),
    locale: localeReducer(),
    form: formReducer,
    routing: routerReducer,
});
const sagaMiddleware = createSagaMiddleware();
const history = createHistory();
const store = createStore(reducer, undefined, compose(
    applyMiddleware(sagaMiddleware, routerMiddleware(history)),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
));
store.dispatch(declareResources([{ name: 'posts' }, { name: 'comments' }, { name: 'users' }]));
const dataProvider = simpleRestClient('http://path.to.my.api/');
sagaMiddleware.run(adminSaga(dataProvider, i18nProvider));

// bootstrap redux and the routes
const App = () => (
    <Provider store={store}>
        <TranslationProvider>
            <ConnectedRouter history={history}>
                <MuiThemeProvider>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="title" color="inherit">
                                My admin
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Switch>
                        <Route exact path="/" component={Dashboard} />
                        <Route exact path="/posts" hasCreate render={(routeProps) => <PostList resource="posts" {...routeProps} />} />
                        <Route exact path="/posts/create" render={(routeProps) => <PostCreate resource="posts" {...routeProps} />} />
                        <Route exact path="/posts/:id" hasShow render={(routeProps) => <PostEdit resource="posts" {...routeProps} />} />
                        <Route exact path="/posts/:id/show" hasEdit render={(routeProps) => <PostShow resource="posts" {...routeProps} />} />
                        <Route exact path="/comments" hasCreate render={(routeProps) => <CommentList resource="comments" {...routeProps} />} />
                        <Route exact path="/comments/create" render={(routeProps) => <CommentCreate resource="comments" {...routeProps} />} />
                        <Route exact path="/comments/:id" render={(routeProps) => <CommentEdit resource="comments" {...routeProps} />} />
                        <Route exact path="/users" hasCreate render={(routeProps) => <UsersList resource="users" {...routeProps} />} />
                        <Route exact path="/users/create" render={(routeProps) => <UsersCreate resource="users" {...routeProps} />} />
                        <Route exact path="/users/:id" render={(routeProps) => <UsersEdit resource="users" {...routeProps} />} />
                    </Switch>
                </MuiThemeProvider>
            </ConnectedRouter>
        </TranslationProvider>
    </Provider>
);
```

This application has no sidebar, no theming, no [auth control](./Authentication.md#restricting-access-to-a-custom-page) - it's up to you to add these. From then on, you can customize pretty much anything you want.
