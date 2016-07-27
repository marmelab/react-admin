# admin-on-rest

An frontend Framework for building admin applications on top of REST services, using React, Redux and Material UI.

## Philosophy

This library is like a box of Legos: it contains the components and the instructions, but you'll have to assemble them in order to have a working admin. Don't worry, it's fast. The benefits of this approach are that you can change whatever part you're not satisfied with, and that you can adapt to any RESTful backend dialect without pain.

## Requirements

In order to start building an admin with admin-on-rest, you must be familiar with the following:

* ES6
* React
* React Router
* Redux
* A Redux side effect library (redux-thunk, redux-saga, redux-promise)

## Example

```js
// in app.js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import { crudSaga, CrudRoute, simpleRest } from 'admin-on-rest';
import { CrudApp } from 'admin-on-rest/mui';

import reducer from './reducers';
import PostList from './components/posts/PostList';
import PostEdit from './components/posts/PostEdit';
import PostCreate from './components/posts/PostCreate';
import CommentList from './components/comments/CommentList';
import CommentEdit from './components/comments/CommentEdit';
import CommentCreate from './components/comments/CommentCreate';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, undefined, compose(
    applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
));
sagaMiddleware.run(crudSaga(simpleRest('http://localhost:3000')));

const history = syncHistoryWithStore(hashHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Redirect from="/" to="/posts" />
            <Route path="/" component={CrudApp}>
                <CrudRoute path="posts" list={PostList} edit={PostEdit} create={PostCreate} />
                <CrudRoute path="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
```

```js
// in reducers.js
import { combineReducers } from 'redux';
import { adminReducer } from 'admin-on-rest';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    admin: adminReducer(['comments', 'posts']),
    routing: routerReducer,
});
```

```js
// in PostList.js
import React from 'react';
import { Datagrid, DateField, TextField, EditButton } from 'admin-on-rest/mui';

const PostList = (props) => (
    <Datagrid title="All posts" {...props}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <DateField label="published_at" source="published_at" />
        <TextField label="average_note" source="average_note" />
        <TextField label="views" source="views" />
        <EditButton basePath="/posts" />
    </Datagrid>
);

export default PostList;
```

```js
// in PostEdit.js
import React from 'react';
import { Edit, DateInput, DisabledInput, LongTextInput, TextInput } from 'admin-on-rest/mui';

const PostEdit = (props) => (
    <Edit title="Post detail" {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
        <DisabledInput label="Nb views" source="views" />
    </Edit>
);

export default PostEdit;
```

```js
// in PostCreate.js
import React from 'react';
import { Create, LongTextInput, TextInput } from 'admin-on-rest/mui';

const PostCreate = (props) => (
    <Create title="Create a Post" {...props}>
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <TextInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
    </Create>
);

export default PostCreate;
```

## Configuring your REST flavor

REST isn't a standard, so it's impossible to make a REST client library that will work for all REST backends. Admin-on-rest deals with this problem by letting you specify how the data structure used for the admin translates to the data from your REST backend.

## Side Effects

The library makes no assumption on the side effect library you want to use; but provides examples for redux-saga.

The side effects expected by admin-on-rest are AJAX calls to the REST backend(s), and redirects. They must respond to the following actions:

* CRUD_GET_LIST => CRUD_GET_LIST_SUCCESS
* CRUD_GET_ONE => CRUD_GET_ONE_SUCCESS
* CRUD_UPDATE => CRUD_UPDATE_SUCCESS
* CRUD_CREATE => CRUD_CREATE_SUCCESS
* CRUD_DELETE => CRUD_DELETE_SUCCESS

Check `sideEffect/saga.js` for a detail of the inputs and outputs

## Todo

* Relationships
* Filters
* Complex Field & Input types
