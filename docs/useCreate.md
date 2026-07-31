---
layout: default
title: "useCreate"
storybook_path: ra-core-dataprovider-usecreate-optimistic--success-case
---

# `useCreate`

This hook allows to call `dataProvider.create()` when the callback is executed.

## Syntax

```tsx
const [create, { data, isPending, error }] = useCreate(
    resource,
    { data, meta },
    options
);
```

The `create()` method can be called with the same parameters as the hook:

```tsx
create(
    resource,
    { data },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `create` callback (second example below).

## Usage

```tsx
// set params when calling the hook
import { useCreate, useRecordContext } from 'react-admin';

const LikeButton = () => {
    const record = useRecordContext();
    const like = { postId: record.id };
    const [create, { isPending, error }] = useCreate('likes', { data: like });
    const handleClick = () => {
        create()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Like</button>;
};

// set params when calling the create callback
import { useCreate, useRecordContext } from 'react-admin';

const LikeButton = () => {
    const record = useRecordContext();
    const like = { postId: record.id };
    const [create, { isPending, error }] = useCreate();
    const handleClick = () => {
        create('likes', { data: like })
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Like</button>;
};
```

## Params

The second argument of the `useCreate` hook is an object with the following properties:

- `data`: the new data for the record,
- `meta`: an object to pass additional information to the dataProvider (optional).

```tsx
const LikeButton = () => {
    const record = useRecordContext();
    const like = { postId: record.id };
    const [create, { isPending, error }] = useCreate('likes', { data: like });
    const handleClick = () => {
        create()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Like</button>;
};
```

`data` the record to create.

`meta` is helpful for passing additional information to the dataProvider. For instance, you can pass the current user to let a server-side audit system know who made the creation.

## Options

`useCreate`'s third parameter is an `options` object with the following properties:

- `mutationMode`,
- `onError`,
- `onSettled`,
- `onSuccess`,
- `returnPromise`.

```tsx
const notify = useNotify();
const redirect = useRedirect();

const [create, { isPending, error }] = useCreate(
    'likes',
    { data: { id: uuid.v4(), postId: record.id } },
    {
        mutationMode: 'optimistic',
        onSuccess: () => {
            notify('Like created');
            redirect('/reviews');
        },
        onError: (error) => {
            notify(`Like creation error: ${error.message}`, { type: 'error' });
        },
    });

```

Additional options are passed to [React Query](https://tanstack.com/query/v5/)'s [`useMutation`](https://tanstack.com/query/v5/docs/react/reference/useMutation) hook. This includes:

- `gcTime`,
- `networkMode`,
- `onMutate`,
- `retry`,
- `retryDelay`,
- `mutationKey`,
- `throwOnError`.

Check [the useMutation documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation) for a detailed description of all options.

**Tip**: In react-admin components that use `useCreate`, you can override the mutation options using the `mutationOptions` prop. This is very common when using mutation hooks like `useCreate`, e.g., to display a notification or redirect to another page.

For instance, here is a button using `<Create mutationOptions>` to notify the user of success using the bottom notification banner:

{% raw %}
```tsx
import * as React from 'react';
import { useNotify, useRedirect, Create, SimpleForm } from 'react-admin';

const PostCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect(`/posts/${data.id}`);
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

## Return Value

The `useCreate` hook returns an array with two values:

- the `create` callback, and
- a mutation state object with the following properties:
  - `data`,
  - `error`,
  - `isError`,
  - `isIdle`,
  - `isPending`,
  - `isPaused`,
  - `isSuccess`,
  - `failureCount`,
  - `failureReason`,
  - `mutate`,
  - `mutateAsync`,
  - `reset`,
  - `status`,
  - `submittedAt`,
  - `variables`.

The `create` callback can be called with a `resource` and a `param` argument, or, if these arguments were defined when calling `useCreate`, with no argument at all:

```jsx
// Option 1: define the resource and params when calling the callback
const [create, { isPending }] = useCreate();
const handleClick = () => {
    create(resource, params, options);
};

// Option 2: define the resource and params when calling the hook
const [create, { isPending }] = useCreate(resource, params, options);
const handleClick = () => {
    create();
};
```

For a detailed description of the mutation state, check React-query's [`useMutation` documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation).

Since `useCreate` is mainly used in event handlers, success and error side effects are usually handled in the `onSuccess` and `onError` callbacks. In most cases, the mutation state is just used to disable the save button while the mutation is pending.

## `mutationMode`

The `mutationMode` option lets you switch between three rendering modes, which change how the success side effects are triggered:

- `pessimistic` (the default)
- `optimistic`, and
- `undoable`

**Note**: For `optimistic` and `undoable` modes, the record `id` must be generated client side. Those two modes are useful when building local first applications.

Here is an example of using the `optimistic` mode:

```jsx
// In optimistic mode, ids must be generated client side
const id = uuid.v4();
const [create, { data, isPending, error }] = useCreate(
    'comments',
    { data: { id, message: 'Lorem ipsum' } },
    { 
        mutationMode: 'optimistic',
        onSuccess: () => { /* ... */},
        onError: () => { /* ... */},
    }
);
```

In `pessimistic` mode, the `onSuccess` side effect executes *after* the dataProvider responds.

In `optimistic` mode, the `onSuccess` side effect executes just before the `dataProvider.create()` is called, without waiting for the response.

In `undoable` mode, the `onSuccess` side effect fires immediately. The actual call to the dataProvider is delayed until the create notification hides. If the user clicks the undo button, the `dataProvider.create()` call is never made.

See [Optimistic Rendering and Undo](./Actions.md#optimistic-rendering-and-undo) for more details.

**Tip**: If you need a side effect to be triggered after the dataProvider response in `optimistic` and `undoable` modes, use the `onSettled` callback.

## `onError`

The `onError` callback is called when the mutation fails. It's the perfect place to display an error message to the user.

```jsx
const notify = useNotify();
const [create, { data, isPending, error }] = useCreate(
    'comments',
    { id: record.id, data: { isApproved: true } },
    { 
        onError: () => {
            notify('Error: comment not approved',  { type: 'error' });
        },
    }
);
```

**Note**: If you use the `retry` option, the `onError` callback is called only after the last retry has failed.

## `onSettled`

The `onSettled` callback is called at the end of the mutation, whether it succeeds or fails. It will receive either the `data` or the `error`.

```jsx
const notify = useNotify();
const [create, { data, isPending, error }] = useCreate(
    'comments',
    { id: record.id, data: { isApproved: true } },
    { 
        onSettled: (data, error) => {
            // ...
        },
    }
);
```

**Tip**: The `onSettled` callback is perfect for calling a success side effect after the dataProvider response in `optimistic` and `undoable` modes.

## `onSuccess`

The `onSuccess` callback is called when the mutation succeeds. It's the perfect place to display a notification or to redirect the user to another page.

```jsx
const notify = useNotify();
const redirect = useRedirect();
const [create, { data, isPending, error }] = useCreate(
    'comments',
    { id: record.id, data: { isApproved: true } },
    { 
        onSuccess: () => {
            notify('Comment approved');
            redirect('/comments');
        },
    }
);
```

In `pessimistic` mutation mode, `onSuccess` executes *after* the `dataProvider.create()` responds. React-admin passes the result of the `dataProvider.create()` call as the first argument to the `onSuccess` callback.

In `optimistic` mutation mode, `onSuccess` executes *before* the `dataProvider.create()` is called, without waiting for the response. The callback receives no argument.

In `undoable` mutation mode, `onSuccess` executes *before* the `dataProvider.create()` is called. The actual call to the dataProvider is delayed until the create notification hides. If the user clicks the undo button, the `dataProvider.create()` call is never made. The callback receives no argument.

## `returnPromise`

By default, the `create` callback that `useCreate` returns is synchronous and returns nothing. To execute a side effect after the mutation has succeeded, you can use the `onSuccess` callback.

If this is not enough, you can use the `returnPromise` option so that the `create` callback returns a promise that resolves when the mutation has succeeded and rejects when the mutation has failed.

This can be useful if the server changes the record, and you need the newly created data to create/update another record. 

```jsx
const [createPost] = useCreate(
    'posts',
    { id: record.id, data: { isPublished: true } },
    { returnPromise: true }
);
const [createAuditLog] = useCreate('auditLogs');

const createPost = async () => {
    try {
        const post = await createPost();
        createAuditLog('auditLogs', { data: { action: 'create', recordId: post.id, date: post.createdAt } });
    } catch (error) {
        // handle error
    }
};
```

## TypeScript

The `useCreate` hook accepts a generic parameter for the record type and another for the error type:

```tsx
type Product = {
    id: number;
    reference: string;
}

useCreate<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product
        // TypeScript knows that error is of type Error
    },
})
```
