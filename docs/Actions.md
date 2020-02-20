---
layout: default
title: "Querying the API"
---

# Querying the API

Admin interfaces often have to query the API beyond CRUD requests. For instance, a user profile page may need to get the User object based on a user id. Or, users may want to an "Approve" a comment by pressing a button, and this action should update the `is_approved` property and save the updated record in one click.

React-admin provides special hooks to emit read and write queries to the [`dataProvider`](./DataProviders.md), which in turn sends requests to your API.

## `useDataProvider` Hook

React-admin stores the `dataProvider` object in a React context, so it's available from anywhere in your application code. The `useDataProvider` hook exposes the Data Provider to let you call it directly.

For instance, here is how to query the Data Provider for the current user profile:

```jsx
import React, { useState, useEffect } from 'react';
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

**Tip**: The `dataProvider` returned by the hook is actually a *wrapper* around your Data Provider. This wrapper dispatches Redux actions on load, success and failure, which keeps track of the loading state.

## `useQuery` Hook

The `useQuery` hook calls the Data Provider on mount, and returns an object that updates as the response arrives. It reduces the boilerplate code for calling the Data Provider.

For instance, the previous code snippet can be rewritten with `useQuery` as follows:

```jsx
import React from 'react';
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
- `params`: The query parameters. Depends on the query type.

The return value of `useQuery` is an object representing the query state, using the following keys:

- `data`: `undefined` until the response arrives, then contains the `data` key in the `dataProvider` response
- `total`: `null` until the response arrives, then contains the `total` key in the `dataProvider` response (only for `getList` and `getManyReference` types)
- `error`: `null` unless the `dataProvider` threw an error, in which case it contains that error.
- `loading`: A boolean updating according to the request state
- `loaded`: A boolean updating according to the request state

This object updates according to the request state:

- start: `{ loading: true, loaded: false }`
- success: `{ data: [data from response], total: [total from response], loading: false, loaded: true }`
- error: `{ error: [error from response], loading: false, loaded: true }`

As a reminder, here are the read query types handled by Data Providers:

Type               | Usage                                           | Params format              | Response format
------------------ | ------------------------------------------------|--------------------------- | ---------------
`getList`          | Search for resources                            | `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }` | `{ data: {Record[]}, total: {int} }`
`getOne`           | Read a single resource, by id                   | `{ id: {mixed} }`          | `{ data: {Record} }`
`getMany`          | Read a list of resource, by ids                 | `{ ids: {mixed[]} }`       | `{ data: {Record[]} }`
`getManyReference` | Read a list of resources related to another one | `{ target: {string}, id: {mixed}, pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`     | `{ data: {Record[]} }`

## `useQueryWithStore` Hook

React-admin exposes a more powerful version of `useQuery`. `useQueryWithStore` persist the response from the `dataProvider` in the internal react-admin Redux store, so that result remains available if the hook is called again in the future.  

You can use this hook to show the cached result immediately on mount, while the updated result is fetched from the API. This is called optimistic rendering.

```diff
import React from 'react';
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

## `useMutation` Hook

`useQuery` emits the request to the `dataProvider` as soon as the component mounts. To emit the request based on a user action, use the `useMutation` hook instead. This hook takes the same arguments as `useQuery`, but returns a callback that emits the request when executed.

Here is an implementation of an "Approve" button:

```jsx
import React from 'react';
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

`useQuery` expects a Query argument with the following keys:

- `type`: The method to call on the Data Provider, e.g. `update`
- `resource`: The Resource name, e.g. "posts"
- `params`: The query parameters. Depends on the query type.

The return value of `useQuery` is an array with the following items:

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
- error: `{ error: [error from response], loading: false, loaded: true }`

You can destructure the return value of the `useMutation` hook as `[mutate,  { data, total, error, loading, loaded }]`.

As a reminder, here are the write query types handled by data providers:

Type         | Usage                     | Params format                             | Response format
------------ | --------------------------|------------------------------------------ | ---------------
`create`     | Create a single resource  | `{ data: {Object} }`                      | `{ data: {Record} }`
`update`     | Update a single resource  | `{ id: {mixed}, data: {Object}, previousData: {Object} }` | `{ data: {Record} }`
`updateMany` | Update multiple resources | `{ ids: {mixed[]}, data: {Object} }`      | `{ data: {mixed[]} }` The ids which have been updated
`delete`     | Delete a single resource  | `{ id: {mixed}, previousData: {Object} }` | `{ data: {Record} }`
`deleteMany` | Delete multiple resources | `{ ids: {mixed[]} }`                      | `{ data: {mixed[]} }` The ids which have been deleted

`useMutation` accepts a variant call where the parameters are passed to the callback instead of when calling the hook. Use this variant when some parameters are only known at call time.

```jsx
import React from 'react';
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
import React from 'react';
import { useUpdate, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const [approve, { loading }] = useUpdate('comments', record.id, { isApproved: true }, record);
    return <Button label="Approve" onClick={approve} disabled={loading} />;
};
```

The specialized hooks based on `useQuery` execute on mount:

* `useGetList(resource, pagination, sort, filters)`
* `useGetOne(resource, id)`
* `useGetMany(resource, ids)`
* `useGetManyReference(resource, target, id, pagination, sort, filter, referencingResource)`

The specialized hooks based on `useMutation` return a callback:

* `useCreate(resource, data)`
* `useUpdate(resource, id, data, previousData)`
* `useUpdateMany(resource, ids, data)`
* `useDelete(resource, id)`
* `useDeleteMany(resource, ids)`

## Handling Side Effects In `useDataProvider`

`useDataProvider` returns a `dataProvider` object. Each call to its method return a Promise, allowing to add business logic on success in `then()`, and on failure in `catch()`.

For instance, here is another version of the `<ApproveButton>`  based on `useDataProvider` that notifies the user of success or failure using the bottom notification banner:

```jsx
import React from 'react';
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

- `useNotify`: Return a function to display a notification. The arguments should be a message (it can be a translation key), a level (either `info` or `warning`), an options object to pass to the `translate()` function, and a boolean to set to `true` if the notification should contain an "undo" button.
- `useRedirect`: Return a function to redirect the user to another page. The arguments should be the path to redirect the user to, and the current `basePath`.
- `useRefresh`: Return a function to force a rerender of the current view (equivalent to pressing the Refresh button).
- `useUnselectAll`: Return a function to unselect all lines in the current `Datagrid`. Pass the name of the resource as argument.

## Handling Side Effects In Other Hooks

But the other hooks presented in this chapter, starting with `useMutation`, don't expose the `dataProvider` Promise. To allow for side effects with these hooks, they all accept an additional `options` argument. It's an object with `onSuccess` and `onFailure` functions, that react-admin executes on success... or on failure.

So the `<ApproveButton>` written with `useMutation` instead of `useDataProvider` can specify side effects as follows:

```jsx
import React from 'react';
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

For its own fetch actions, react-admin uses an approach called *optimistic rendering*. The idea is to handle the calls to the `dataProvider` on the client side first (i.e. updating entities in the Redux store), and re-render the screen immediately. The user sees the effect of their action with no delay. Then, react-admin applies the success side effects, and only after that, it triggers the call to the data provider. If the fetch ends with a success, react-admin does nothing more than a refresh to grab the latest data from the server. In most cases, the user sees no difference (the data in the Redux store and the data from the data provider are the same). If the fetch fails, react-admin shows an error notification, and forces a refresh, too.

As a bonus, while the success notification is displayed, users have the ability to cancel the action *before* the data provider is even called.

You can benefit from optimistic rendering when you call the `useMutation` hook, too. You just need to pass `undoable: true` in the options parameter:

```diff
import React from 'react';
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
+           undoable: true,
            onSuccess: ({ data }) => {
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

As you can see in this example, you need to tweak the notification for undoable actions: passing `true` as fourth parameter of `notify` displays the 'Undo' button in the notification.

You can pass the `{ undoable: true }` options parameter to specialized hooks, too. they all accept an optional last argument with side effects.

```jsx
import React from 'react';
import { useUpdate, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [approve, { loading }] = useUpdate(
        'comments',
        record.id,
        { isApproved: true },
        {
            undoable: true,
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

## Customizing the Redux Action

The `useDataProvider` hook dispatches redux actions on load, on success, and on error. By default, these actions are called:

- `CUSTOM_FETCH_LOAD`
- `CUSTOM_FETCH_SUCCESS`
- `CUSTOM_FETCH_FAILURE`

React-admin doesn't have any reducer watching these actions. You can write a custom reducer for these actions to store the return of the Data Provider in Redux. But the best way to do so is to set the hooks dispatch a custom action instead of `CUSTOM_FETCH`. Use the `action` option for that purpose: 

```diff
import React from 'react';
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
            undoable: true,
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
import React from 'react';
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
import React from 'react';
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
import React from 'react';
import { Mutation, useNotify, useRedirect, Button } from 'react-admin';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const payload = { id: record.id, data: { ...record, is_approved: true } };
    const options = {
        undoable: true,
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

And here is the `<UserProfile>` component using the `withDataProvider` HOC instead of the `useProvider` hook:

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

`useQuery`, `useMutation` and `useDataProvider` are "the react-admin way" to query the API, but nothing prevents you from using `fetch` if you want. For instance, when you don't want to add some routing logic to the data provider for a RPC method on your API, that makes perfect sense.

There is no special react-admin sauce in that case. Here is an example implementation of calling `fetch` in a component:

```jsx
// in src/comments/ApproveButton.js
import React, { useState } from 'react';
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
