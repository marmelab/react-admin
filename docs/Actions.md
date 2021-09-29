---
layout: default
title: "Querying the API"
---

# Querying the API

Admin interfaces often have to query the API beyond CRUD requests. For instance, a user profile page may need to get the User object based on a user id. Or, users may want to "Approve" a comment by pressing a button, and this action should update the `is_approved` property and save the updated record in one click.

React-admin provides special hooks to emit read and write queries to the [`dataProvider`](./DataProviders.md), which in turn sends requests to your API.

## `useDataProvider` Hook

React-admin stores the `dataProvider` object in a React context, so it's available from anywhere in your application code. The `useDataProvider` hook exposes the Data Provider to let you call it directly.

For instance, here is how to query the Data Provider for the current user profile:

```jsx
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDataProvider, Loading, Error } from 'react-admin';

const UserProfile = ({ userId }) => {
    const dataProvider = useDataProvider();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        dataProvider.getOne('users', { id: userId })
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!user) return null;

    return (
        <ul>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
        </ul>
    )
};
```

**Tip**: The `dataProvider` returned by the hook is actually a *wrapper* around your Data Provider. This wrapper updates the Redux store on success, and keeps track of the loading state. In case you don't want to update the Redux store (e.g. when implementing an autosave feature), you should access the raw, non-wrapped Data Provider from the `DataProviderContext`:

```diff
import * as React from 'react';
-import { useState, useEffect } from 'react';
+import { useState, useEffect, useContext } from 'react';
-import { useDataProvider, Loading, Error } from 'react-admin';
+import { DataProviderContext, Loading, Error } from 'react-admin';

const UserProfile = ({ userId }) => {
-   const dataProvider = useDataProvider();
+   const dataProvider = useContext(DataProviderContext);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        dataProvider.getOne('users', { id: userId })
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!user) return null;

    return (
        <ul>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
        </ul>
    )
};
```

**Tip**: If you use TypeScript, you can specify a record type for more type safety:

```jsx
dataProvider.getOne<Product>('users', { id: 123 })
    .then(({ data }) => {
        //     \- type of data is Product
        // ...
    })
```

## `useQuery` Hook

The `useQuery` hook calls the Data Provider on mount, and returns an object that updates as the response arrives. It reduces the boilerplate code for calling the Data Provider.

For instance, the previous code snippet can be rewritten with `useQuery` as follows:

```jsx
import * as React from "react";
import { useQuery, Loading, Error } from 'react-admin';

const UserProfile = ({ userId }) => {
    const { data, loading, error } = useQuery({ 
        type: 'getOne',
        resource: 'users',
        payload: { id: userId }
    });

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!data) return null;

    return (
        <ul>
            <li>Name: {data.name}</li>
            <li>Email: {data.email}</li>
        </ul>
    )
};
```

`useQuery` expects a Query argument with the following keys:

- `type`: The method to call on the Data Provider, e.g. `getList`
- `resource`: The Resource name, e.g. "posts"
- `payload`: The query parameters. Depends on the query type.

The return value of `useQuery` is an object representing the query state, using the following keys:

- `data`: `undefined` until the response arrives, then contains the `data` key in the `dataProvider` response
- `total`: `null` until the response arrives, then contains the `total` key in the `dataProvider` response (only for `getList` and `getManyReference` types)
- `error`: `null` unless the `dataProvider` threw an error, in which case it contains that error.
- `loading`: A boolean updating according to the request state
- `loaded`: A boolean updating according to the request state
- `refetch`: A function you can call to trigger a refetch. It's different from the `refresh` function returned by `useRefresh` as it won't trigger a refresh of the view, only this specific query.

This object updates according to the request state:

- start: `{ loading: true, loaded: false, refetch }`
- success: `{ data: [data from response], total: [total from response], loading: false, loaded: true, refetch }`
- error: `{ error: [error from response], loading: false, loaded: false, refetch }`

As a reminder, here are the read query types handled by Data Providers:

| Type               | Usage                                           | Params format                                                                                                                                   | Response format                      |
| ------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `getList`          | Search for resources                            | `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`                                | `{ data: {Record[]}, total: {int} }` |
| `getOne`           | Read a single resource, by id                   | `{ id: {mixed} }`                                                                                                                               | `{ data: {Record} }`                 |
| `getMany`          | Read a list of resource, by ids                 | `{ ids: {mixed[]} }`                                                                                                                            | `{ data: {Record[]} }`               |
| `getManyReference` | Read a list of resources related to another one | `{ target: {string}, id: {mixed}, pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }` | `{ data: {Record[]} }`               |

## `useQueryWithStore` Hook

React-admin exposes a more powerful version of `useQuery`. `useQueryWithStore` persist the response from the `dataProvider` in the internal react-admin Redux store, so that result remains available if the hook is called again in the future.

You can use this hook to show the cached result immediately on mount, while the updated result is fetched from the API. This is called optimistic rendering.

```diff
import * as React from "react";
-import { useQuery, Loading, Error } from 'react-admin';
+import { useQueryWithStore, Loading, Error } from 'react-admin';

const UserProfile = ({ record }) => {
-   const { loaded, error, data } = useQuery({
+   const { loaded, error, data } = useQueryWithStore({
        type: 'getOne',
        resource: 'users',
        payload: { id: record.id }
    });
    if (!loaded) { return <Loading />; }
    if (error) { return <Error />; }
    return <div>User {data.username}</div>;
};
```

In practice, react-admin uses `useQueryWithStore` instead of `useQuery` everywhere, and you should probably do the same in your components. It really improves the User Experience, with only one little drawback: if the data changed on the backend side between two calls for the same query, the user may briefly see outdated data before the screen updates with the up-to-date data. 

Just like `useQuery`, `useQueryWithStore` also returns a `refetch` function you can call to trigger a refetch. It's different from the `refresh` function returned by `useRefresh` as it won't trigger a refresh of the view, only this specific query.

## `useMutation` Hook

`useQuery` emits the request to the `dataProvider` as soon as the component mounts. To emit the request based on a user action, use the `useMutation` hook instead. This hook takes the same arguments as `useQuery`, but returns a callback that emits the request when executed.

Here is an implementation of an "Approve" button:

```jsx
import * as React from "react";
import { useMutation, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [approve, { loading }] = useMutation({
        type: 'update',
        resource: 'comments',
        payload: { id: record.id, data: { isApproved: true } }
    });
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

`useMutation` expects a Query argument with the following keys:

- `type`: The method to call on the Data Provider, e.g. `update`
- `resource`: The Resource name, e.g. "posts"
- `payload`: The query parameters. Depends on the query type.

The return value of `useMutation` is an array with the following items:

- A callback function
- An object representing the query state, using the following keys
    - `data`: `undefined` until the response arrives, then contains the `data` key in the `dataProvider` response
    - `error`: `null` unless the `dataProvider` threw an error, in which case it contains that error.
    - `loading`: A boolean updating according to the request state
    - `loaded`: A boolean updating according to the request state

This object updates according to the request state:

- mount: `{ loading: false, loaded: false }`
- mutate called: `{ loading: true, loaded: false }`
- success: `{ data: [data from response], total: [total from response], loading: false, loaded: true }`
- error: `{ error: [error from response], loading: false, loaded: false }`

You can destructure the return value of the `useMutation` hook as `[mutate,  { data, total, error, loading, loaded }]`.

As a reminder, here are the write query types handled by data providers:

| Type         | Usage                     | Params format                                             | Response format                                       |
| ------------ | ------------------------- | --------------------------------------------------------- | ----------------------------------------------------- |
| `create`     | Create a single resource  | `{ data: {Object} }`                                      | `{ data: {Record} }`                                  |
| `update`     | Update a single resource  | `{ id: {mixed}, data: {Object}, previousData: {Object} }` | `{ data: {Record} }`                                  |
| `updateMany` | Update multiple resources | `{ ids: {mixed[]}, data: {Object} }`                      | `{ data: {mixed[]} }` The ids which have been updated |
| `delete`     | Delete a single resource  | `{ id: {mixed}, previousData: {Object} }`                 | `{ data: {Record} }`                                  |
| `deleteMany` | Delete multiple resources | `{ ids: {mixed[]} }`                                      | `{ data: {mixed[]} }` The ids which have been deleted |

`useMutation` accepts a variant call where the parameters are passed to the callback instead of when calling the hook. Use this variant when some parameters are only known at call time.

```jsx
import * as React from "react";
import { useMutation, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [mutate, { loading }] = useMutation();
    const approve = event => mutate({
        type: 'update',
        resource: 'comments',
        payload: {
            id: event.target.dataset.id,
            data: { isApproved: true, updatedAt: new Date() }
        },
    });
    return <Button
        label="Approve"
        onClick={approve}
        disabled={loading}
    />;
};
```

**Tip**: In the example above, the callback returned by `useMutation` accepts a Query parameter. But in the previous example, it was called with a DOM Event as parameter (because it was passed directly as `onClick` handler). `useMutation` is smart enough to ignore a call time argument if it's an instance of `Event`.

**Tip**: User actions usually trigger write queries - that's why this hook is called `useMutation`. 

## Specialized Hooks

React-admin provides one hook for each of the Data Provider methods. Based on `useQuery` and `useMutation`, they are useful shortcuts that make your code more readable and more robust (no more method name passed as string).

For instance, here is an example using `useUpdate()`:

```jsx
import * as React from "react";
import { useUpdate, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [approve, { loading }] = useUpdate('comments', record.id, { isApproved: true }, record);
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

The specialized hooks based on `useQuery` (`useGetList`, `useGetOne`, `useGetMany`, `useGetManyReference`) execute on mount. The specialized hooks based on `useMutation` (`useCreate`, `useUpdate`, `useUpdateMany`, `useDelete`, `useDeleteMany`) return a callback.

**Tip**: If you use TypeScript, you can specify the record type for more type safety:

```jsx
const { data, loaded } = useGetOne<Product>('products', 123);
//        \- type of data is Product
```

### `useGetList`

```jsx
// syntax
const { data, ids, total, loading, loaded, error, refetch } = useGetList(resource, pagination, sort, filter, options);

// example
import { useGetList } from 'react-admin';
const LatestNews = () => {
    const { data, ids, loading, error } = useGetList(
        'posts',
        { page: 1, perPage: 10 },
        { field: 'published_at', order: 'DESC' }
    );
    if (loading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {ids.map(id =>
                <li key={id}>{data[id].title}</li>
            )}
        </ul>
    );
};
```

### `useGetOne`

```jsx
// syntax
const { data, loading, loaded, error, refetch } = useGetOne(resource, id, options);

// example
import { useGetOne } from 'react-admin';
const UserProfile = ({ record }) => {
    const { data, loading, error } = useGetOne('users', record.id);
    if (loading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

### `useGetMany`

```jsx
// syntax
const { data, loading, loaded, error, refetch } = useGetMany(resource, ids, options);

// example
import { useGetMany } from 'react-admin';
const PostTags = ({ record }) => {
    const { data, loading, error } = useGetMany('tags', record.tagIds);
    if (loading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
         <ul>
             {data.map(tag => (
                 <li key={tag.id}>{tag.name}</li>
             ))}
         </ul>
     );
};
```

### `useGetManyReference`

```jsx
// syntax
const { data, ids, total, loading, loaded, error, refetch } = useGetManyReference(resource, target, id, pagination, sort, filter, referencingResource, options);

// example
import { useGetManyReference } from 'react-admin';
const PostComments = ({ post_id }) => {
    const { data, ids, loading, error } = useGetManyReference(
        'comments',
        'post_id',
        post_id,
        { page: 1, perPage: 10 },
        { field: 'published_at', order: 'DESC' },
        {},
        'posts',
    );
    if (loading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {ids.map(id =>
                <li key={id}>{data[id].body}</li>
            )}
        </ul>
    );
};
```

### `useCreate`

```jsx
// syntax
const [create, { data, loading, loaded, error }] = useCreate(resource, data, options);
```

The `create()` function can be called in 3 different ways:
 - with the same parameters as the `useCreate()` hook: `create(resource, data, options)`
 - with the same syntax as `useMutation`: `create({ resource, payload: { data } }, options)`
 - with no parameter (if they were already passed to `useCreate()`): `create()`

```jsx
// set params when calling the update callback
import { useCreate } from 'react-admin';

const LikeButton = ({ record }) => {
    const like = { postId: record.id };
    const [create, { loading, error }] = useCreate();
    const handleClick = () => {
        create('likes', like)
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={handleClick}>Like</button>;
};

// set params when calling the hook
import { useCreate } from 'react-admin';

const LikeButton = ({ record }) => {
    const like = { postId: record.id };
    const [create, { loading, error }] = useCreate('likes', like);
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={create}>Like</button>;
};
```

### `useUpdate`

```jsx
// syntax
const [update, { data, loading, loaded, error }] = useUpdate(resource, id, data, previousData, options);
```

The `update()` method can be called in 3 different ways:
 - with the same parameters as the `useUpdate()` hook: `update(resource, id, data, previousData, options)`
 - with the same syntax as `useMutation`: `update({ resource, payload: { id, data, previousData } }, options)`
 - with no parameter (if they were already passed to useUpdate()): `update()`

```jsx
// set params when calling the update callback
import { useUpdate } from 'react-admin';

const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
    const [update, { loading, error }] = useUpdate();
    const handleClick = () => {
        update('likes', record.id, diff, record)
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={handleClick}>Like</button>;
};

// or set params when calling the hook
import { useUpdate } from 'react-admin';

const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
    const [update, { loading, error }] = useUpdate('likes', record.id, diff, record);
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={update}>Like</button>;
};
```

### `useUpdateMany`

```jsx
// syntax
const [updateMany, { data, loading, loaded, error }] = useUpdateMany(resource, ids, data, options);
```

The `updateMany()` function can be called in 3 different ways:
 - with the same parameters as the `useUpdateMany()` hook: `update(resource, ids, data, options)`
 - with the same syntax as `useMutation`: `update({ resource, payload: { ids, data } }, options)`
 - with no parameter (if they were already passed to `useUpdateMany()`): `updateMany()`

```jsx
// set params when calling the updateMany callback
import { useUpdateMany } from 'react-admin';

const BulkResetViewsButton = ({ selectedIds }) => {
    const [updateMany, { loading, error }] = useUpdateMany();
    const handleClick = () => {
        updateMany('posts', selectedIds, { views: 0 });
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={handleClick}>Reset views</button>;
};

// set params when calling the hook
import { useUpdateMany } from 'react-admin';

const BulkResetViewsButton = ({ selectedIds }) => {
    const [updateMany, { loading, error }] = useUpdateMany('posts', selectedIds, { views: 0 });
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={updateMany}>Reset views</button>;
};
```

### `useDelete`

```jsx
// syntax
const [deleteOne, { data, loading, loaded, error }] = useDelete(resource, id, previousData, options);
```

The `deleteOne()` function can be called in 3 different ways:
 - with the same parameters as the `useDelete()` hook: `deleteOne(resource, id, previousData, options)`
 - with the same syntax as `useMutation`: `deleteOne({ resource, payload: { id, previousData } }, options)`
 - with no parameter (if they were already passed to `useDelete()`): `deleteOne()`

```jsx
// set params when calling the deleteOne callback
import { useDelete } from 'react-admin';

const DeleteButton = ({ record }) => {
    const [deleteOne, { loading, error }] = useDelete();
    const handleClick = () => {
        deleteOne('likes', record.id, record)
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={handleClick}>Delete</button>;
};

// set params when calling the hook
import { useDelete } from 'react-admin';

const DeleteButton = ({ record }) => {
    const [deleteOne, { loading, error }] = useDelete('likes', record.id, record);
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={deleteOne}>Delete</button>;
};
```

### `useDeleteMany`

```jsx
// syntax
const [deleteMany, { data, loading, loaded, error }] = useDeleteMany(resource, ids, options);
```

The `deleteMany()` function can be called in 3 different ways:
 - with the same parameters as the `useDeleteMany()` hook: `deleteMany(resource, ids, options)`
 - with the same syntax as `useMutation`: `deleteMany({ resource, payload: { ids } }, options)`
 - with no parameter (if they were already passed to `useDeleteMany()`): `deleteMany()`

```jsx
// set params when calling the dleteMany callback
import { useDeleteMany } from 'react-admin';

const BulkDeletePostsButton = ({ selectedIds }) => {
    const [deleteMany, { loading, error }] = useDeleteMany();
    const handleClick = () => {
        deleteMany('posts', selectedIds)
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={deleteMany}>Delete selected posts</button>;
};

// set params when calling the hook
import { useDeleteMany } from 'react-admin';

const BulkDeletePostsButton = ({ selectedIds }) => {
    const [deleteMany, { loading, error }] = useDeleteMany('posts', selectedIds);
    if (error) { return <p>ERROR</p>; }
    return <button disabled={loading} onClick={deleteMany}>Delete selected posts</button>;
};
```

## Synchronizing Dependant Queries
`useQuery` and all its corresponding specialized hooks support an `enabled` option. This is useful if you need to have a query executed only when a condition is met. For example, in the following example, we only fetch the categories if we have at least one post:
```jsx
// fetch posts
const { ids, data: posts, loading: isLoading } = useGetList(
    'posts',
    { page: 1, perPage: 20 },
    { field: 'name', order: 'ASC' },
    {}
);

// then fetch categories for these posts
const { data: categories, loading: isLoadingCategories } = useGetMany(
    'categories',
    ids.map(id=> posts[id].category_id),
    // run only if the first query returns non-empty result
    { enabled: ids.length > 0 }
);
```

## Handling Side Effects In `useDataProvider`

`useDataProvider` returns a `dataProvider` object. Each call to its method return a Promise, allowing adding business logic on success in `then()`, and on failure in `catch()`.

For instance, here is another version of the `<ApproveButton>`  based on `useDataProvider` that notifies the user of success or failure using the bottom notification banner:

```jsx
import * as React from "react";
import { useDataProvider, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const approve = () => dataProvider
        .update('comments', { id: record.id, data: { isApproved: true } })
        .then(response => {
            // success side effects go here
            redirect('/comments');
            notify('Comment approved');
        })
        .catch(error => {
            // failure side effects go here 
            notify(`Comment approval error: ${error.message}`, 'warning');
        });
    
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

Fetching data is called a *side effect*, since it calls the outside world, and is asynchronous. Usual actions may have other side effects, like showing a notification, or redirecting the user to another page. React-admin provides the following hooks to handle most common side effects:

- [`useNotify`](#usenotify): Return a function to display a notification. 
- [`useRedirect`](#useredirect): Return a function to redirect the user to another page. 
- [`useRefresh`](#userefresh): Return a function to force a rerender of the current view (equivalent to pressing the Refresh button).
- [`useUnselectAll`](#useunselectall): Return a function to unselect all lines in the current `Datagrid`. 

### `useNotify`

This hook returns a function that displays a notification in the bottom of the page.

```jsx
import { useNotify } from 'react-admin';

const NotifyButton = () => {
    const notify = useNotify();
    const handleClick = () => {
        notify(`Comment approved`, 'success');
    }
    return <button onClick={handleClick}>Notify</button>;
};
```

The callback takes 5 arguments:
 - the message to display
 - the level of the notification (`info`, `success` or `warning` - the default is `info`)
 - an `options` object to pass to the `translate` function (because notification messages are translated if your admin has an `i18nProvider`). It is useful for inserting variables into the translation.
 - an `undoable` boolean. Set it to `true` if the notification should contain an "undo" button
 - a `duration` number. Set it to `0` if the notification should not be dismissible.

Here are more examples of `useNotify` calls: 

```jsx
// notify a warning
notify(`This is a warning`, 'warning');
// pass translation arguments
notify('item.created', 'info', { resource: 'post' });
// send an undoable notification
notify('Element updated', 'info', undefined, true);
```

**Tip**: When using `useNotify` as a side effect for an `undoable` Edit form, you MUST set the fourth argument to `true`, otherwise the "undo" button will not appear, and the actual update will never occur.

```jsx
import * as React from 'react';
import { useNotify, Edit, SimpleForm } from 'react-admin';

const PostEdit = props => {
    const notify = useNotify();

    const onSuccess = () => {
        notify(`Changes saved`, undefined, undefined, true);
    };

    return (
        <Edit undoable onSuccess={onSuccess} {...props}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Edit>
    );
}
```

### `useRedirect`

This hook returns a function that redirects the user to another page.

```jsx
import { useRedirect } from 'react-admin';

const DashboardButton = () => {
    const redirect = useRedirect();
    const handleClick = () => {
        redirect('/dashboard');
    }
    return <button onClick={handleClick}>Dashboard</button>;
};
```

The callback takes 3 arguments:
 - the page to redirect the user to ('list', 'create', 'edit', 'show', or a custom path)
 - the current `basePath`
 - the `id` of the record to redirect to (if any)

Here are more examples of `useRedirect` calls: 

```jsx
// redirect to the post list page
redirect('list', '/posts');
// redirect to the edit page of a post:
redirect('edit', '/posts', 1);
// redirect to the post creation page:
redirect('create', '/posts');
```

Note that `useRedirect` doesn't allow to redirect to pages outside the current React app. For that, you should use `document.location`.

### `useRefresh`

This hook returns a function that forces a rerender of the current view.

```jsx
import { useRefresh } from 'react-admin';

const RefreshButton = () => {
    const refresh = useRefresh();
    const handleClick = () => {
        refresh();
    }
    return <button onClick={handleClick}>Refresh</button>;
};
```

To make this work, react-admin stores a `version` number in its state. The `useDataProvider()` hook uses this `version` in its effect dependencies. Also, page components use the `version` as `key`. The `refresh` callback increases the `version`, which forces a re-execution all queries based on the `useDataProvider()` hook, and a rerender of all components using the `version` as key.

This means that you can make any component inside a react-admin app refreshable by using the right key:

```jsx
import * as React from 'react';
import { useVersion } from 'react-admin';

const MyComponent = () => {
    const version = useVersion();
    return <div key={version}>
        ...
    </div>;
};
```

The callback takes 1 argument:
 - `hard`: when set to true, the callback empties the cache, too

### `useUnselectAll`

This hook returns a function that unselects all lines in the current `Datagrid`. Pass the name of the resource as argument.

```jsx
import { useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    const unselectAll = useUnselectAll();
    const handleClick = () => {
        unselectAll('posts');
    }
    return <button onClick={handleClick}>Unselect all</button>;
};
```

## Handling Side Effects In Other Hooks

The other hooks presented in this chapter, starting with `useQuery`, don't expose the `dataProvider` Promise. To allow for side effects with these hooks, they all accept an additional `options` argument. It's an object with `onSuccess` and `onFailure` functions, that react-admin executes on success... or on failure.

So an `<ApproveButton>` written with `useMutation` instead of `useDataProvider` can specify side effects as follows:

```jsx
import * as React from "react";
import { useMutation, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { loading }] = useMutation(
        {
            type: 'update',
            resource: 'comments',
            payload: { id: record.id, data: { isApproved: true } },
        },
        {
            onSuccess: ({ data }) => {
                redirect('/comments');
                notify('Comment approved');
            },
            onFailure: (error) => notify(`Comment approval error: ${error.message}`, 'warning'),
        }
    );
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

## Optimistic Rendering and Undo

In the previous example, after clicking on the "Approve" button, a loading spinner appears while the data provider is fetched. Then, users are redirected to the comments list. But in most cases, the server returns a success response, so the user waits for this response for nothing. 

This is called **pessimistic rendering**, as all users are forced to wait because of the (usually rare) possibility of server failure. 

An alternative mode for mutations is **optimistic rendering**. The idea is to handle the calls to the `dataProvider` on the client side first (i.e. updating entities in the Redux store), and re-render the screen immediately. The user sees the effect of their action with no delay. Then, react-admin applies the success side effects, and only after that, it triggers the call to the data provider. If the fetch ends with a success, react-admin does nothing more than a refresh to grab the latest data from the server. In most cases, the user sees no difference (the data in the Redux store and the data from the `dataProvider` are the same). If the fetch fails, react-admin shows an error notification, and forces a refresh, too.

A third mutation mode is called **undoable**. It's like optimistic rendering, but with an added feature: after applying the changes and the side effects locally, react-admin *waits* for a few seconds before triggering the call to the `dataProvider`. During this delay, the end user sees an "undo" button that, when clicked, cancels the call to the `dataProvider` and refreshes the screen.

Here is a quick recap of the three mutation modes:

|                   | pessimistic               | optimistic | undoable  |
|-------------------|---------------------------|------------|-----------|
| dataProvider call | immediate                 | immediate  | delayed   |
| local changes     | when dataProvider returns | immediate  | immediate |
| side effects      | when dataProvider returns | immediate  | immediate |
| cancellable       | no                        | no         | yes       |


By default, react-admin uses the undoable mode for the Edit view. For the Create view, react-admin needs to wait for the response to know the id of the resource to redirect to, so the mutation mode is pessimistic.  

You can benefit from optimistic and undoable modes when you call the `useMutation` hook, too. You just need to pass a `mutationMode` value in the `options` parameter:

```diff
import * as React from "react";
import { useMutation, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { loading }] = useMutation(
        {
            type: 'update',
            resource: 'comments',
            payload: { id: record.id, data: { isApproved: true } },
        },
        {
+           mutationMode: 'undoable',
-           onSuccess: ({ data }) => {
+           onSuccess: () => {
                redirect('/comments');
-               notify('Comment approved');
+               notify('Comment approved', 'info', {}, true);
            },
            onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
        }
    );
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

As you can see in this example, you need to tweak the notification for undoable calls: passing `true` as fourth parameter of `notify` displays the 'Undo' button in the notification. Also, as side effects are executed immediately, they can't rely on the response being passed to onSuccess.

You can pass the `mutationMode` option parameter to specialized hooks, too. They all accept an optional last argument with side effects.

```jsx
import * as React from "react";
import { useUpdate, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { loading }] = useUpdate(
        'comments',
        record.id,
        { isApproved: true },
        record,
        {
            mutationMode: 'undoable',
            onSuccess: () => {
                redirect('/comments');
                notify('Comment approved', 'info', {}, true);
            },
            onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
        }
    );
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

## Customizing the Redux Action

The `useDataProvider` hook dispatches redux actions on load, on success, and on error. By default, these actions are called:

- `CUSTOM_FETCH_LOAD`
- `CUSTOM_FETCH_SUCCESS`
- `CUSTOM_FETCH_FAILURE`

React-admin doesn't have any reducer watching these actions. You can write a custom reducer for these actions to store the return of the Data Provider in Redux. But the best way to do so is to set the hooks dispatch a custom action instead of `CUSTOM_FETCH`. Use the `action` option for that purpose: 

```diff
import * as React from "react";
import { useUpdate, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { loading }] = useUpdate(
        'comments',
        record.id,
        { isApproved: true },
        {
+           action: 'MY_CUSTOM_ACTION',
            mutationMode: 'undoable',
            onSuccess: ({ data }) => {
                redirect('/comments');
                notify('Comment approved', 'info', {}, true);
            },
            onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
        }
    );
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

**Tip**: When using the Data Provider hooks for regular pages (List, Edit, etc), react-admin always specifies a custom action name, related to the component asking for the data. For instance, in the `<List>` page, the action is called `CRUD_GET_LIST`. So unless you call the Data Provider hooks yourself, no `CUSTOM_FETCH` action should be dispatched.

## Legacy Components: `<Query>`, `<Mutation>`, and `withDataProvider`

Before react had hooks, react-admin used render props and higher order components to provide the same functionality. Legacy code will likely contain instances of `<Query>`, `<Mutation>`, and `withDataProvider`. Their syntax, which is identical to their hook counterpart, is illustrated below.

You can fetch and display a user profile using the `<Query>` component, which uses render props:

{% raw %}
```jsx
import * as React from "react";
import { Query, Loading, Error } from 'react-admin';

const UserProfile = ({ record }) => (
    <Query type='getOne' resource='users' payload={{ id: record.id }}>
        {({ data, loading, error }) => {
            if (loading) { return <Loading />; }
            if (error) { return <Error />; }
            return <div>User {data.username}</div>;
        }}
    </Query>
);
```
{% endraw %}

Or, query a user list on the dashboard with the same `<Query>` component:

```jsx
import * as React from "react";
import { Query, Loading, Error } from 'react-admin';

const payload = {
   pagination: { page: 1, perPage: 10 },
   sort: { field: 'username', order: 'ASC' },
};

const UserList = () => (
    <Query type='getList' resource='users' payload={payload}>
        {({ data, total, loading, error }) => {
            if (loading) { return <Loading />; }
            if (error) { return <Error />; }
            return (
                <div>
                    <p>Total users: {total}</p>
                    <ul>
                        {data.map(user => <li key={user.username}>{user.username}</li>)}
                    </ul>
                </div>
            );
        }}
    </Query>
);
```

Just like `useQuery`, the `<Query>` component expects three parameters: `type`, `resource`, and `payload`. It fetches the data provider on mount, and passes the data to its child component once the response from the API arrives.

And if you need to chain API calls, don't hesitate to nest `<Query>` components.

When calling the API to update ("mutate") data, use the `<Mutation>` component instead. It passes a callback to trigger the API call to its child function. 

Here is a version of the `<ApproveButton>` component demonstrating `<Mutation>`:

```jsx
import * as React from "react";
import { Mutation, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const payload = { id: record.id, data: { ...record, is_approved: true } };
    const options = {
        mutationMode: 'undoable',
        onSuccess: ({ data }) => {
            notify('Comment approved', 'info', {}, true);
            redirect('/comments');
        },
        onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
    };
    return (
        <Mutation
            type='update'
            resource='comments'
            payload={payload}
            options={options}
        >
            {(approve, { loading }) => (
                <Button label='Approve' onClick={approve} disabled={loading} />
            )}
        </Mutation>
    );
};

export default ApproveButton;
```

And here is the `<UserProfile>` component using the `withDataProvider` HOC instead of the `useDataProvider` hook:

```diff
import { useState, useEffect } from 'react';
-import { useDataProvider } from 'react-admin';
+import { withDataProvider } from 'react-admin';

-const UserProfile = ({ userId }) => {
+const UserProfile = ({ userId, dataProvider }) => {
-   const dataProvider = useDataProvider();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        dataProvider.getOne('users', { id: userId })
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!user) return null;

    return (
        <ul>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
        </ul>
    )
};

-export default UserProfile;
+export default withDataProvider(UserProfile);
```

Note that these components are implemented in react-admin using the hooks described earlier. If you're writing new components, prefer the hooks, which are faster, and do not pollute the component tree.

## Querying The API With `fetch`

`useQuery`, `useMutation` and `useDataProvider` are "the react-admin way" to query the API, but nothing prevents you from using `fetch` if you want. For instance, when you don't want to add some routing logic to the data provider for an RPC method on your API, that makes perfect sense.

There is no special react-admin sauce in that case. Here is an example implementation of calling `fetch` in a component:

```jsx
// in src/comments/ApproveButton.js
import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNotify, useRedirect, fetchStart, fetchEnd, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const dispatch = useDispatch();
    const redirect = useRedirect();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const handleClick = () => {
        setLoading(true);
        dispatch(fetchStart()); // start the global loading indicator 
        const updatedRecord = { ...record, is_approved: true };
        fetch(`/comments/${record.id}`, { method: 'PUT', body: updatedRecord })
            .then(() => {
                notify('Comment approved');
                redirect('/comments');
            })
            .catch((e) => {
                notify('Error: comment not approved', 'warning')
            })
            .finally(() => {
                setLoading(false);
                dispatch(fetchEnd()); // stop the global loading indicator
            });
    };
    return <Button label="Approve" onClick={handleClick} disabled={loading} />;
};

export default ApproveButton;
```

**TIP**: APIs often require a bit of HTTP plumbing to deal with authentication, query parameters, encoding, headers, etc. It turns out you probably already have a function that maps from a REST request to an HTTP request: your [Data Provider](./DataProviders.md). So it's often better to use `useDataProvider` instead of `fetch`.
