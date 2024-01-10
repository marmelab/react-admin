---
layout: default
title: "Querying the API"
---

# Querying the API

React-admin provides special hooks to emit read and write queries to the [`dataProvider`](./DataProviders.md), which in turn sends requests to your API. Under the hood, it uses [react-query](https://tanstack.com/query/v3/) to call the `dataProvider` and cache the results.

## Getting The `dataProvider` Instance

React-admin stores the `dataProvider` object in a React context, so it's available from anywhere in your application code. The `useDataProvider` hook grabs the Data Provider from that context, so you can call it directly.

For instance, here is how to query the Data Provider for the current user profile:

```jsx
import { useDataProvider } from 'react-admin';

const MyComponent = () => {
    const dataProvider = useDataProvider();
    // ...
}
```

Refer to [the `useDataProvider` hook documentation](./useDataProvider.md) for more information.

**Tip**: The `dataProvider` returned by the hook is actually a *wrapper* around your Data Provider. This wrapper logs the user out if the `dataProvider` returns an error, and if the `authProvider` sees that error as an authentication error (via `authProvider.checkError()`).

## DataProvider Method Hooks

React-admin provides one hook for each of the Data Provider methods. They are useful shortcuts that make your code more readable and more robust.

The query hooks execute on mount. They return an object with the following properties: `{ data, isLoading, error }`. Query hooks are:

* [`useGetList`](./useGetList.md)
* [`useGetOne`](./useGetOne.md)
* [`useGetMany`](./useGetMany.md)
* [`useGetManyReference`](./useGetManyReference.md)

The mutation hooks execute the query when you call a callback. They return an array with the following items: `[mutate, { data, isLoading, error }]`. Mutation hooks are:

* [`useCreate`](./useCreate.md)
* [`useUpdate`](./useUpdate.md)
* [`useUpdateMany`](./useUpdateMany.md)
* [`useDelete`](./useDelete.md)
* [`useDeleteMany`](./useDeleteMany.md)

Their signature is the same as the related dataProvider method, e.g.:

```jsx
// calls dataProvider.getOne(resource, { id })
const { data, isLoading, error } = useGetOne(resource, { id });
```

For instance, here is how to fetch one record from the API using the `useGetOne` hook:

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

Here is another example, using `useUpdate()`:

```jsx
import * as React from 'react';
import { useUpdate, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const [approve, { isLoading }] = useUpdate('comments', { id: record.id, data: { isApproved: true }, previousData: record });
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
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

**Tip**: If you use TypeScript, you can specify the record type for more type safety:

```jsx
const { data, isLoading } = useGetOne<Product>('products', { id: 123 });
//        \- type of data is Product
```

## `meta` Parameter

All Data Provider methods accept a `meta` parameter. React-admin doesn't set this parameter by default in its queries, but it's a good way to pass special arguments or metadata to an API call.

```jsx
const { data, isLoading, error } = useGetOne(
    'books',
    { id, meta: { _embed: 'authors' } },
);
```

It's up to the Data Provider to interpret this parameter.

## `useQuery` and `useMutation`

Internally, react-admin uses [react-query](https://tanstack.com/query/v3/) to call the dataProvider. When fetching data from the dataProvider in your components, if you can't use any of the dataProvider method hooks, you should use that library, too. It brings several benefits:

1. It triggers the loader in the AppBar when the query is running.
2. It reduces the boilerplate code since you don't need to use `useState`.
3. It supports a vast array of options
4. It displays stale data while fetching up-to-date data, leading to a snappier UI

React-query offers 2 main hooks to interact with the dataProvider:

* [`useQuery`](https://tanstack.com/query/v3/docs/react/reference/useQuery): fetches the dataProvider on mount. This is for *read* queries.
* [`useMutation`](https://tanstack.com/query/v3/docs/react/reference/useMutation): fetches the dataProvider when you call a callback. This is for *write* queries, and *read* queries that execute on user interaction.

Both these hooks accept a query *key* (identifying the query in the cache), and a query *function* (executing the query and returning a Promise). Internally, react-admin uses an array of arguments as the query key.

For instance, the initial code snippet of this chapter can be rewritten with `useQuery` as follows:

```jsx
import * as React from 'react';
import { useQuery } from 'react-query';
import { useDataProvider, Loading, Error } from 'react-admin';

const UserProfile = ({ userId }) => {
    const dataProvider = useDataProvider();
    const { data, isLoading, error } = useQuery(
        ['users', 'getOne', { id: userId }], 
        () => dataProvider.getOne('users', { id: userId })
    );

    if (isLoading) return <Loading />;
    if (error) return <Error />;
    if (!data) return null;

    return (
        <ul>
            <li>Name: {data.data.name}</li>
            <li>Email: {data.data.email}</li>
        </ul>
    )
};
```

To illustrate the usage of `useMutation`, here is an implementation of an "Approve" button for a comment:

```jsx
import * as React from 'react';
import { useMutation } from 'react-query';
import { useDataProvider, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const { mutate, isLoading } = useMutation(
        () => dataProvider.update('comments', { id: record.id, data: { isApproved: true } })
    );
    return <Button label="Approve" onClick={() => mutate()} disabled={isLoading} />;
};
```

If you want to go beyond data provider method hooks, we recommend that you read [the react-query documentation](https://react-query-v3.tanstack.com/overview).

## `isLoading` vs `isFetching`

Data fetching hooks return two loading state variables: `isLoading` and `isFetching`. Which one should you use?

The short answer is: use `isLoading`. Read on to understand why.

The source of these two variables is [react-query](https://react-query-v3.tanstack.com/guides/queries#query-basics). Here is how they defined these two variables:

- `isLoading`:  The query has no data and is currently fetching
- `isFetching`: In any state, if the query is fetching at any time (including background refetching) isFetching will be true.

Let's see how what these variables contain in a typical usage scenario:

1. The user first loads a page. `isLoading` is true because the data was never loaded, and `isFetching` is also true because data is being fetched.
2. The dataProvider returns the data. Both `isLoading` and `isFetching` become false
3. The user navigates away
4. The user comes back to the first page, which triggers a new fetch. `isLoading` is false, because the stale data is available, and `isFetching` is true because data is being fetched via the dataProvider.
5. The dataProvider returns the data. Both `isLoading` and `isFetching` become false

Components use the loading state to show a loading indicator when there is no data to show. In the example above, the loading indicator is necessary for step 2, but not in step 4, because you can display the stale data while fresh data is being loaded.

```jsx
import { useGetOne, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
    const { data, isLoading, error } = useGetOne('users', { id: record.id });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

As a consequence, you should always use `isLoading` to determine if you need to show a loading indicator.

## Calling Custom Methods

Admin interfaces often have to query the API beyond CRUD requests. For instance, a user profile page may need to get the User object based on a user id. Or, users may want to "Approve" a comment by pressing a button, and this action should update the `is_approved` property and save the updated record in one click.

Your dataProvider may contain custom methods, e.g. for calling RPC endpoints on your API. `useQuery` and `useMutation` are especially useful for calling these methods.

For instance, if your `dataProvider` exposes a `banUser()` method:

```js
const dataProvider = {
    getList: /* ... */,
    getOne: /* ... */,
    getMany: /* ... */,
    getManyReference: /* ... */,
    create: /* ... */,
    update: /* ... */,
    updateMany: /* ... */,
    delete: /* ... */,
    deleteMany: /* ... */,
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
        () => dataProvider.banUser(userId)
    );
    return <Button label="Ban" onClick={() => mutate()} disabled={isLoading} />;
};
```

## Query Options

The data provider method hooks (like `useGetOne`) and react-query's hooks (like `useQuery`) accept a query options object as the last argument. This object can be used to modify the way the query is executed. There are many options, all documented [in the react-query documentation](https://tanstack.com/query/v3/docs/react/reference/useQuery):

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
import { useGetOne, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
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
import { List, Datagrid, TextField } from 'react-admin';

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

All Data Provider hooks support an `enabled` option. This is useful if you need to have a query executed only when a condition is met. 

For example, the following code only fetches the categories if at least one post is already loaded:

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
import * as React from 'react';
import { useUpdate, useNotify, useRedirect, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { isLoading }] = useUpdate(
        'comments',
        { id: record.id, data: { isApproved: true } },
        {
            onSuccess: (data) => {
                // success side effects go here
                redirect('/comments');
                notify('Comment approved');
            },
            onError: (error) => {
                // failure side effects go here 
                notify(`Comment approval error: ${error.message}`, { type: 'error' });
            },
        }
    );
    
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
};
```

React-admin provides the following hooks to handle the most common side effects:

- [`useNotify`](./useNotify.md): Return a function to display a notification.
- [`useRedirect`](./useRedirect.md): Return a function to redirect the user to another page.
- [`useRefresh`](./useRefresh.md): Return a function to force a rerender of the current view (equivalent to pressing the Refresh button).
- [`useUnselect`](./useUnselect.md): Return a function to unselect lines in the current `Datagrid` based on the ids passed to it.
- [`useUnselectAll`](./useUnselectAll.md): Return a function to unselect all lines in the current `Datagrid`.

## Optimistic Rendering and Undo

In the following example, after clicking on the "Approve" button, a loading spinner appears while the data provider is fetched. Then, users are redirected to the comments list. 

```jsx
import * as React from 'react';
import { useUpdate, useNotify, useRedirect, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { isLoading }] = useUpdate(
        'comments',
        { id: record.id, data: { isApproved: true } },
        {
            onSuccess: (data) => {
                redirect('/comments');
                notify('Comment approved');
            },
            onError: (error) => {
                notify(`Comment approval error: ${error.message}`, { type: 'error' });
            },
        }
    );
    
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
};
```

But in most cases, the server returns a successful response, so the user waits for this response for nothing. 

This is called **pessimistic rendering**, as all users are forced to wait because of the (usually rare) possibility of server failure. 

An alternative mode for mutations is **optimistic rendering**. The idea is to handle the calls to the `dataProvider` on the client side first (i.e. updating entities in the react-query cache), and re-render the screen immediately. The user sees the effect of their action with no delay. Then, react-admin applies the success side effects, and only after that, it triggers the call to the data provider. If the fetch ends with success, react-admin does nothing more than a refresh to grab the latest data from the server. In most cases, the user sees no difference (the data in the react-query cache and the data from the `dataProvider` are the same). If the fetch fails, react-admin shows an error notification and reverts the mutation.

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
import * as React from 'react';
import { useUpdate, useNotify, useRedirect, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
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
            onError: (error) => notify(`Error: ${error.message}`, { type: 'error' }),
        }
    );
    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
};
```

As you can see in this example, you need to tweak the notification for undoable calls: passing `undo: true` displays the 'Undo' button in the notification. Also, as side effects are executed immediately, they can't rely on the response being passed to onSuccess.

The following hooks accept a `mutationMode` option:

* [`useUpdate`](./useUpdate.md)
* [`useUpdateMany`](./useUpdateMany.md)
* [`useDelete`](./useDelete.md)
* [`useDeleteMany`](./useDeleteMany.md)

## Querying The API With `fetch`

Data Provider method hooks are "the react-admin way" to query the API. But nothing prevents you from using `fetch` if you want. For instance, when you don't want to add some routing logic to the data provider for an RPC method on your API, that makes perfect sense.

There is no special react-admin sauce in that case. Here is an example implementation of calling `fetch` in a component:

```jsx
// in src/comments/ApproveButton.js
import * as React from 'react';
import { useState } from 'react';
import { useNotify, useRedirect, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const redirect = useRedirect();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const handleClick = () => {
        setLoading(true);
        const updatedRecord = { ...record, is_approved: true };
        fetch(`/comments/${record.id}`, { method: 'PUT', body: updatedRecord })
            .then(() => {
                notify('Comment approved');
                redirect('/comments');
            })
            .catch((e) => {
                notify('Error: comment not approved', { type: 'error' })
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return <Button label="Approve" onClick={handleClick} disabled={loading} />;
};

export default ApproveButton;
```

**Tip**: APIs often require a bit of HTTP plumbing to deal with authentication, query parameters, encoding, headers, etc. It turns out you probably already have a function that maps from a REST request to an HTTP request: your [Data Provider](./DataProviders.md). So it's often better to use `useDataProvider` instead of `fetch`.
