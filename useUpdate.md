---
layout: default
title: "useUpdate"
---

# `useUpdate`

`useUpdate` provides a callback to call `dataProvider.update()` on demand and update a single record based on its `id` and a `data` argument. It uses React-query's [`useMutation`](https://tanstack.com/query/v5/docs/react/reference/useMutation) hook under the hood.

## Syntax

`useUpdate` requires no arguments and returns an array with a callback and a mutation state. Set the update `resource` and `params` when calling the callback:

```jsx
const [update, { isPending }] = useUpdate();
const handleClick = () => {
    update(resource, params, options);
};
```

Alternatively, you can pass the arguments at definition time and call the callback without arguments:

```jsx
const [update, { isPending }] = useUpdate(resource, params, options);
const handleClick = () => {
    update();
};
```

It's up to you to pick the syntax that best suits your component. If you have the choice, we recommend using the first syntax.

The `params` argument is an object that lets you specify the `id` of the record to update and the new data for the record. It can optionally specify the `previousData` and a `meta` parameter.

```jsx
update('post', { id: 123, data: { isPublished: true } });
```

The `options` argument is optional.

## Usage

Here is an example of a `LikeButton` component that increments the `likes` field of a record when clicked:

```jsx
import { useUpdate, useRecordContext } from 'react-admin';

const LikeButton = () => {
    const record = useRecordContext();
    const [update, { isPending }] = useUpdate();
    const notify = useNotify();
    const handleClick = () => {
        if (!record) throw new Error('LikeButton must be called with a RecordContext');
        const data = { likes: record.likes + 1 };
        update(
            'posts',
            { id: record.id, data, previousData: record };
            {
                onSuccess: () => {
                    notify('Like updated');
                },
                onError: (error) => {
                    notify('Error: like not updated', { type: 'error' });
                },
            }
        )
    }
    return <button disabled={isPending} onClick={handleClick}>Like</button>;
};
```

## Params

The second argument of the `useUpdate` hook is an object with the following properties:

- `id`: the identifier of the record to update,
- `data`: the new data for the record,
- `previousData`: the record before the update (optional),
- `meta`: an object to pass additional information to the dataProvider (optional).

```jsx
const IncreaseLikeButton = () => {
    const record = useRecordContext();
    const [update] = useUpdate();
    const handleClick = () => {
        if (!record) throw new Error('LikeButton must be called with a RecordContext');
        const params = { 
            id: record.id,
            data: { likes: record.likes + 1 },
            previousData: record
        };
        update('posts', params);
    }
    return <button onClick={handleClick}>Like</button>;
};
```

`id` should be the identifier of the record to update. If it's empty, the mutation will fail.

`data` can be the complete record or just the fields to update. The data provider will merge the new data with the existing record.

`previousData` should be the current record value. It's useful for data providers that need to compute a diff to use a `PATCH` request instead of a `PUT` request. React-admin components systematically include this parameter when calling the `update` callback.

`meta` is helpful for passing additional information to the dataProvider. For instance, you can pass the current user to let a server-side audit system know who made the change.

## Options

`useUpdate`'s third parameter is an `options` object with the following properties:

- `mutationMode`,
- `onError`,
- `onSettled`,
- `onSuccess`,

```jsx
const notify = useNotify();
const redirect = useRedirect();
const [update, { isPending }] = useUpdate(
    'comments',
    { id: record.id, data: { isApproved: true } },
    {
        mutationMode: 'optimistic',
        onSuccess: () => {
            notify('Comment approved');
            redirect('/comments');
        },
        onError: (error) => {
            notify(`Comment approval error: ${error.message}`, { type: 'error' });
        },
    }
);
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

**Tip**: In react-admin components that use `useUpdate`, you can override the mutation options using the `mutationOptions` prop. This is very common when using mutation hooks like `useUpdate`, e.g., to display a notification or redirect to another page.

For instance, here is a button using `<UpdateButton mutationOptions>` to notify the user of success or failure using the bottom notification banner:

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
            mutationMode: 'optimistic',
            onSuccess: () => {
                notify('Comment approved');
                redirect('/comments');
            },
            onError: (error) => {
                notify(`Comment approval error: ${error.message}`, { type: 'error' });
            },
        }}
    />;
};
```
{% endraw %}

The components that support mutation options are:

- [`<Edit>`](./Edit.md),
- [`<EditBase>`](./EditBase.md),
- [`<EditDialog>`](./EditDialog.md),
- [`<EditInDialogButton>`](./EditInDialogButton.md),
- [`<Create>`](./Create.md),
- [`<CreateBase>`](./CreateBase.md),
- [`<CreateDialog>`](./CreateDialog.md),
- [`<CreateInDialogButton>`](./CreateInDialogButton.md),
- [`<SaveButton>`](./SaveButton.md),
- [`<UpdateButton>`](./UpdateButton.md),
- [`<Calendar>`](./Calendar.md#calendar),
- [`<CompleteCalendar>`](./Calendar.md#completecalendar),
- [`<DatagridAG>`](./DatagridAG.md),
- [`<TreeWithDetails>`](./TreeWithDetails.md).

## Return Value

The `useUpdate` hook returns an array with two values:

- the `update` callback, and
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

The `update` callback can be called with a `resource` and a `param` argument, or, if these arguments were defined when calling `useUpdate`, with no argument at all:

```jsx
// Option 1: define the resource and params when calling the callback
const [update, { isPending }] = useUpdate();
const handleClick = () => {
    update(resource, params, options);
};

// Option 2: define the resource and params when calling the hook
const [update, { isPending }] = useUpdate(resource, params, options);
const handleClick = () => {
    update();
};
```

For a detailed description of the mutation state, check React-query's [`useMutation` documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation).

Since `useUpdate` is mainly used in event handlers, success and error side effects are usually handled in the `onSuccess` and `onError` callbacks. In most cases, the mutation state is just used to disable the update button while the mutation is pending.

## `mutationMode`

The `mutationMode` option lets you switch between three rendering modes, which change how the success side effects are triggered:

- `pessimistic` (the default)
- `optimistic`, and
- `undoable`

Here is an example of using the `optimistic` mode:

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

In `pessimistic` mode, the `onSuccess` side effect executes *after* the dataProvider responds.

In `optimistic` mode, the `onSuccess` side effect executes just before the `dataProvider.update()` is called, without waiting for the response.

In `undoable` mode, the `onSuccess` side effect fires immediately. The actual call to the dataProvider is delayed until the update notification hides. If the user clicks the undo button, the `dataProvider.update()` call is never made.

See [Optimistic Rendering and Undo](./Actions.md#optimistic-rendering-and-undo) for more details.

**Tip**: If you need a side effect to be triggered after the dataProvider response in `optimistic` and `undoable` modes, use the `onSettled` callback.

## `onError`

The `onError` callback is called when the mutation fails. It's the perfect place to display an error message to the user.

```jsx
const notify = useNotify();
const [update, { data, isPending, error }] = useUpdate(
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
const [update, { data, isPending, error }] = useUpdate(
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
const [update, { data, isPending, error }] = useUpdate(
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

In `pessimistic` mutation mode, `onSuccess` executes *after* the `dataProvider.update()` responds. React-admin passes the result of the `dataProvider.update()` call as the first argument to the `onSuccess` callback.

In `optimistic` mutation mode, `onSuccess` executes *before* the `dataProvider.update()` is called, without waiting for the response. The callback receives no argument.

In `undoable` mutation mode, `onSuccess` executes *before* the `dataProvider.update()` is called. The actual call to the dataProvider is delayed until the update notification hides. If the user clicks the undo button, the `dataProvider.update()` call is never made. The callback receives no argument.

## TypeScript

The `useUpdate` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useUpdate<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product
        // TypeScript knows that error is of type Error
    },
})
```
