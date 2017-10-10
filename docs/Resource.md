---
layout: default
title: "The Resource Component"
---

# The `<Resource>` component

A `<Resource>` component maps one API endpoint to a CRUD interface. For instance, the following admin app offers a read-only interface to the resources exposed by the JSONPlaceholder API at  [`http://jsonplaceholder.typicode.com/posts`](http://jsonplaceholder.typicode.com/posts) and [`http://jsonplaceholder.typicode.com/users`](http://jsonplaceholder.typicode.com/users):

```jsx
// in src/App.js
import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';
import { UserList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} />
        <Resource name="users" list={UserList} />
    </Admin>
);
```

`<Resource>` allows you to define a component for each CRUD operation, using the following prop names:

* `list`
* `create`
* `edit`
* `show`
* `remove`

Here is a more complete admin, with components for all the CRUD operations:

```jsx
import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList, PostCreate, PostEdit, PostShow, PostIcon } from './posts';
import { UserList } from './posts';
import { CommentList, CommentEdit, CommentCreate, CommentIcon } from './comments';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={Delete} icon={PostIcon} />
        <Resource name="users" list={UserList} />
        <Resource name="comments" list={CommentList} create={CommentCreate} edit={CommentEdit} remove={Delete} icon={CommentIcon} />
        <Resource name="tags" />
    </Admin>
);
```

**Tip**: Under the hood, the `<Resource>` component uses react-router to create several routes:

* `/` maps to the `list` component
* `/create` maps to the `create` component
* `/:id/edit` maps to the `edit` component
* `/:id` maps to the `show` component
* `/:id/delete` maps to the `remove` component

**Tip**: You must add a `<Resource>` when you declare a reference (via `<ReferenceField>`, `<ReferenceArrayField>`, `<ReferenceManyField>`, `<ReferenceInput>` or `<ReferenceArrayInput>`), because admin-on-rest uses resources to define the data store structure. That's why there is an empty `tag` resource in the example above.

`<Resource>` also accepts additional props:

* [`name`](#name)
* [`icon`](#icon)
* [`options`](#icon)

## `name`

Admin-on-rest uses the `name` prop both to determine the API endpoint (passed to the `restClient`), and to form the URL for the resource.

```jsx
<Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} remove={PostRemove} />
```

For this resource admin-on-rest will fetch the `http://jsonplaceholder.typicode.com/posts` endpoint for data.

The routing will map the component as follows:

* `/posts/` maps to `PostList`
* `/posts/create` maps to `PostCreate`
* `/posts/:id` maps to `PostEdit`
* `/posts/:id/show` maps to `PostShow`
* `/posts/:id/delete` maps to `PostRemove`

**Tip**: If you want to use a special API endpoint (e.g. 'http://jsonplaceholder.typicode.com/my-custom-posts-endpoint') without altering the URL in the admin-on-rest application (so still use `/posts`), write the mapping from the resource `name` (`posts`) to the API endpoint (`my-custom-posts-endpoint`) in your own [`restClient`](./Admin.md#restclient)

## `icon`

Admin-on-rest will render the `icon` prop component in the menu:

```jsx
// in src/App.js
import React from 'react';
import PostIcon from 'material-ui/svg-icons/action/book';
import UserIcon from 'material-ui/svg-icons/social/group';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import { PostList } from './posts';

const App = () => (
    <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={PostList} icon={PostIcon} />
        <Resource name="users" list={UserList} icon={UserIcon} />
    </Admin>
);
```

## options

`options.label` allows to customize the display name of a given resource in the menu.

{% raw %}
```jsx
<Resource name="v2/posts" options={{ label: 'Posts' }} list={PostList} />
```
{% endraw %}
