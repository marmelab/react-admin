---
layout: default
title: "Including the Admin in Another App"
---

# Including admin-on-rest on another React app

The `<Admin>` tag is a great shortcut got be up and running with admin-on-rest in minutes. However, in many cases, you will want to embed the admin in another application, or customize the admin deeply. Fortunately, you can do all the work that `<Admin>` does on any React application.

Beware that you need to know about [redux](http://redux.js.org/), [react-router](https://github.com/reactjs/react-router), and [redux-saga](https://github.com/yelouafi/redux-saga) to go further.

**Tip**: Before going for the Custom App route, explore all the options of [the `<Admin>` component](./AdminResource.html##the-admin-component). They allow you to add custom routes, custom reducers, custom sagas, and customize the layout.

Here is the main code for bootstrapping an admin-on-rest application with 3 resources: `posts`, `comments`, and `users`:

```js
// in src/App.js
import React, { PropTypes } from 'react';
import { render } from 'react-dom';

// redux, react-router, and saga form the 'kernel' on which admin-on-rest runs
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import withProps from 'recompose/withProps';

// prebuilt admin-on-rest features
import { adminReducer, localeReducer, crudSaga, CrudRoute, TranslationProvider, simpleRestClient } from 'admin-on-rest';

// your app components
import Dashboard from './Dashboard';
import { PostList, PostCreate, PostEdit, PostShow } from './Post';
import { CommentList, CommentEdit, CommentCreate } from './Comment';
import { UserList, UserEdit, UserCreate } from './User';
import { Delete, Layout } from 'admin-on-rest/lib/mui';
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

// the resources array is used for the menu
const resources = [
    { name: 'posts', list: PostList },
    { name: 'comments', list: CommentList },
];

const LayoutWithTitle = withProps({ title: 'My Admin' })(Layout);

// initialize the router
const history = syncHistoryWithStore(hashHistory, store);

// bootstrap redux and the routes
const App = () => (
    <Provider store={store}>
        <TranslationProvider messages={messages}>
            <Router history={history}>
                <Route path="/" component={LayoutWithTitle} resources={resources}>
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
