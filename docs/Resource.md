---
layout: default
title: "The Resource Component"
---

# The `<Resource>` component

`<Resource>` components are fundamental building blocks in react-admin apps. They form the skeleton of the application, and of its internal data store. 

In react-admin terms, a *resource* is a string that refers to an entity type (like 'products', 'subscribers', or 'tags'). *Records* are objects with an `id` field, and two records of the same *resource* have the same field structure (e.g. all posts records have a title, a publication date, etc.). 

A `<Resource>` component has 3 responsibilities:

- It defines the page components to use for interacting with the resource records (to display a list of records, the details of a record, or to create a new one).
- It initializes the internal data store so that react-admin components can see it as a mirror of the API for a given resource.
- It creates a context that lets every descendent component know in which resource they are used (this context is called `ResourceContext`).

`<Resource>` components can only be used as children of [the `<Admin>` component](./Admin.md).

## Basic Usage

For instance, the following admin app offers an interface to the resources exposed by the JSONPlaceholder API ([posts](https://jsonplaceholder.typicode.com/posts), [users](https://jsonplaceholder.typicode.com/users), [comments](https://jsonplaceholder.typicode.com/comments), and [tags](https://jsonplaceholder.typicode.com/tags)):

```jsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostList, PostCreate, PostEdit, PostShow, PostIcon } from './posts';
import { UserList } from './posts';
import { CommentList, CommentEdit, CommentCreate, CommentIcon } from './comments';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
        {/* complete CRUD pages for posts */}
        <Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} />
        {/* read-only user list */}
        <Resource name="users" list={UserList} />
        {/* no show page for the comments resource */}
        <Resource name="comments" list={CommentList} create={CommentCreate} edit={CommentEdit} icon={CommentIcon} />
        {/* no standalone page for tags, but the resource is required to display tags in posts */}
        <Resource name="tags" />
    </Admin>
);
```

**Tip**: You must add a `<Resource>` when you declare a reference (via `<ReferenceField>`, `<ReferenceArrayField>`, `<ReferenceManyField>`, `<ReferenceInput>` or `<ReferenceArrayInput>`), because react-admin uses resources to define the data store structure. That's why there is an empty `tags` resource in the example above.

**Tip**: How does a resource map to an API endpoint? The `<Resource>` component doesn't know this mapping - it's [the `dataProvider`'s job](./DataProviders.md) to define it.

## `name`

`name` is the only required prop for a `<Resource>`. React-admin uses the `name` prop both to determine the API endpoint (passed to the `dataProvider`), and to form the URL for the resource.

```jsx
<Resource name="posts" list={PostList} create={PostCreate} edit={PostEdit} show={PostShow} />
```

For this resource react-admin will fetch the `https://jsonplaceholder.typicode.com/posts` endpoint for data.

The routing will map the component as follows:

* `/posts/` maps to `PostList`
* `/posts/create` maps to `PostCreate`
* `/posts/:id` maps to `PostEdit`
* `/posts/:id/show` maps to `PostShow`

**Tip**: If you want to use a special API endpoint (e.g. 'https://jsonplaceholder.typicode.com/my-custom-posts-endpoint') without altering the URL in the react-admin application (so still use `/posts`), write the mapping from the resource `name` (`posts`) to the API endpoint (`my-custom-posts-endpoint`) in your own [`dataProvider`](./Admin.md#dataprovider).

## CRUD Props

`<Resource>` allows you to define a component for each CRUD operation, using the following prop names:

* `list` (if defined, the resource is displayed on the Menu)
* `create`
* `edit`
* `show`

**Tip**: Under the hood, the `<Resource>` component uses [react-router](https://reactrouter.com/web/guides/quick-start) to create several routes:

* `/` maps to the `list` component
* `/create` maps to the `create` component
* `/:id` maps to the `edit` component
* `/:id/show` maps to the `show` component

`<Resource>` also accepts additional props:

* [`name`](#name)
* [`icon`](#icon)
* [`options`](#icon)

## `icon`

React-admin will render the `icon` prop component in the menu:

```jsx
// in src/App.js
import * as React from "react";
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/People';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostList } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
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

## Resource Context

`<Resource>` also creates a `ResourceContext`, that gives access to the current resource name to all descendents of the main page components (`list`, `create`, `edit`, `show`). 

to read the current resource name, use the `useResourceContext()` hook.

For instance, the following component displays the name of the current resource:

```jsx
import * as React from 'react';
import { Datagrid, DateField, TextField, List, useResourceContext } from 'react-admin';

const ResourceName = () => {
    const { resource } = useResourceContext();
    return <>{resource}</>;
}

const PostList = (props) => (
    <List {...props}>
        <>
            <ResourceName /> {/* renders 'posts' */}
            <Datagrid>
                <TextField source="title" />
                <DateField source="published_at" />
            </Datagrid>
        </>
    </List>
)
```

**Tip**: You can *change* the current resource context, e.g. to use a component designed for a related resource inside another entity. Use the `<ResourceContextProvider>` component for that:

```jsx
const MyComponent = () => (
    <ResourceContextProvider value="comments">
        <ResourceName /> {/* renders 'comments' */}
        ...
    </ResourceContextProvider>
);
```

