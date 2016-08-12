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

We'll be using [JSONPlaceholder](http://jsonplaceholder.typicode.com/), which is a Fake Online REST API for Testing and Prototyping, as the datasource for the admin.

JSONPlaceholder provides endpoints for fake posts, fake comments, and fake users. The admin we'll build will allow to Create, Retrieve, Update, and Delete (CRUD) these resources.

Update the `src/App.js` with the following code:

```js
// in src/App.js
import React, { Component } from 'react';

import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

class App extends Component {
  render() {
    return (
        <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
            <Resource name="posts" list={PostList} />
        </Admin>
    );
  }
}

export default App;
```

The App component now renders an `<Admin>` component, which is the main component of admin-on-rest. This component expects a REST client as a parameter - a function capable of translating REST commands into HTTP requests. Since REST isn't a standard, you will probably have to provide a custom client to connect to your own APIs. But we'll dive into rest clients later. For now, let's take advantage of the `jsonServerRestClient`, which speaks the same REST dialect as JSONPlaceholder.

The `<Admin>` component contains `<Resource>` components, each resource being mapped to an endpoint in the API. To begin with, we'll display the list of posts. Here is what the `<PostList>` component looks like:

```js
// in src/posts.js
import React from 'react';
import { Datagrid, TextField } from 'admin-on-rest/lib/mui';

export const PostList = (props) => (
    <Datagrid {...props}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <TextField label="body" source="body" />
    </Datagrid>
);
```

Notice that the components we use here are from `admin-on-rest/lib/mui` - these are Material UI components. The lists consists of a `<Datagrid>` with a bunch of `<TextField>` components, each mapping a different source field in the API response.

That should be enough to display the post list:

![Simple posts datagrid]()

The datagrid is already functional: you can change the ordering by clicking on column headers, or change page by using the bottom pagination controls.

## Field Types

So far, you've only seen `<TextField>`, but if the API sends resources with other types of content, admin-on-rest can provide more features. For instance, [the `/users` endpoint in JSONPlaceholder](http://jsonplaceholder.typicode.com/comments) contains emails. Let's see how the datagrid displays them:

```js
// in src/users.js
import React from 'react';
import { Datagrid, EmailField, TextField } from 'admin-on-rest/lib/mui';

export const UserList = (props) => (
    <Datagrid title="All users" {...props}>
        <TextField label="id" source="id" />
        <TextField label="name" source="name" />
        <TextField label="username" source="username" />
        <EmailField label="email" source="email" />
    </Datagrid>
);
```

You'll notice that we override the default `title` of this datagrid. To include the new `users` resource in the admin app, add it in `src/App.js`:

```js
// in src/App.js
import { PostList } from './posts';
import { UserList } from './users';

class App extends Component {
  render() {
    return (
        <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
            <Resource name="posts" list={PostList} />
            <Resource name="users" list={UserList} />
        </Admin>
    );
  }
}
```

![Simple user datagrid]()

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

Admin-on-REST knows how to take advantage of these foreign keys to fetch references to a given record. For instance, to include the user name in the posts datagrid, use the `<ReferenceField>`:

```js
// in src/posts.js
import React from 'react';
import { Datagrid, TextField, EmailField, ReferenceField } from 'admin-on-rest/lib/mui';

export const PostList = (props) => (
    <Datagrid {...props}>
        <TextField label="id" source="id" />
        <ReferenceField label="User" source="userId" reference="users" referenceSource="name" />
        <TextField label="title" source="title" />
        <TextField label="body" source="body" />
    </Datagrid>
);
```

When displaying the posts list, the browser now fetches related user records, and displays their name.

![reference posts in comment list]()

## Creation and Edition

An admin interface is usually for more than seeing remote data - it's for editing and creating, too. Admin-on-REST provides `<Create>` and `<Edit>` components for that purpose. We'll add them to the `posts` resource:

```js
// in src/posts.js
import React from 'react';
import { Datagrid, Edit, Create, ReferenceField, TextField, EditButton, DisabledInput, LongTextInput, ReferenceInput, TextInput } from 'admin-on-rest/lib/mui';

export const PostList = (props) => (
    <Datagrid {...props}>
        <TextField label="id" source="id" />
        <ReferenceField label="User" source="userId" reference="users" referenceSource="name" />
        <TextField label="title" source="title" />
        <TextField label="body" source="body" />
        <EditButton />
    </Datagrid>
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

Notice the additional `<EditButton>` field in the `<PostList>` component children: that's what gives access to the post edition view.

Just like the `<Datagrid>` component expects field components as children, the `<Edit>` and `<Create>` components expect input components as children. `<DisabledInput>`, `<TextInput>`, `<LongTextInput>`, and `<ReferenceInput>` are such inputs.


## Filters

## Using Another REST Dialect
