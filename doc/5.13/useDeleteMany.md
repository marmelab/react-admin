---
layout: default
title: "useDeleteMany"
---

# `useDeleteMany`

This hook allows to call `dataProvider.deleteMany()` when the callback is executed, and delete an array of records based on their `ids`.

## Syntax

```jsx
const [deleteMany, { data, isPending, error }] = useDeleteMany(
    resource,
    { ids, meta },
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

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `deleteMany` callback (second example below).

## Usage

```jsx
// set params when calling the hook
import { useListContext, useDeleteMany } from 'react-admin';

const BulkDeletePostsButton = () => {
    const { selectedIds } = useListContext();
    const [deleteMany, { isPending, error }] = useDeleteMany(
        'posts',
        { ids: selectedIds }
    );
    const handleClick = () => {
        deleteMany()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
};

// set params when calling the deleteMany callback
import { useListContext, useDeleteMany } from 'react-admin';

const BulkDeletePostsButton = () => {
    const { selectedIds } = useListContext();
    const [deleteMany, { isPending, error }] = useDeleteMany();
    const handleClick = () => {
        deleteMany(
            'posts',
            { ids: selectedIds }
        )
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
};
```

## TypeScript

The `useDeleteMany` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useDeleteMany<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product[]
        // TypeScript knows that error is of type Error
    },
})
```

## Soft Delete

Many applications require a "soft delete" feature, where records are not permanently removed from the database but are instead marked as deleted. This allows for easy recovery of deleted records and helps maintain data integrity.

`useSoftDeleteMany`, part of [the `ra-soft-delete` Enterprise Edition module](https://react-admin-ee.marmelab.com/documentation/ra-soft-delete), works similarly to `useDeleteMany`, but it calls `dataProvider.softDeleteMany()` instead of `dataProvider.deleteMany()`. 

```tsx
const [softDeleteMany, { data, isPending, error }] = useSoftDeleteMany(
    resource,
    { ids, authorId, meta },
    options,
);
```

The `authorId` parameter is optional, and is populated automatically if you have an `authProvider` with a `getIdentity` method.

Check the [Soft Delete documentation](./SoftDeleteDataProvider.md) for more information.