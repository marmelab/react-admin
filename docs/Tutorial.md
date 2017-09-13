---
layout: default
title: "My First Project Tutorial"
---

# Admin-on-REST Tutorial

This 15 minutes tutorial will expose how to create a new admin app based on an existing REST API.

![admin-on-rest blog demo](http://static.marmelab.com/admin-on-rest.gif)

## Installation

Admin-on-REST uses React. We'll use Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app) to create an empty React app, and install the `admin-on-rest` package:

```sh
npm install -g create-react-app
create-react-app test-admin
cd test-admin/
yarn add admin-on-rest
yarn start
```

You should be up and running with an empty React application on port 3000.

## Making Contact With The API

We'll be using [JSONPlaceholder](http://jsonplaceholder.typicode.com/), a fake REST API designed for testing and prototyping, as the datasource for the admin.

```
curl http://jsonplaceholder.typicode.com/posts/12
```

```json
{
  "id": 12,
  "title": "in quibusdam tempore odit est dolorem",
  "body": "itaque id aut magnam\npraesentium quia et ea odit et ea voluptas et\nsapiente quia nihil amet occaecati quia id voluptatem\nincidunt ea est distinctio odio",
  "userId": 2
}
```

JSONPlaceholder provides endpoints for posts, comments, and users. The admin we'll build will allow to Create, Retrieve, Update, and Delete (CRUD) these resources.

Replace the `src/App.js` by the following code:

```jsx
// in src/App.js
import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

export default App;
```

The `App` component now renders an `<Admin>` component, which is the main component of admin-on-rest. This component expects a REST client as a parameter - a function capable of translating REST commands into HTTP requests. Since REST isn't a standard, you will probably have to provide a custom client to connect to your own APIs. But we'll dive into REST clients later. For now, let's take advantage of the `jsonServerRestClient`, which speaks the same REST dialect as JSONPlaceholder.

The `<Admin>` component can contain one or more `<Resource>` components, each resource being mapped to an endpoint in the API. To begin with, we'll display the list of posts. Here is what the `<PostList>` component looks like:

```jsx
// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField } from 'admin-on-rest';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```

The main component of the post list is a `<List>` component, responsible for grabbing the information from the API, displaying the page title, and handling pagination. This list then delegates the display of the actual list of posts to a `<Datagrid>`, responsible for displaying a table with one row for each post. The datagrid uses its child components (here, a list of `<TextField>`) to determine the columns to render. Each Field component maps a different field in the API response, specified by the `source` prop.

That's enough to display the post list:

![Simple posts list](./img/simple-post-list.png)

The list is already functional: you can reorder it by clicking on column headers, or change pages by using the bottom pagination controls.

## Field Types

You've just met the `<TextField>` component, but admin-on-rest provides many Field components to map various content types. For instance, [the `/users` endpoint in JSONPlaceholder](http://jsonplaceholder.typicode.com/users) contains emails.

```
curl http://jsonplaceholder.typicode.com/users/2
```

```json
{
  "id": 2,
  "name": "Ervin Howell",
  "username": "Antonette",
  "email": "Shanna@melissa.tv",
  "address": {
    "street": "Victor Plains",
    "suite": "Suite 879",
    "city": "Wisokyburgh",
    "zipcode": "90566-7771",
    "geo": {
      "lat": "-43.9509",
      "lng": "-34.4618"
    }
  },
  "phone": "010-692-6593 x09125",
  "website": "anastasia.net",
  "company": {
    "name": "Deckow-Crist",
    "catchPhrase": "Proactive didactic contingency",
    "bs": "synergize scalable supply-chains"
  }
}
```

Let's create a new `UserList`, using `<EmailField>` to map the `email` field:

```jsx
// in src/users.js
import React from 'react';
import { List, Datagrid, EmailField, TextField } from 'admin-on-rest';

export const UserList = (props) => (
    <List title="All users" {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
        </Datagrid>
    </List>
);
```

You'll notice that this list overrides the default `title`. To include the new `users` resource in the admin app, add it in `src/App.js`:

```jsx
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

![Simple user datagrid](./img/simple-user-list.png)

The sidebar now gives access to the second resource, Users. The users list shows the email as a `<a href="mailto:">` tag.

In admin-on-rest, fields are simple React components. At runtime, they receive the `record` fetched from the API on (e.g. `{ "id": 2, "name": "Ervin Howell", "username": "Antonette", "email": "Shanna@melissa.tv", ... }`), and the `source` field they should display (e.g. 'email').

That means that writing a custom Field component is really simple. For instance, to create an `UrlField`:

```jsx
// in admin-on-rest/src/mui/field/UrlField.js
import React from 'react';
import PropTypes from 'prop-types';

const UrlField = ({ record = {}, source }) =>
    <a href={record[source]}>
        {record[source]}
    </a>;

UrlField.propTypes = {
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

export default UrlField;
```

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

Admin-on-REST knows how to take advantage of these foreign keys to fetch references. For instance, to include the user name in the posts list, use the `<ReferenceField>`:

```jsx
// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField, EmailField, ReferenceField } from 'admin-on-rest';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField label="User" source="userId" reference="users">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```

When displaying the posts list, the app now fetches related user records, and displays their `name` as a `<TextField>`. Notice the `label` property: you can use it on any field component to customize the field label.

![reference posts in comment list](./img/reference-posts.png)

**Tip**: Reference components always pass the data they fetch to a child component, which is responsible for displaying the data.

## Creation and Editing


An admin interface is about displaying remote data, but also about editing and creating. Admin-on-REST provides `<Create>` and `<Edit>` components for that purpose. Add them to the `posts` script:

```jsx
// in src/posts.js
import React from 'react';
import { List, Edit, Create, Datagrid, ReferenceField, TextField, EditButton, DisabledInput, LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'admin-on-rest';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField label="User" source="userId" reference="users">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="title" />
            <TextField source="body" />
            <EditButton />
        </Datagrid>
    </List>
);

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput label="User" source="userId" reference="users">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="title" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="title" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);
```

Notice the additional `<EditButton>` field in the `<PostList>` children: that's what gives access to the post editing page. Also, the `<Edit>` component uses a custom `<PostTitle>` component as title, which shows the way to customize the title for a given page.

If you've understood the `<List>` component, the `<Edit>` and `<Create>` components will be no surprise. They are responsible for fetching the record, and displaying the page title. They pass the record down to the `<SimpleForm>` component, which is responsible for the form layout, default values, and validation. Just like `<Datagrid>`, `<SimpleForm>` uses its children to determine the form inputs to display. It expects *input components* as children. `<DisabledInput>`, `<TextInput>`, `<LongTextInput>`, and `<ReferenceInput>` are such inputs.

As for the `<ReferenceInput>`, it takes the same props as the `<ReferenceField>` (used earlier in the list page). `<ReferenceInput>` uses these props to fetch the API for possible references related to the current record (in this case, possible `users` for the current `post`). It then passes these possible references to the child component (`<SelectInput>`), which is responsible for displaying them (via their `name` in that case), and letting the user select one. `<SelectInput>` renders as a `<select>` tag in HTML.

**Tip**: The `<Edit>` and the `<Create>` components use the same `<ReferenceInput>` configuration, except for the `allowEmpty` attribute, which is required in `<Create>`.

To use the new `<PostEdit>` and `<PostCreate>` components in the posts resource, just add them as `edit` and `create` attributes in the `<Resource>` component:

```jsx
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

![post list with access to edit and create](./img/editable-post.png)

The form rendered in the create and edit pages is already functional. It issues `POST` and `PUT` requests to the REST API upon submission.

![post edition form](./img/post-edition.png)

**Note**: JSONPlaceholder is a read-only API; although it seems to accept `POST` and `PUT` requests, it doesn't take into account the creations and edits - that's why, in this particular case, you will see errors after creation, and you won't see your edits after you save them. It's just an artifact of JSONPlaceholder.

## Deletion

There is not much to configure in a deletion view. To add removal abilities to a `Resource`, simply use the bundled `<Delete>` component from admin-on-rest, and register it using the `remove` prop ('delete' is a reserved word in JavaScript):

```jsx
// in src/App.js
import { Delete } from 'admin-on-rest';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
        // ...
    </Admin>
);
```

In the edit view, a new "delete" button appears. And you can also use the `<DeleteButton>` as a field in the list.

![post deletion view](./img/post-deletion.png)

## Filters

Let's get back to the post list for a minute. It offers sorting and pagination, but one feature is missing: the ability to search content.

Admin-on-rest can use input components to create a multi-criteria search engine in the list view. First, create a `<Filter>` component just like you would write a `<SimpleForm>` component, using input components as children. Then, add it to the list using the `filters` prop:

```jsx
// in src/posts.js
import { Filter, ReferenceInput, SelectInput, TextInput } from 'admin-on-rest';

const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export const PostList = (props) => (
    <List {...props} filters={<PostFilter />}>
        // ...
    </List>
);
```

The first filter, 'q', takes advantage of a full-text functionality offered by JSONPlaceholder. It is `alwaysOn`, so it always appears on the screen. The second filter, 'userId', can be added by way of the "add filter" button, located on the top of the list. As it's a `<ReferenceInput>`, it's already populated with possible users. It can be turned off by the end user.

Filters are "search-as-you-type", meaning that when the user enters new values in the filter form, the list refreshes (via an API request) immediately.

![posts search engine](./img/filters.gif)

## Customizing the Menu Icons

The sidebar menu shows the same icon for both posts and users. Fortunately, customizing the menu icon is just a matter of passing an `icon` attribute to each `<Resource>`:

```jsx
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

![custom menu icons](./img/custom-menu.png)

## Using a Custom Home Page

By default, admin-on-rest displays the list page of the first resource as home page. If you want to display a custom component instead, pass it in the `dashboard` prop of the `<Admin>` component.

{% raw %}
```jsx
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

```jsx
// in src/App.js
import Dashboard from './Dashboard';

const App = () => (
    <Admin dashboard={Dashboard} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        // ...
    </Admin>
);
```

![Custom home page](./img/dashboard.png)

## Adding a Login Page

Most admin apps require authentication. Admin-on-rest can check user credentials before displaying a page, and redirect to a login form when the REST API returns a 403 error code.

*What* those credentials are, and *how* to get them, are questions that you must answer. Admin-on-rest makes no assumption about your authentication strategy (basic auth, OAuth, custom route, etc), but gives you the hooks to plug your logic at the right place - by calling an `authClient` function.

For this tutorial, since there is no public authentication API we can use, let's use a fake authentication provider that accepts every login request, and stores the `username` in `localStorage`. Each page change will require that `localStorage` contains a `username` item.

The `authClient` is a simple function, which must return a `Promise`:

```jsx
// in src/authClient.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'admin-on-rest';

export default (type, params) => {
    // called when the user attempts to log in
    if (type === AUTH_LOGIN) {
        const { username } = params;
        localStorage.setItem('username', username);
        // accept all username/password combinations
        return Promise.resolve();
    }
    // called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('username');
        return Promise.resolve();
    }
    // called when the API returns an error
    if (type === AUTH_ERROR) {
        const { status } = params;
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (type === AUTH_CHECK) {
        return localStorage.getItem('username') ? Promise.resolve() : Promise.reject();
    }
    return Promise.reject('Unknown method');
};
```

**Tip**: As the `restClient` response is asynchronous, you can easily fetch an authentication server in there.

To enable this authentication strategy, pass the client as the `authClient` prop in the `<Admin>` component:

```jsx
// in src/App.js
import Dashboard from './Dashboard';
import authClient from './authClient';

const App = () => (
    <Admin authClient={authClient} restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        // ...
    </Admin>
);
```

Once the app reloads, it's now behind a login form that accepts everyone:

![Login form](./img/login.gif)

## Responsive List

The admin-on-rest layout is already responsive. Try to resize your browser to see how the sidebar switches to a drawer on smaller screens.

But a responsive layout is not enough to make a responsive app. Datagrid components work well on desktop, but are absolutely not adapted to mobile devices. If your admin must be used on mobile devices, you'll have to provide an alternative component for small screens

First, you should know that you don't have to use the `<Datagrid>` component as `<List>` child. You can use any other component you like. For instance, the `<SimpleList>` component:

```jsx
// in src/posts.js
import React from 'react';
import { List, SimpleList } from 'admin-on-rest';

export const PostList = (props) => (
    <List {...props}>
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
            tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
        />
    </List>
);
```

The `<SimpleList>` component uses [material-ui's `<List>` and `<ListItem>` components](http://www.material-ui.com/#/components/list), and expects functions as `primaryText`, `secondaryText`, and `tertiaryText` props.

<img src="./img/mobile-post-list.png" alt="Mobile post list" style="display:block;margin:2em auto;box-shadow:none;filter:drop-shadow(13px 12px 7px rgba(0,0,0,0.5));" />

That works fine on mobile, but now the desktop user experience is worse. The best compromise would be to use `<SimpleList>` on small screens, and `<Datagrid>` on other screens. That's where the `<Responsive>` component comes in:

```jsx
// in src/posts.js
import React from 'react';
import { List, Responsive, SimpleList, Datagrid, TextField, ReferenceField, EditButton } from 'admin-on-rest';

export const PostList = (props) => (
    <List {...props}>
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            }
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <ReferenceField label="User" source="userId" reference="users">
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="title" />
                    <TextField source="body" />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
);
```

This works exactly the way you expect. The lesson here is that admin-on-rest takes care of responsive web design for the layout, but it's your job to use `<Responsive>` in pages.

![Responsive List](./img/responsive-list.gif)

## Using Another REST Dialect

Here is the elephant in the room of this tutorial. In real world projects, the REST dialect of your API won't match the JSONPLaceholder dialect. Writing a REST client is probably the first thing you'll have to do to make admin-on-rest work. Depending on your API, this can require a few hours of additional work.

Admin-on-rest delegates every REST call to a REST client function. This function must simply return a promise for the result. This gives extreme freedom to map any API dialect, add authentication headers, use endpoints from several domains, etc.

For instance, let's imagine you have to use the my.api.url API, which expects the following parameters:

| Action              | Expected REST request |
|---------------------|---------------------- |
| Get list            | `GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}` |
| Get one record      | `GET http://my.api.url/posts/123` |
| Get several records | `GET http://my.api.url/posts?filter={ids:[123,456,789]}` |
| Update a record     | `PUT http://my.api.url/posts/123` |
| Create a record     | `POST http://my.api.url/posts/123` |
| Delete a record     | `DELETE http://my.api.url/posts/123` |

Admin-on-rest defines custom verbs for each of the actions of this list. Just like HTTP verbs (`GET`, `POST`, etc.), REST verbs qualify a request to a REST server. Admin-on-rest verbs are called `GET_LIST`, `GET_ONE`, `GET_MANY`, `CREATE`, `UPDATE`, and `DELETE`. The REST client will have to map each of these verbs to one (or many) HTTP request(s).

The code for an API client for my.api.url is as follows:

```jsx
// in src/restClient
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'admin-on-rest';
import { stringify } from 'query-string';

const API_URL = 'my.api.url';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertRESTRequestToHTTP = (type, resource, params) => {
    let url = '';
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
        url = `${API_URL}/${resource}?${stringify(query)}`;
        break;
    }
    case GET_ONE:
        url = `${API_URL}/${resource}/${params.id}`;
        break;
    case GET_MANY: {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        url = `${API_URL}/${resource}?${stringify(query)}`;
        break;
    }
    case GET_MANY_REFERENCE: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
            filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
        };
        url = `${API_URL}/${resource}?${stringify(query)}`;
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
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        };
    case CREATE:
        return { data: { ...params.data, id: json.id } };
    default:
        return { data: json };
    }
};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a REST response
 */
export default (type, resource, params) => {
    const { fetchJson } = fetchUtils;
    const { url, options } = convertRESTRequestToHTTP(type, resource, params);
    return fetchJson(url, options)
        .then(response => convertHTTPResponseToREST(response, type, resource, params));
};
```

Using this client instead of the previous `jsonServerRestClient` is just a matter of switching a function:

```jsx
// in src/app.js
import myApiRestClient from './restClient';

const App = () => (
    <Admin restClient={myApiRestClient} dashboard={Dashboard}>
        // ...
    </Admin>
);
```

## Conclusion

Admin-on-rest was built with customization in mind. You can replace any admin-on-rest component with a component of your own, for instance to display a custom list layout, or a different edit form for a given resource.

Now that you've completed the tutorial, continue reading the [admin-on-rest documentation](http://marmelab.com/admin-on-rest/), and read the [Material UI components documentation](http://www.material-ui.com/#/).
