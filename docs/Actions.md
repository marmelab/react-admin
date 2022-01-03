---
layout: default
title: "Querying the API"
---

# Querying the API

Admin interfaces often have to query the API beyond CRUD requests. For instance, a user profile page may need to get the User object based on a user id. Or, users may want to "Approve" a comment by pressing a button, and this action should update the `is_approved` property and save the updated record in one click.

React-admin provides special hooks to emit read and write queries to the [`dataProvider`](./DataProviders.md), which in turn sends requests to your API.

## `useDataProvider`

React-admin stores the `dataProvider` object in a React context, so it's available from anywhere in your application code. The `useDataProvider` hook exposes the Data Provider to let you call it directly.

For instance, here is how to query the Data Provider for the current user profile:

```jsx
import { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { Loading, Error } from './MyComponents';

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

But the recommended way to query the Data Provider is to use the dataProvider method hooks (like `useGetOne`, see below).

**Tip**: The `dataProvider` returned by the hook is actually a *wrapper* around your Data Provider. This wrapper logs the user out if the dataProvider returns an error, and if the authProvider sees that error as an authentication error (via `authProvider.checkError()`).

**Tip**: If you use TypeScript, you can specify a record type for more type safety:

```jsx
dataProvider.getOne<Product>('users', { id: 123 })
    .then(({ data }) => {
        //     \- type of data is Product
        // ...
    })
```

## DataProvider Method Hooks

React-admin provides one hook for each of the Data Provider methods. They are useful shortcuts that make your code more readable and more robust.

Their signature is the same as the related dataProvider method, e.g.:

```jsx
useGetOne(resource, { id }); // calls dataProvider.getOne(resource, { id })
```

The previous example greatly benefits from the `useGetOne` hook, which handles loading and error states, and offers a concise way to call the Data Provider:

```jsx
import { useGetOne } from 'react-admin';
import { Loading, Error } from './MyComponents';

const UserProfile = ({ userId }) => {
    const { data: user, isLoading, error } = useGetOne('users', { id: userId });

    if (isLoading) return <Loading />;
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

**Tip**: If you use TypeScript, you can specify the record type for more type safety:

```jsx
const { data, isLoading } = useGetOne<Product>('products', { id: 123 });
//        \- type of data is Product
```

The query hooks execute on mount. They return an object with the following properties: `{ data, isLoading, error }`. Query hooks are:

* [`useGetList`](#usegetlist)
* [`useGetOne`](#usegetone)
* [`useGetMany`](#usegetmany)
* [`useGetManyReference`](#usegetmanyreference)

The mutation hooks execute the query when you call a callback. They return an array with the following items: `[mutate, { data, isLoading, error }]`. Mutation hooks are:

* [`useCreate`](#usecreate)
* [`useUpdate`](#useupdate)
* [`useUpdateMany`](#useupdatemany)
* [`useDelete`](#usedelete)
* [`useDeleteMany`](#usedeletemany)

For instance, here is an example using `useUpdate()`:

```jsx
import * as React from "react";
import { useUpdate, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [approve, { isLoading }] = useUpdate('comments', { id: record.id, data: { isApproved: true }, previousData: record });
    return <Button label="Approve" onClick={approve} disabled={isLoading} />;
};
```

Both the query and mutation hooks accept an `options` argument, to override the query options:

```jsx
const { data: user, isLoading, error } = useGetOne(
    'users',
    { id: userId },
    { enabled: userId !== undefined }
);
```

## `useGetList`

This hook calls `dataProvider.getList()` when the component mounts. It's ideal for getting a list of records. It supports filtering, sorting, and pagination.

```jsx
// syntax
const { data, total, isLoading, error, refetch } = useGetList(
    resource,
    { pagination, sort, filter },
    options
);

// example
import { useGetList } from 'react-admin';

const LatestNews = () => {
    const { data, isLoading, error } = useGetList(
        'posts',
        { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {data.map(record =>
                <li key={record.id}>{record.title}</li>
            )}
        </ul>
    );
};
```

## `useGetOne`

This hook calls `dataProvider.getOne()` when the component mounts. It queries the data provider for a single record, based on its `id`.

```jsx
// syntax
const { data, isLoading, error, refetch } = useGetOne(
    resource,
    { id },
    options
);

// example
import { useGetOne } from 'react-admin';

const UserProfile = ({ record }) => {
    const { data, isLoading, error } = useGetOne('users', { id: record.id });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

## `useGetMany`

This hook calls `dataProvider.getMany()` when the component mounts. It queries the data provider for several records, based on an array of `ids`.

```jsx
// syntax
const { data, isLoading, error, refetch } = useGetMany(
    resource,
    { ids },
    options
);

// example
import { useGetMany } from 'react-admin';

const PostTags = ({ record }) => {
    const { data, isLoading, error } = useGetMany(
        'tags',
        { ids: record.tagIds }
    );
    if (isLoading) { return <Loading />; }
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

## `useGetManyReference`

This hook calls `dataProvider.getManyReference()` when the component mounts. It queries the data provider for a list of records related to another one (e.g. all the comments for a post). It supports filtering, sorting, and pagination.

```jsx
// syntax
const { data, total, isLoading, error, refetch } = useGetManyReference(
    resource,
    { target, id, pagination, sort, filter },
    options
);

// example
import { useGetManyReference } from 'react-admin';

const PostComments = ({ record }) => {
    // fetch all comments related to the current record
    const { data, isLoading, error } = useGetManyReference(
        'comments',
        { 
            target: 'post_id',
            id: record.id,
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {data.map(comment => (
                <li key={comment.id}>{comment.body}</li>
            ))}
        </ul>
    );
};
```

## `useCreate`

This hook allows to call `dataProvider.create()` when the callback is executed. 

```jsx
// syntax
const [create, { data, isLoading, error }] = useCreate(
    resource,
    { data },
    options
);
```

The `create()` method can be called with the same parameters as the hook:

```jsx
create(
    resource,
    { data },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the hook (second example below).

```jsx
// set params when calling the hook
import { useCreate } from 'react-admin';

const LikeButton = ({ record }) => {
    const like = { postId: record.id };
    const [create, { isLoading, error }] = useCreate('likes', { data: like });
    const handleClick = () => {
        create()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};

// set params when calling the create callback
import { useCreate } from 'react-admin';

const LikeButton = ({ record }) => {
    const like = { postId: record.id };
    const [create, { isLoading, error }] = useCreate();
    const handleClick = () => {
        create('likes', { data: like })
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};
```

## `useUpdate`

This hook allows to call `dataProvider.update()` when the callback is executed, and update a single record based on its `id` and a `data` argument. 

```jsx
// syntax
const [update, { data, isLoading, error }] = useUpdate(
    resource,
    { id, data, previousData },
    options
);
```

The `update()` method can be called with the same parameters as the hook:

```jsx
update(
    resource,
    { id, data, previousData },
    options
);
```

This means the parameters can be passed either when calling the hook, or when calling the callback. It's up to you to pick the syntax that best suits your component. If you have the choice, we recommend passing the parameters when calling the hook (second example below).

```jsx
// set params when calling the hook
import { useUpdate } from 'react-admin';

const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
    const [update, { isLoading, error }] = useUpdate(
        'likes',
        { id: record.id, data: diff, previousData: record }
    );
    const handleClick = () => {
        update()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};

// set params when calling the update callback
import { useUpdate } from 'react-admin';

const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
    const [update, { isLoading, error }] = useUpdate();
    const handleClick = () => {
        update(
            'likes',
            { id: record.id, data: diff, previousData: record }
        )
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};
```

## `useUpdateMany`

This hook allows to call `dataProvider.updateMany()` when the callback is executed, and update an array of records based on their `ids` and a `data` argument. 


```jsx
// syntax
const [updateMany, { data, isLoading, error }] = useUpdateMany(
    resource,
    { ids, data },
    options
);
```

The `updateMany()` method can be called with the same parameters as the hook:

```jsx
updateMany(
    resource,
    { ids, data },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the hook (second example below).

```jsx
// set params when calling the hook
import { useUpdateMany } from 'react-admin';

const BulkResetViewsButton = ({ selectedIds }) => {
    const [updateMany, { isLoading, error }] = useUpdateMany(
        'posts',
        { ids: selectedIds, data: { views: 0 } }
    );
    const handleClick = () => {
        updateMany();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Reset views</button>;
};

// set params when calling the updateMany callback
import { useUpdateMany } from 'react-admin';

const BulkResetViewsButton = ({ selectedIds }) => {
    const [updateMany, { isLoading, error }] = useUpdateMany();
    const handleClick = () => {
        updateMany(
            'posts',
            { ids: selectedIds, data: { views: 0 } }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Reset views</button>;
};
```

## `useDelete`

This hook allows calling `dataProvider.delete()` when the callback is executed and deleting a single record based on its `id`. 

```jsx
// syntax
const [deleteOne, { data, isLoading, error }] = useDelete(
    resource,
    { id, previousData },
    options
);
```

The `deleteOne()` method can be called with the same parameters as the hook:

```jsx
deleteOne(
    resource,
    { id, previousData },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the hook (second example below).

```jsx
// set params when calling the hook
import { useDelete } from 'react-admin';

const DeleteButton = ({ record }) => {
    const [deleteOne, { isLoading, error }] = useDelete(
        'likes',
        { id: record.id, previousData: record }
    );
    const handleClick = () => {
        deleteOne();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Delete</button>;
};

// set params when calling the deleteOne callback
import { useDelete } from 'react-admin';

const DeleteButton = ({ record }) => {
    const [deleteOne, { isLoading, error }] = useDelete();
    const handleClick = () => {
        deleteOne(
            'likes',
            { id: record.id , previousData: record }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Delete</div>;
};
```

## `useDeleteMany`

This hook allows to call `dataProvider.deleteMany()` when the callback is executed, and delete an array of records based on their `ids`. 

```jsx
// syntax
const [deleteMany, { data, isLoading, error }] = useDeleteMany(
    resource,
    { ids },
    options
);
```

The `deleteMany()` method can be called with the same parameters as the hook:

```jsx
deleteMany(
    resource,
    { ids },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the hook (second example below).

```jsx
// set params when calling the hook
import { useDeleteMany } from 'react-admin';

const BulkDeletePostsButton = ({ selectedIds }) => {
    const [deleteMany, { isLoading, error }] = useDeleteMany(
        'posts',
        { ids: selectedIds }
    );
    const handleClick = () => {
        deleteMany()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Delete selected posts</button>;
};

// set params when calling the deleteMany callback
import { useDeleteMany } from 'react-admin';

const BulkDeletePostsButton = ({ selectedIds }) => {
    const [deleteMany, { isLoading, error }] = useDeleteMany();
    const handleClick = () => {
        deleteMany(
            'posts',
            { ids: selectedIds }
        )
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Delete selected posts</button>;
};
```

## React-query

Internally, react-admin uses [react-query](https://react-query.tanstack.com/) to call the dataProvider. When fetching data from the dataProvider in your components, if you can't use any of the dataProvider method hooks, you should use that library, too. It brings several benefits:

1. It triggers the loader in the AppBar when the query is running.
2. It reduces the boilerplate code since you don't need to use `useState`.
3. It supports a vast array of options
3. It displays stale data while fetching up-to-date data, leading to a snappier UI

React-query offers 2 main hooks to interact with the dataProvider:

* [`useQuery`](https://react-query.tanstack.com/reference/useQuery): fetches the dataProvider on mount. This is for *read* queries.
* [`useMutation`](https://react-query.tanstack.com/reference/useMutation): fetches the dataProvider when you call a callback. This is for *write* queries, and *read* queries that execute on user interaction.

Both these hooks accept a query *key* (identifying the query in the cache), and a query *function* (executing the query and returning a Promise). Internally, react-admin uses an array of arguments as the query key.

For instance, the initial code snippet of this chapter can be rewritten with `useQuery` as follows:

```jsx
import * as React from "react";
import { useQuery } from 'react-query';
import { useDataProvider, Loading, Error } from 'react-admin';

const UserProfile = ({ userId }) => {
    const dataProvider = useDataProvider();
    const { data, isLoading, error } = useQuery(
        ['user', 'getOne', userId], 
        () => dataProvider.getOne('users', { id: userId })
    );

    if (isLoading) return <Loading />;
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

To illustrate the usage of `useMutation`, here is an implementation of an "Approve" button for a comment:

```jsx
import * as React from "react";
import { useMutation } from 'react-query';
import { useDataProvider, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const dataProvider = useDataProvider();
    const { mutate, isLoading } = useMutation(
        ['comments', 'update', { id: record.id, data: { isApproved: true } }],
        () => dataProvider.update('comments', { id: record.id, data: { isApproved: true } })
    );
    return <Button label="Approve" onClick={() => mutate()} disabled={isLoading} />;
};
```

If you want to go beyond data provider method hooks, we recommend that you read [the react-query documentation](https://react-query.tanstack.com/overview).

## `isLoading` vs `isFetching`

Data fetching hooks return two loading state variables: `isLoading` and `isFetching`. Which one should you use?

The short answer is: use `isLoading`. Read on to understand why.

The source of these two variables is [react-query](https://react-query.tanstack.com/guides/queries#query-basics). Here is how they defined these two variables:

- `isLoading`:  The query has no data and is currently fetching
- `isFetching`: In any state, if the query is fetching at any time (including background refetching) isFetching will be true.

Let's see how what these variables contain in a typical usage scenario:

1. The user first loads a page. `isLoading` is true, and `isFetching` is also true because the data was never loaded
2. The dataProvider returns the data. Both `isLoading` and `isFetching` become false
3. The user navigates away
4. The user comes back to the first page, which triggers a new fetch. `isLoading` is false, because the stale data is available, and `isFetching` is true because the dataProvider is being fetched.
5. The dataProvider returns the data. Both `isLoading` and `isFetching` become false

Components use the loading state to show a loading indicator when there is no data to show. In the example above, the loading indicator is necessary for step 2, but not in step 4, because you can display the stale data while fresh data is being loaded.

```jsx
import { useGetOne } from 'react-admin';

const UserProfile = ({ record }) => {
    const { data, isLoading, error } = useGetOne('users', { id: record.id });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

As a consequence, you should always use `isLoading` to determine if you need to show a loading indicator.

## Calling Custom Methods

Your dataProvider may contain custom methods, e.g. for calling RPC endpoints on your API. `useQuery` and `use%Mutation` are especially useful for calling these methods.

For instance, if your `dataProvider` exposes a `banUser()` method:

```jsx
const dataProvider = {
    getList: /** ... **/,
    getOne: /** ... **/,
    getMany: /** ... **/,
    getManyReference /** ... **/,
    create: /** ... **/,
    update: /** ... **/,
    updateMany /** ... **/,
    delete: /** ... **/,
    deleteMany /** ... **/,
    banUser: (userId) => {
        return fetch(`/api/user/${userId}/ban`, { method: 'POST' })
            .then(response => response.json());
    },
}
```

You can call it inside a `<BanUser>` button component as follows:

```jsx
const BanUserButton = ({ userId }) => {
    const dataProvider = useDataProvider();
    const { mutate, isLoading } = useMutation(
        ['banUser', userId],
        () => dataProvider.banUser(userId)
    );
    return <Button label="Ban" onClick={() => mutate()} disabled={isLoading} />;
};
```

## Query Options

The data provider method hooks (like `useGetOne`) and react-query's hooks (like `useQuery`) accept a query options object as the last argument. This object can be used to modify the way the query is executed. There are many options, all documented [in the react-query documentation](https://react-query.tanstack.com/reference/useQuery):

- `cacheTime`
- `enabled`
- `initialData`
- `initialDataUpdatedA`
- `isDataEqual`
- `keepPreviousData`
- `meta`
- `notifyOnChangeProps`
- `notifyOnChangePropsExclusions`
- `onError`
- `onSettled`
- `onSuccess`
- `queryKeyHashFn`
- `refetchInterval`
- `refetchIntervalInBackground`
- `refetchOnMount`
- `refetchOnReconnect`
- `refetchOnWindowFocus`
- `retry`
- `retryOnMount`
- `retryDelay`
- `select`
- `staleTime`
- `structuralSharing`
- `suspense`
- `useErrorBoundary`

For instance, if you want to execute a callback when the query completes (whether it's successful or failed), you can use the `onSettled` option. this can be useful e.g. to log all calls to the dataProvider:

```jsx
import { useGetOne } from 'react-admin';

const UserProfile = ({ record }) => {
    const { data, isLoading, error } = useGetOne(
        'users',
        { id: record.id },
        { onSettled: (data, error) => console.log(data, error) }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

We won't re-explain all these options here, but we'll focus on the most useful ones in react-admin. 

**Tip**: In react-admin components that use the data provider method hooks, you can override the query options using the `queryOptions` prop, and the mutation options using the `mutationOptions` prop. For instance, to log the dataProvider calls, in the `<List>` component, you can do the following:

{% raw %}
```jsx
import { List; Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List
        queryOptions={{ onSettled: (data, error) => console.log(data, error) }}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```
{% endraw %}

## Synchronizing Dependent Queries

`useQuery` and all its corresponding specialized hooks support an `enabled` option. This is useful if you need to have a query executed only when a condition is met. For example, the following code only fetches the categories if at least one post is already loaded:

```jsx
// fetch posts
const { data: posts, isLoading } = useGetList(
    'posts',
    { pagination: { page: 1, perPage: 20 }, sort: { field: 'name', order: 'ASC' } },
);

// then fetch categories for these posts
const { data: categories, isLoading: isLoadingCategories } = useGetMany(
    'categories',
    { ids: posts.map(post => posts.category_id) },
    // run only if the first query returns non-empty result
    { enabled: !isLoading && posts.length > 0 }
);
```

## Success and Error Side Effects

To execute some logic after a query or a mutation is complete, use the `onSuccess` and `onError` options. React-admin uses the term "side effects" for this type of logic, as it's usually modifying another part of the UI.

This is very common when using mutation hooks like `useUpdate`, e.g. to display a notification, or redirect to another page. For instance, here is an `<ApproveButton>` that notifies the user of success or failure using the bottom notification banner:

```jsx
import * as React from "react";
import { useUpdate, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { isLoading }] = useUpdate(
        'comments',
        { id: record.id, data: { isApproved: true } }
        {
            onSuccess: (data) => {
                // success side effects go here
                redirect('/comments');
                notify('Comment approved');
            },
            onError: (error) => {
                // failure side effects go here 
                notify(`Comment approval error: ${error.message}`, { type: 'warning' });
            },
        }
    );
    
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
};
```

React-admin provides the following hooks to handle the most common side effects:

- [`useNotify`](#usenotify): Return a function to display a notification. 
- [`useRedirect`](#useredirect): Return a function to redirect the user to another page. 
- [`useRefresh`](#userefresh): Return a function to force a rerender of the current view (equivalent to pressing the Refresh button).
- [`useUnselectAll`](#useunselectall): Return a function to unselect all lines in the current `Datagrid`. 

### `useNotify`

This hook returns a function that displays a notification at the bottom of the page.

```jsx
import { useNotify } from 'react-admin';

const NotifyButton = () => {
    const notify = useNotify();
    const handleClick = () => {
        notify(`Comment approved`, { type: 'success' });
    }
    return <button onClick={handleClick}>Notify</button>;
};
```

The callback takes 2 arguments:
- The message to display
- an `options` object with the following keys
    - The `type` of the notification (`info`, `success` or `warning` - the default is `info`)
    - A `messageArgs` object to pass to the `translate` function (because notification messages are translated if your admin has an `i18nProvider`). It is useful for inserting variables into the translation.
    - An `undoable` boolean. Set it to `true` if the notification should contain an "undo" button
    - An `autoHideDuration` number. Set it to `0` if the notification should not be dismissible.
    - A `multiLine` boolean. Set it to `true` if the notification message should be shown in more than one line.

Here are more examples of `useNotify` calls: 

```js
// notify a warning
notify(`This is a warning`, 'warning');
// pass translation arguments
notify('item.created', { type: 'info', messageArgs: { resource: 'post' } });
// send an undoable notification
notify('Element updated', { type: 'info', undoable: true });
```

**Tip**: When using `useNotify` as a side effect for an `undoable` mutation, you MUST set the `undoable` option to `true`, otherwise the "undo" button will not appear, and the actual update will never occur.

```jsx
import * as React from 'react';
import { useNotify, Edit, SimpleForm } from 'react-admin';

const PostEdit = () => {
    const notify = useNotify();

    const onSuccess = () => {
        notify('Changes saved`', { undoable: true });
    };

    return (
        <Edit mutationMode="undoable" onSuccess={onSuccess}>
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

The callback takes 5 arguments:
 - The page to redirect the user to ('list', 'create', 'edit', 'show', a function or a custom path)
 - The current `basePath`
 - The `id` of the record to redirect to (if any)
 - A record-like object to be passed to the first argument, when the first argument is a function
 - A `state` to be set to the location

Here are more examples of `useRedirect` calls: 

```jsx
// redirect to the post list page
redirect('list', '/posts');
// redirect to the edit page of a post:
redirect('edit', '/posts', 1);
// redirect to the post creation page:
redirect('create', '/posts');
// redirect to the result of a function
redirect((redirectTo, basePath, id, data) => { 
    return  data.hasComments ? '/comments' : '/posts';
}, '/posts', 1, { hasComments: true });
// redirect to edit view with state data
redirect('edit', '/posts', 1, {}, { record: { post_id: record.id } });
// do not redirect (resets the record form)
redirect(false);
```

Note that `useRedirect` allows redirection to an absolute URL outside the current React app.

### `useRefresh`

This hook returns a function that forces a refetch of all the active queries, and a rerender of the current view when the data has changed.

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

## Optimistic Rendering and Undo

In the following example, after clicking on the "Approve" button, a loading spinner appears while the data provider is fetched. Then, users are redirected to the comments list. 

```jsx
import * as React from "react";
import { useUpdate, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { isLoading }] = useUpdate(
        'comments',
        { id: record.id, data: { isApproved: true } }
        {
            onSuccess: (data) => {
                redirect('/comments');
                notify('Comment approved');
            },
            onError: (error) => {
                notify(`Comment approval error: ${error.message}`, { type: 'warning' });
            },
        }
    );
    
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
};
```

But in most cases, the server returns a successful response, so the user waits for this response for nothing. 

This is called **pessimistic rendering**, as all users are forced to wait because of the (usually rare) possibility of server failure. 

An alternative mode for mutations is **optimistic rendering**. The idea is to handle the calls to the `dataProvider` on the client side first (i.e. updating entities in the react-query cache), and re-render the screen immediately. The user sees the effect of their action with no delay. Then, react-admin applies the success side effects, and only after that, it triggers the call to the data provider. If the fetch ends with success, react-admin does nothing more than a refresh to grab the latest data from the server. In most cases, the user sees no difference (the data in the Redux store and the data from the `dataProvider` are the same). If the fetch fails, react-admin shows an error notification and reverts the mutation.

A third mutation mode is called **undoable**. It's like optimistic rendering, but with an added feature: after applying the changes and the side effects locally, react-admin *waits* for a few seconds before triggering the call to the `dataProvider`. During this delay, the end-user sees an "undo" button that, when clicked, cancels the call to the `dataProvider` and refreshes the screen.

Here is a quick recap of the three mutation modes:

|                   | pessimistic               | optimistic | undoable  |
|-------------------|---------------------------|------------|-----------|
| dataProvider call | immediate                 | immediate  | delayed   |
| local changes     | when dataProvider returns | immediate  | immediate |
| side effects      | when dataProvider returns | immediate  | immediate |
| cancellable       | no                        | no         | yes       |


By default, react-admin uses the `undoable` mode for the Edit view. As for the data provider method hooks, they default to the `pessimistic` mode.

**Tip**: For the Create view, react-admin needs to wait for the response to know the id of the resource to redirect to, so the mutation mode is pessimistic.  

You can benefit from optimistic and undoable modes when you call the `useUpdate` hook, too. You just need to pass a `mutationMode` option:

```diff
import * as React from "react";
import { useUpdate, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { isLoading }] = useUpdate(
        'comments',
        { id: record.id, data: { isApproved: true } }
        {
+           mutationMode: 'undoable',
-           onSuccess: (data) => {
+           onSuccess: () => {
                redirect('/comments');
-               notify('Comment approved');
+               notify('Comment approved', { undoable: true });
            },
            onFailure: (error) => notify(`Error: ${error.message}`, { type: 'warning' }),
        }
    );
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
};
```

As you can see in this example, you need to tweak the notification for undoable calls: passing `undo: true` displays the 'Undo' button in the notification. Also, as side effects are executed immediately, they can't rely on the response being passed to onSuccess.

The following hooks accept a `mutationMode` option:

* [`useUpdate`](#useupdate)
* [`useUpdateMany`](#useupdatemany)
* [`useDelete`](#usedelete)
* [`useDeleteMany`](#usedeletemany)

## Querying The API With `fetch`

data Provider method hooks, `useQuery` and `useMutation` are "the react-admin way" to query the API. But nothing prevents you from using `fetch` if you want. For instance, when you don't want to add some routing logic to the data provider for an RPC method on your API, that makes perfect sense.

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
                notify('Error: comment not approved', { type: 'warning' })
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
