---
layout: default
title: "Querying the API"
---

# Querying the API

React-admin provides special hooks to emit read and write queries to the [`dataProvider`](./DataProviders.md), which in turn sends requests to your API. Under the hood, it uses [React Query](https://tanstack.com/query/v5/) to call the `dataProvider` and cache the results.

<iframe src="https://www.youtube-nocookie.com/embed/c8tw2sUhKgc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Getting The `dataProvider` Instance

React-admin stores the `dataProvider` object in a React context, so it's available from anywhere in your application code. The `useDataProvider` hook grabs the Data Provider from that context, so you can call it directly. 

As `dataProvider` methods are asynchronous, it's common to call them in a React `useEffect` (for queries) or in an event handler (for mutations).

For instance, here is how to query the Data Provider for a User record on mount, combining the `useDataProvider` hook with the `useState` and `useEffect` hooks:

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

Refer to [the `useDataProvider` hook documentation](./useDataProvider.md) for more information.

**Tip**: For standard data provider methods (like  `getOne()` or `update()`), you should use the [Query hooks](#query-hooks) and the [Mutation hooks](#mutation-hooks), both documented below, instead of calling `useDataProvider`. These hooks are easier to use, more robust, they handle the loading state for you, and they are typed.

## Query Hooks

React-admin provides one query hook for each of the Data Provider read methods. They are useful shortcuts that make your code more readable and more robust. The query hooks execute on mount. They return an object with the following properties: `{ data, isPending, error }`. Query hooks are:

* [`useGetList`](./useGetList.md) calls `dataProvider.getList()`
* [`useGetOne`](./useGetOne.md) calls `dataProvider.getOne()`
* [`useGetMany`](./useGetMany.md) calls `dataProvider.getMany()`
* [`useGetManyReference`](./useGetManyReference.md) calls `dataProvider.getManyReference()`

Their input signature is the same as the related dataProvider method, i.e. they expect the resource name and the query parameters:

```jsx
const { isPending, error, data } = useGetOne(resource, { id });
// calls dataProvider.getOne(resource, { id })
```

For instance, here is how to fetch one User record on mount using the `useGetOne` hook:

```jsx
import { useGetOne } from 'react-admin';
import { Loading, Error } from './MyComponents';

const UserProfile = ({ userId }) => {
    const { isPending, error, data: user } = useGetOne('users', { id: userId });

    if (isPending) return <Loading />;
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

```tsx
const { data } = useGetOne<Product>('products', { id: 123 });
//        \- type of data is Product
```

## Query Options

Query hooks are powered by [React Query](https://tanstack.com/query/v5/)'s [`useQuery`](https://tanstack.com/query/v5/docs/react/reference/useQuery) hook. The third argument of query hooks is an `options` object letting you override `useQuery` options:

```jsx
const { isPending, error, data } = useGetOne(
    'users',
    { id: userId },
    { enabled: userId !== undefined } // query options
);
// translates to
// const { isPending, error, data } = useQuery({
//     queryKey: ['users', 'getOne', { id: userId }],
//     queryFn: () => dataProvider.getOne('users', { id: userId }),
//     enabled: userId !== undefined
// });
```

Check [the useQuery documentation](https://tanstack.com/query/v5/docs/react/reference/useQuery) for a detailed description of all options:

- `gcTime`,
- `enabled`,
- `networkMode`,
- `initialData`,
- `initialDataUpdatedAt`,
- `meta`,
- `notifyOnChangeProps`,
- `placeholderData`,
- `queryKey`,
- `queryKeyHashFn`,
- `refetchInterval`,
- `refetchIntervalInBackground`,
- `refetchOnMount`,
- `refetchOnReconnect`,
- `refetchOnWindowFocus`,
- `retry`,
- `retryOnMount`,
- `retryDelay`,
- `select`,
- `staleTime`,
- `structuralSharing`,
- `throwOnError`.

In addition to the `useQuery` options, react-admin query hooks also accept callbacks props in the `options` argument:

- `onError`
- `onSettled`
- `onSuccess`

See the [Success and Error Side Effects](#success-and-error-side-effects) below for more details.

**Tip**: In react-admin components that use the query hooks, you can override the query options using the `queryOptions` prop. For instance, to log the dataProvider calls, in the `<List>` component, you can do the following:

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

## Mutation Hooks

React-admin provides one mutation hook for each of the Data Provider write methods. These hooks execute the query when you call a callback. They return an array with the following items: `[mutate, { data, isPending, error }]`. `mutate` is a callback that you can call to execute the mutation.

Mutation hooks are:

* [`useCreate`](./useCreate.md) calls `dataProvider.create()`
* [`useUpdate`](./useUpdate.md) calls `dataProvider.update()`
* [`useUpdateMany`](./useUpdateMany.md) calls `dataProvider.updateMany()`
* [`useDelete`](./useDelete.md) calls `dataProvider.delete()`
* [`useDeleteMany`](./useDeleteMany.md) calls `dataProvider.deleteMany()`

Their input signature is the same as the related dataProvider method, e.g.:

```jsx
const [update, { isPending, error, data }] = useUpdate(resource, { id, data, previousData });
// calls dataProvider.update(resource, { id, data, previousData })
```

For instance, here is a button that updates a comment record when clicked, using the `useUpdate` hook:

```jsx
import * as React from 'react';
import { useUpdate, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const [approve, { isPending }] = useUpdate('comments', {
        id: record.id,
        data: { isApproved: true },
        previousData: record
    });
    return <Button label="Approve" onClick={() => approve()} disabled={isPending} />;
};
```

## Mutation Options

Mutation hooks are powered by [React Query](https://tanstack.com/query/v5/)'s [`useMutation`](https://tanstack.com/query/v5/docs/react/reference/useMutation) hook. The third argument of mutation hooks is an `options` object letting you override `useMutation` options:

```jsx
const [update, { data, isPending, error }] = useUpdate(
    'comments',
    { id: record.id, data: { isApproved: true } },
    { 
        onSuccess: () => { /* ... */},
        onError: () => { /* ... */},
    }
);
// translates to
// const { mutate: update, data isPending, error } = useMutation({
//     mutationKey: ['comments', 'update', { id: record.id }],
//     mutationFn: () => dataProvider.update('comments', { id: record.id, data: { isApproved: true } }),
//     onSuccess: () => { /* ... */ }
//     onError: () => { /* ... */ }
// });
```

Check [the useMutation documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation) for a detailed description of all options:

- `gcTime`,
- `meta`,
- `mutationKey`,
- `networkMode`,
- `onError`,
- `onMutate`,
- `onSettled`,
- `onSuccess`,
- `retry`,
- `retryDelay`,
- `throwOnError`.

In addition to the `useMutation` options, react-admin mutation hooks also accept the `mutationMode` option, letting you switch between `pessimistic` rendering, `optimistic` rendering and `undoable` modes. By default, side effect callbacks (`onSuccess`, `onError`, `onSettled`) are "pessimistic", i.e. react-admin executes them after the dataProvider responds. You can switch to "optimistic" to execute them right when the dataProvider is called, without waiting for the response.

```jsx
const [update, { data, isPending, error }] = useUpdate(
    'comments',
    { id: record.id, data: { isApproved: true } },
    { 
        mutationMode: 'optimistic',
        onSuccess: () => { /* ... */},
        onError: () => { /* ... */},
    }
);
```

See [Optimistic Rendering and Undo](#optimistic-rendering-and-undo) below for more details.

**Tip**: In react-admin components that use the mutation hooks, you can override the mutation options using the `mutationOptions` prop. This is very common when using mutation hooks like `useUpdate`, e.g. to display a notification, or redirect to another page. 

For instance, here is a button to approve the current comment that notifies the user of success or failure using the bottom notification banner:

{% raw %}
```jsx
import * as React from 'react';
import { UpdateButton, useNotify, useRedirect } from 'react-admin';

const ApproveButton = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    return <UpdateButton
        label="Approve"
        data={{ isApproved: true }}
        mutationOptions={{
            onSuccess: (data) => {
                // success side effects go here
                redirect('/comments');
                notify('Comment approved');
            },
            onError: (error) => {
                // failure side effects go here 
                notify(`Comment approval error: ${error.message}`, { type: 'error' });
            },
        }}
    />;
};
```
{% endraw %}

## `meta` Parameter

All query and mutation hooks accept a `meta` key in they second argument, in addition to normal parameters. For instance, for `dataProvider.getOne()`:

```jsx
useGetOne('books', { id, meta: /* ... */ });
```

It's the responsibility of your Data Provider to interpret this parameter. React-admin doesn't set this `meta` parameter in its queries, but you can use it in your components to pass special arguments or metadata to an API call.

A common usage is to require additional information from the API. For instance, the following code fetches a book and its author in one call:

```jsx
const { isPending, error, data } = useGetOne(
    'books',
    { id, meta: { _embed: 'authors' } }
);
```

## Success and Error Side Effects

To execute some logic after a query or a mutation is complete, use the `onSuccess`, `onError` and `onSettled` options. Such logic can be showing a notification, redirecting to another page, refreshing the data, etc. React-admin uses the term "side effects" for this type of logic, as it's usually modifying another part of the UI.

**Tip**: React-admin provides the various hooks to handle the most common side effects:

- [`useNotify`](./useNotify.md): Return a function to display a notification.
- [`useRedirect`](./useRedirect.md): Return a function to redirect the user to another page.
- [`useRefresh`](./useRefresh.md): Return a function to force a rerender of the current view (equivalent to pressing the Refresh button).
- [`useUnselect`](./useUnselect.md): Return a function to unselect lines in the current `Datagrid` based on the ids passed to it.
- [`useUnselectAll`](./useUnselectAll.md): Return a function to unselect all lines in the current `Datagrid`.

### `onSuccess`

The `onSuccess` function is called when the query returns. It receives the query data, the [query variables](https://tanstack.com/query/latest/docs/react/guides/query-functions#query-function-variables) or mutation variables and the [query context](https://tanstack.com/query/latest/docs/react/guides/query-functions#queryfunctioncontext). 

```jsx
onSuccess(data, variables, context) { /* ... */ }
``` 

This could be useful when you have different shapes for a resource in lists and single record views. In those cases, you might want to avoid react-admin to prefill the cache.

```tsx
import { useGetList } from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';
import { ListView } from './ListView';

const UserList = () => {
    const queryClient = useQueryClient();

    const { data, isPending, error } = useGetList(
        'users',
        { filters: {}, pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'DESC' } },
        {
            onSuccess: () =>
                queryClient.resetQueries(
                    { queryKey: ['users', 'getOne'] },
                )
        }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <ListView data={data} />;
};
```

### `onError`

The `onError` function is called when the query fails. It receives the error, the [query variables](https://tanstack.com/query/latest/docs/react/guides/query-functions#query-function-variables) and the [query context](https://tanstack.com/query/latest/docs/react/guides/query-functions#queryfunctioncontext). 

```jsx
onError(error, variables, context) { /* ... */ }
```

This is useful to notify users about the error for instance.

```tsx
import { useGetOne, useNotify, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const { data, isPending, error } = useGetOne(
        'users',
        { id: record.id },
        { onError: (error) => notify(error.message, { type: 'error' }) }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

### `onSettled`

The `onSettled` function is called after the query either succeeded or failed. It receives the query data (can be `undefined` if the query failed), the error (can be `undefined` when the query succeeded), the [query variables](https://tanstack.com/query/latest/docs/react/guides/query-functions#query-function-variables) and the [query context](https://tanstack.com/query/latest/docs/react/guides/query-functions#queryfunctioncontext).

```jsx
onSettled(data, error, variables, context) { /* ... */ }
```

This can be useful e.g. to log all calls to the dataProvider:

```jsx
import { useGetOne, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
    const { data, isPending, error } = useGetOne(
        'users',
        { id: record.id },
        { onSettled: (data, error) => console.log(data, error) }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

## `useQuery` and `useMutation`

Internally, react-admin uses [React Query](https://tanstack.com/query/v5/) to call the dataProvider. When fetching data from the dataProvider in your components, if you can't use any of the [query hooks](#query-hooks) and [mutation hooks](#mutation-hooks), you should use that library, too.

It brings several benefits to [manual data fetching](#getting-the-dataprovider-instance):

1. It triggers the loader in the AppBar when the query is running.
2. It reduces the boilerplate code since you don't need to use `useState`, `useEffect` or `useCallback`.
3. It supports a vast array of options
4. It displays stale data while fetching up-to-date data, leading to a snappier UI
5. It cancels the queries automatically when they become out-of-date or inactive

See [Why You Need React Query](https://tkdodo.eu/blog/why-you-want-react-query) for more details.

React Query offers 2 main hooks to interact with the `dataProvider`:

* [`useQuery`](https://tanstack.com/query/v5/docs/react/reference/useQuery): fetches the dataProvider on mount. This is for *read* queries.
* [`useMutation`](https://tanstack.com/query/v5/docs/react/reference/useMutation): fetches the dataProvider when you call a callback. This is for *write* queries, and *read* queries that execute on user interaction.

Both these hooks accept a query *key* (identifying the query in the cache), and a query *function* (executing the query and returning a Promise). Internally, react-admin uses an array of arguments as the query key.

For instance, the initial code snippet of this chapter can be rewritten with `useQuery` as follows:

```jsx
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDataProvider, Loading, Error } from 'react-admin';

const UserProfile = ({ userId }) => {
    const dataProvider = useDataProvider();
    const { data, isPending, error } = useQuery({
        queryKey: ['users', 'getOne', { id: userId }], 
        queryFn: ({ signal }) => dataProvider.getOne('users', { id: userId, signal })
    });

    if (isPending) return <Loading />;
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

**Tip:** You may have noticed that we forward the `signal` parameter from the `queryFn` call to the dataProvider function call -- in this case `getOne`. This is needed to support automatic [Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation). You can learn more about this parameter in the section dedicated to [the `signal` parameter](./DataProviderWriting.md#the-signal-parameter).

To illustrate the usage of `useMutation`, here is an implementation of an "Approve" button for a comment:

```jsx
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDataProvider, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const { mutate, isPending } = useMutation({
        mutationFn: () => dataProvider.update('comments', { id: record.id, data: { isApproved: true } })
    });
    return <Button label="Approve" onClick={() => mutate()} disabled={isPending} />;
};
```

If you want to go beyond data provider method hooks, we recommend that you read [the React Query documentation](https://tanstack.com/query/v5/docs/react/overview).

## `isPending` vs `isLoading` vs `isFetching`

[Query hooks](#query-hooks) and [mutation hooks](#mutation-hooks) actually return more than one loading state variable. They return three: `isPending`, `isFetching`, and `isLoading`.

```jsx
const { data, isPending, isFetching, isLoading } = useGetOne('users', { id: record.id });
```

Which one should you use? The short answer is: use `isPending`. Read on to understand why.

The source of these three variables is [React Query](https://tanstack.com/query/v5/docs/react/reference/useQuery). Here is how they define these variables:

- `isPending`: The query has no data
- `isFetching`: The query function was called and didn't respond yet. This includes background refetching.
- `isLoading`: The query is both pending and fetching

Let's see how what these variables contain in a typical usage scenario:

1. The user first loads a page. `isPending` is true because the data was never loaded, and `isFetching` is also true because data is being fetched. So `isLoading` is also true.
2. The dataProvider returns the data. All three variables become false.
3. The user navigates away
4. The user comes back to the first page, which triggers a new fetch. `isPending` is false, because the stale data is available, and `isFetching` is true because data is being fetched via the dataProvider.
5. The dataProvider returns the data. Both `isPending` and `isFetching` become false

Components use the pending state to show a loading indicator when there is no data to show. In the example above, the loading indicator is necessary for step 2, but not in step 4, because you can display the stale data while fresh data is being loaded.

```jsx
import { useGetOne, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
    const { data, isPending, error } = useGetOne('users', { id: record.id });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

As a consequence, you should always use `isPending` to determine if you need to show a loading indicator.

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
    const { mutate, isPending } = useMutation({
        mutationFn: () => dataProvider.banUser(userId)
    });
    return <Button label="Ban" onClick={() => mutate()} disabled={isPending} />;
};
```


## Synchronizing Dependent Queries

All Data Provider hooks support an `enabled` option. This is useful if you need to have a query executed only when a condition is met. 

For example, the following code only fetches the categories if at least one post is already loaded:

```jsx
// fetch posts
const { data: posts, isPending } = useGetList(
    'posts',
    { pagination: { page: 1, perPage: 20 }, sort: { field: 'name', order: 'ASC' } },
);

// then fetch categories for these posts
const { data: categories, isPending: isPendingCategories } = useGetMany(
    'categories',
    { ids: posts.map(post => posts.category_id) },
    // run only if the first query returns non-empty result
    { enabled: !isPending && posts.length > 0 }
);
```

## Optimistic Rendering and Undo

In the following example, after clicking on the "Approve" button, a loading spinner appears while the data provider is fetched. Then, users are redirected to the comments list. 

```jsx
import * as React from 'react';
import { useUpdate, useNotify, useRedirect, useRecordContext, Button } from 'react-admin';

const ApproveButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { isPending }] = useUpdate(
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
    
    return <Button label="Approve" onClick={() => approve()} disabled={isPending} />;
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
    const [approve, { isPending }] = useUpdate(
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
    return <Button label="Approve" onClick={() => approve()} disabled={isPending} />;
};
```

As you can see in this example, you need to tweak the notification for undoable calls: passing `undo: true` displays the 'Undo' button in the notification. Also, as side effects are executed immediately, they can't rely on the response being passed to onSuccess.

The following hooks accept a `mutationMode` option:

* [`useUpdate`](./useUpdate.md)
* [`useUpdateMany`](./useUpdateMany.md)
* [`useDelete`](./useDelete.md)
* [`useDeleteMany`](./useDeleteMany.md)

## Forcing A Partial Refresh

<iframe src="https://www.youtube-nocookie.com/embed/kMYA9E9Yhbc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

If you need to refresh part of the UI after a user action, you can use TanStack Query's [`invalidateQueries`](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation) function. This function invalidates the cache for a specific query key, forcing a refetch of the data.

For example, the following button deletes an order and refreshes the list of orders so that the deleted order disappears:

```jsx
import { useDataProvider, useNotify } from "react-admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconButton, Tooltip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Order } from "data-generator-retail";

export const OrderCancelButton = ({ order }: Props) => {
  const notify = useNotify();
  const queryClient = useQueryClient();

  const dataProvider = useDataProvider();

  const mutation = useMutation({
    mutationFn: (order: Order) =>
      dataProvider.update("orders", {
        id: order.id,
        data: { status: "cancelled" },
        previousData: order,
      }),
    onSuccess: ({ data: order }) => {
      notify(`Order ${order.reference} cancelled`);
      // refresh the list
      queryClient.invalidateQueries({
        queryKey: ["orders", "getList"],
      });
    },
  });

  const handleCancel = (order: Order) => {
    mutation.mutate(order);
  };

  return (
    <Tooltip title="Cancel order" placement="left">
      <IconButton
        color="error"
        aria-label="Cancel order"
        onClick={() => handleCancel(order)}
        disabled={mutation.isPending}
      >
        <CancelIcon />
      </IconButton>
    </Tooltip>
  );
};
```

`invalidateQuery` requires a query key to identify the query to invalidate. The query key is an array of strings or numbers. You can find the query key for the active queries in the React Query DevTools or in source of the query you use. 

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
