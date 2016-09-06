# Admin-on-REST Tutorial

This 15 minutes tutorial will expose how to create a new admin app based on an existing REST API.

## Installation

Admin-on-REST uses React. We'll use Facebook's [react-create-app](https://github.com/facebookincubator/create-react-app) to create an empty React app, and install the `admin-on-rest` npm package:

```sh
npm install -g create-react-app
create-react-app test-admin
cd test-admin/
npm install --save-dev admin-on-rest
npm start
```

You should be up and running with an empty React application on port 3000.

## Making Contact With The API

We'll be using [JSONPlaceholder](http://jsonplaceholder.typicode.com/), which is a fake online REST API for testing and prototyping, as the datasource for the admin.

JSONPlaceholder provides endpoints for fake posts, fake comments, and fake users. The admin we'll build will allow to Create, Retrieve, Update, and Delete (CRUD) these resources.

Replace the `src/App.js` by the following code:

```js
// in src/App.js
import React, { Component } from 'react';

import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

The App component now renders an `<Admin>` component, which is the main component of admin-on-rest. This component expects a REST client as a parameter - a function capable of translating REST commands into HTTP requests. Since REST isn't a standard, you will probably have to provide a custom client to connect to your own APIs. But we'll dive into REST clients later. For now, let's take advantage of the `jsonServerRestClient`, which speaks the same REST dialect as JSONPlaceholder.

The `<Admin>` component contains `<Resource>` components, each resource being mapped to an endpoint in the API. To begin with, we'll display the list of posts. Here is what the `<PostList>` component looks like:

```js
// in src/posts.js
import React from 'react';
import { List, TextField } from 'admin-on-rest/lib/mui';

export const PostList = (props) => (
    <List {...props}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <TextField label="body" source="body" />
    </List>
);
```

Notice that the components we use here are from `admin-on-rest/lib/mui` - these are Material UI components. The lists consists of a `<List>` with a bunch of `<TextField>` components, each mapping a different source field in the API response.

That should be enough to display the post list:

![Simple posts list](http://static.marmelab.com/admin-on-rest/simple_post_list.png)

The list is already functional: you can change the ordering by clicking on column headers, or change pages by using the bottom pagination controls.

## Field Types

So far, you've only seen `<TextField>`, but if the API sends resources with other types of content, admin-on-rest can provide more features. For instance, [the `/users` endpoint in JSONPlaceholder](http://jsonplaceholder.typicode.com/comments) contains emails. Let's see how the list displays them:

```js
// in src/users.js
import React from 'react';
import { List, EmailField, TextField } from 'admin-on-rest/lib/mui';

export const UserList = (props) => (
    <List title="All users" {...props}>
        <TextField label="id" source="id" />
        <TextField label="name" source="name" />
        <TextField label="username" source="username" />
        <EmailField label="email" source="email" />
    </List>
);
```

You'll notice that we override the default `title` of this list. To include the new `users` resource in the admin app, add it in `src/App.js`:

```js
// in src/App.js
import { PostList } from './posts';
import { UserList } from './users';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
        <Resource name="users" list={UserList} />
    </Admin>
);
```

![Simple user datagrid](http://static.marmelab.com/admin-on-rest/simple_user_list.png)

The sidebar now gives access to the second resource, Users. The users list shows the email as a `<a href="mailto:">` tag.

In admin-on-rest, fields are simple React components. At runtime, they receive the `record` they operate on (coming from the API, e.g. `{ "id": 1, "name": "Leanne Graham", "username": "Bret", "email": "Sincere@april.biz" }`), and the `source` field they should display (e.g. 'email'). That means that the code for field components is really simple:

```js
// in admin-on-rest/src/mui/field/EmailField.js
import React, { PropTypes } from 'react';

const EmailField = ({ record = {}, source }) => <a href={`mailto:${record[source]}`}>{record[source]}</a>;

EmailField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default EmailField;
```

Creating your own custom fields shouldn't be too difficult.

## Relationships

In JSONPlaceholder, each `post` record includes a `userId` field, which points to a `user`:

```json
{
    "id": 1,
    "userId": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```

Admin-on-REST knows how to take advantage of these foreign keys to fetch references to a given record. For instance, to include the user name in the posts list, use the `<ReferenceField>`:

```js
// in src/posts.js
import React from 'react';
import { List, TextField, EmailField, ReferenceField } from 'admin-on-rest/lib/mui';

export const PostList = (props) => (
    <List {...props}>
        <TextField label="id" source="id" />
        <ReferenceField label="User" source="userId" reference="users">
            <TextField source="name" />
        </ReferenceField>
        <TextField label="title" source="title" />
        <TextField label="body" source="body" />
    </List>
);
```

When displaying the posts list, the browser now fetches related user records, and displays their name as a `<TextField>`.

![reference posts in comment list](http://static.marmelab.com/admin-on-rest/reference_posts.png)

## Creation and Edition

An admin interface is usually for more than seeing remote data - it's for editing and creating, too. Admin-on-REST provides `<Create>` and `<Edit>` components for that purpose. We'll add them to the `posts` resource:

```js
// in src/posts.js
import React from 'react';
import { List, Edit, Create, ReferenceField, TextField, EditButton, DisabledInput, LongTextInput, ReferenceInput, TextInput } from 'admin-on-rest/lib/mui';

export const PostList = (props) => (
    <List {...props}>
        <TextField label="id" source="id" />
        <ReferenceField label="User" source="userId" reference="users">
            <TextField source="name" />
        </ReferenceField>
        <TextField label="title" source="title" />
        <TextField label="body" source="body" />
        <EditButton />
    </List>
);

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={PostTitle} {...props}>
        <DisabledInput label="Id" source="id" />
        <ReferenceInput label="User" source="userId" reference="users" referenceSource="name" />
        <TextInput label="Title" source="title" />
        <LongTextInput label="Body" source="body" />
    </Edit>
);

export const PostCreate = (props) => (
    <Create {...props}>
        <ReferenceInput label="User" source="userId" reference="users" referenceSource="name" allowEmpty />
        <TextInput label="Title" source="title" />
        <LongTextInput label="Body" source="body" />
    </Create>
);
```

Notice the additional `<EditButton>` field in the `<PostList>` component children: that's what gives access to the post edition view. Also, the `<Edit>` component uses a custom `<PostTitle>` component as title, which shows the way to customize the title of a given view.

Just like the `<List>` component expects *field components* as children, the `<Edit>` and `<Create>` components expect *input components* as children. `<DisabledInput>`, `<TextInput>`, `<LongTextInput>`, and `<ReferenceInput>` are such inputs.

As for the `<ReferenceInput>`, it takes the same attributes as the `<ReferenceField>` that we already used in the list view - except within the `<Create>` component, where it requires an `allowEmpty` attribute.

To use the new `<PostEdit>` and `<PostCreate>` components in the posts resource, just add them as `edit` and `create` attributes to the `<Resource>` component:

```js
// in src/App.js
import { PostList, PostEdit, PostCreate } from './posts';
import { UserList } from './users';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
        // ...
    </Admin>
);
```

Admin-on-rest automatically adds a "create" button on top of the posts list to give access to the `<PostCreate>` component. And the `<EditButton>` renders in each line of the list to give access to the `<PostEdit>` component.

![post list with access to edit and create](http://static.marmelab.com/admin-on-rest/editable_post.png)

The create and edit views render as a form. It's already functional, and automatically issues `POST` and `PUT` requests to the REST API.

![post edition form](http://static.marmelab.com/admin-on-rest/post_edition.png)

**Note**: JSONPlaceholder is a read-only API: although it seems to accept `POST` and `PUT` requests, it doesn't take into account the creations and editions - that's why, in this particular case, you will see errors after creation, and you won't see your editions after you save them.

## Deletion

There is not much to configure in a deletion view. To add removal abilities to a `Resource`, simply use the bundled `<Delete>` component from admin-on-rest using the `remove` attribute ('delete' is a reserved word in JavaScript):

```js
// in src/App.js
import { Delete } from 'admin-on-rest/lib/mui';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
        // ...
    </Admin>
);
```

In the edition view, a new "delete" button appears. And you can also use the `<DeleteButton>` as a field in the list.

![post deletion view](http://static.marmelab.com/admin-on-rest/post_deletion.png)

## Filters

Let's get back to the post list for a minute. It offers sorting and pagination, but one feature is missing: the ability to search content.

Admin-on-rest can use input components to create a multi-criteria search engine in the list view. First, create a `<Filter>` component just like you would with a `<Create>` component, using input components. Then, tell the list to use this filter component using the `filter` attribute:

```js
// in src/posts.js
import { Filter, ReferenceInput, TextInput } from 'admin-on-rest/lib/mui';

const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="userId" reference="users" referenceSource="name" allowEmpty />
    </Filter>
);

export const PostList = (props) => (
    <List {...props} filter={PostFilter}>
        // ...
    </List>
);
```

The first filter, 'q', takes advantage of a full-text functionality offered by JSONPlaceholder. It is `alwaysOn`, so it always appears on the screen. The second filter, 'userId', can be added by the "add filter" button on the top of the list. As it's a `<ReferenceInput>`, it's already populated with possible users. It can be turned off by the end user.

Filters are "search-as-you-type", meaning that when the user enters new values in the filter form, the list refreshes (via an API request) immediately.

![posts search engine](http://static.marmelab.com/admin-on-rest/filters.gif)

## Customizing the Menu Icons

The sidebar menu shows the same icon for both posts and users. Fortunately, customizing the menu icon is just a matter of passing an `icon` attribute to each `<Resource>`:

```js
// in src/App.js
import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} icon={PostIcon} />
        <Resource name="users" list={UserList} icon={UserIcon} />
    </Admin>
);
```

![custom menu icons](http://static.marmelab.com/admin-on-rest/custom_menu.png)

## Using a Custom Home Page

By default, admin-on-rest displays the list view of the first resource as home page. If you want to display a custom component instead, pass it in the `dashboard` attribute of the `<Admin>` component.

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

```js
// in src/App.js
import Dashboard from './Dashboard';

const App = () => (
    <Admin dashboard={Dashboard} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        // ...
    </Admin>
);
```

![Custom home page](http://static.marmelab.com/admin-on-rest/dashboard.png)

## Using Another REST Dialect

Here is the elephant in the room of this tutorial. In real world projects, the REST dialect of your API won't match the JSONPLaceholder dialect. Writing a REST client is probably the first thing you'll have to do to make admin-on-rest work. Depending on your API, this can require a few hours of additional work.

Admin-on-rest delegates every REST calls to a REST client function. This function must simply return a promise for the result. This gives extreme freedom to map any API dialect, add authentication, use endpoints from several domains, etc.

For instance, let's imagine you have to use the my.api.url API, which expects the following parameters:

| Action              | Expected REST request |
|---------------------|---------------------- |
| Get list            | `GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}` |
| Get one record      | `GET http://my.api.url/posts/123` |
| Get several records | `GET http://my.api.url/posts?filter={ids:[123,456,789]}` |
| Update a record     | `PUT http://my.api.url/posts/123` |
| Create a record     | `POST http://my.api.url/posts/123` |
| Delete a record     | `DELETE http://my.api.url/posts/123` |

Admin-on-rest defines custom verbs for each of the actions of this list. Just like HTTP verbs (`GET`, `POST`, etc.), REST verbs qualify a request to a REST server. Admin-on-rest verbs are called `GET_LIST`, `GET_MATCHING`, `GET_ONE`, `GET_MANY`, `CREATE`, `UPDATE`, and `DELETE`. The REST client will have to map each of these verbs to one (or many) HTTP request(s).

The code for an API client for my.api.url is as follows:

```js
// in src/restClient
import {
    GET_LIST,
    GET_MATCHING,
    GET_ONE,
    GET_MANY,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'admin-on-rest';

const API_URL = 'my.api.url';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertRESTRequestToHTTP = (type, resource, params) => {
    let url = '';
    const { queryParameters } = fetchUtils;
    const options = {};
    switch (type) {
    case GET_LIST: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        url = `${API_URL}/${resource}?${queryParameters(query)}`;
        break;
    }
    case GET_MATCHING: {
        const query = {
            filter: JSON.stringify(params.filter),
        };
        url = `${API_URL}/${resource}?${queryParameters(query)}`;
        break;
    }
    case GET_ONE:
        url = `${API_URL}/${resource}/${params.id}`;
        break;
    case GET_MANY: {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        url = `${API_URL}/${resource}?${queryParameters(query)}`;
        break;
    }
    case UPDATE:
        url = `${API_URL}/${resource}/${params.id}`;
        options.method = 'PUT';
        options.body = JSON.stringify(params.data);
        break;
    case CREATE:
        url = `${API_URL}/${resource}`;
        options.method = 'POST';
        options.body = JSON.stringify(params.data);
        break;
    case DELETE:
        url = `${API_URL}/${resource}/${params.id}`;
        options.method = 'DELETE';
        break;
    default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} REST response
 */
const convertHTTPResponseToREST = (response, type, resource, params) => {
    const { headers, json } = response;
    switch (type) {
    case GET_LIST:
        return {
            data: json.map(x => x),
            total: parseInt(headers['content-range'].split('/').pop(), 10),
        };
    case CREATE:
        return { ...params.data, id: json.id };
    default:
        return json;
    }
};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a REST response
 */
export default (type, resource, params) => {
    const { fetchJSON } = fetchUtils;
    const { url, options } = convertRESTRequestToHTTP(type, resource, params);
    return fetchJson(url, options)
        .then(response => convertHTTPResponseToREST(response, type, resource, params));
};
```

Using this client instead of the previous `jsonServerRestClient` is just a matter of switching a function:

```js
// in src/app.js
import myApiRestClient from './restClient';

const App = () => (
    <Admin restClient={myApiRestClient} dashboard={Dashboard}>
        // ...
    </Admin>
);
```

## Conclusion

Admin-on-rest was build with customization in mind. You can use your custom React components everywhere to display a custom list, or a different edition form for a given resource. If you wants to go deeper, read the Material UI components documentation, or dive in the library code.
