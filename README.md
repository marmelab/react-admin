# admin-on-rest

An frontend Framework for building admin applications on top of REST services, using ES6, React and Material UI.

## Example

```js
// in app.js
import React from 'react';
import { render } from 'react-dom';
import { simpleRest } from 'admin-on-rest';
import { Admin, Resource } from 'admin-on-rest/mui';

import Layout from './components/Layout';
import PostList from './components/posts/PostList';
import PostEdit from './components/posts/PostEdit';
import PostCreate from './components/posts/PostCreate';
import CommentList from './components/comments/CommentList';
import CommentEdit from './components/comments/CommentEdit';
import CommentCreate from './components/comments/CommentCreate';

render(
    <Admin restFlavor={simpleRest('http://localhost:3000')} appLayout={Layout}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
        <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} />
    </Admin>,
    document.getElementById('root')
);
```

The `<Resource>` component is a configuration component that allows to define sub components for each of the admin view: `list`, `edit`, and `create`.

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

The `<Admin>` component expects a `restFlavor` parameter, which is an object with two methods:

```js
{
    /**
     * Execute the HTTP request for the action type
     *
     * @param {string} type Action type, e.g CRUD_GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Action parameters. Depends on the action type, see src/actions/dataActions.js for details
     * @returns {Promise} the Promise for a response
     */
    fetch(type, resource, payload) {
        // your logic here
    },

    /**
     * Convert the HTTP response to a payload for the SUCCESS action
     *
     * @param {string} type Action type, e.g CRUD_GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Action parameters. Depends on the action type, see src/actions/dataActions.js for details
     * @param {Object} response The response returned by the rest fetch() promise
     * @returns {Promise} the Promise for a response
     */
    convertResponse(type, resource, payload, response) {
        // your logic here
    },
}
```

Possible action types are those from `src/actions/dataActions.js`:

* `CRUD_GET_LIST`
* `CRUD_GET_ONE`
* `CRUD_GET_MANY`
* `CRUD_CREATE`
* `CRUD_UPDATE`
* `CRUD_DELETE`

Check `src/rest/simple.js` for an example.

The restFlavor is also the ideal place to add custom HTTP headers, authentication, etc.

## Batteries Included But Removable

Although it's fast and easy to build an admin using the `<Admin>` and `<Resource>` components, it is also possible to include the admin logic into an *existing* React application. You are strongly encouraged to use the lower-level elements or admin-to-rest, provided you're familiar with Redux, react-router and redux-saga.

The library makes no assumption on the side effect library you want to use, but provides examples for redux-saga.

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
