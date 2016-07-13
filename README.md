# rest-admin

An frontend Framework for building admin SPAs using REST.

## Philosophy

This library is like a box of Legos: it contains the components and the instructions, but you'll have to assemble them in order to have a working admin. Don't worry, it's fast. The benefits of this approach are that you can change whatever part you're not satisfied with, and that you can adapt to any RESTful backend dialect without pain.

## Requirements

In order to start building an admin with react-admin, you must be familiar with the following:

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

import crudSaga from '../src/sideEffect/saga';
import CrudRoute from '../src/CrudRoute';
import CrudApp from '../src/components/material-ui/CrudApp';

import reducer from './reducers';
import PostList from './components/posts/PostList';
import PostEdit from './components/posts/PostEdit';
import PostCreate from './components/posts/PostCreate';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, undefined, compose(
    applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
));
sagaMiddleware.run(crudSaga('http://localhost:3000'));

const history = syncHistoryWithStore(hashHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Redirect from="/" to="/posts" />
            <Route path="/" component={CrudApp}>
                <CrudRoute path="posts" list={PostList} edit={PostEdit} create={PostCreate} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
```

```js
// in reducers.js
import { combineReducers } from 'redux';
import crud from '../../src/reducer';
import loading from '../../src/loading';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    comments: crud('comments'),
    posts: crud('posts'),
    loading,
    routing: routerReducer,
});
```

```js
// in PostList.js
import React from 'react';
import Datagrid from '../../../src/components/material-ui/list/Datagrid';
import TextField from '../../../src/components/material-ui/field/TextField';
import EditButton from '../../../src/components/material-ui/button/EditButton';

const PostList = (props) => (
    <Datagrid title="All posts" {...props}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <TextField label="published_at" source="published_at" />
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
import Edit from '../../../src/components/material-ui/detail/Edit';
import DisabledInput from '../../../src/components/material-ui/input/DisabledInput';
import TextInput from '../../../src/components/material-ui/input/TextInput';
import LongTextInput from '../../../src/components/material-ui/input/LongTextInput';

const PostEdit = (props) => (
    <Edit title="Post detail" {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <TextInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
        <DisabledInput label="Nb views" source="views" />
    </Edit>
);

export default PostEdit;
```

```js
// in PostCreate.js
import React from 'react';
import Create from '../../../src/components/material-ui/detail/Create';
import TextInput from '../../../src/components/material-ui/input/TextInput';
import LongTextInput from '../../../src/components/material-ui/input/LongTextInput';

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

## Side Effects

The library makes no assumption on the side effect library you want to use; but provides examples for redux-saga.

The side effects expected by rest-admin are AJAX calls to the REST backend(s), and redirects. They must respond to the following actions:

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
