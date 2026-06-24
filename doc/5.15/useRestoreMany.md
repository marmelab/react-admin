---
layout: default
title: "The useRestoreMany Hook"
---

# `useRestoreMany`

This hook allows calling `dataProvider.restoreMany()` when the callback is executed and restoring an array of deleted records based on their `ids`.

**Warning**: The `ids` here are the IDs of the *deleted records*, and **not** the IDs of the actual records that have been deleted.

```tsx
const [restoreMany, { data, isPending, error }] = useRestoreMany(
    { ids, meta },
    options,
);
```

The `restoreMany()` method can be called with the same parameters as the hook:

```tsx
const [restoreMany, { data, isPending, error }] = useRestoreMany();

// ...

restoreMany(
    { ids, meta },
    options,
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `restoreMany` callback (second example).

## Usage

```tsx
// set params when calling the hook
import { useListContext } from 'react-admin';
import { useRestoreMany } from '@react-admin/ra-soft-delete';

const BulkRestorePostsButton = () => {
    const { selectedIds } = useListContext();
    const [restoreMany, { isPending, error }] = useRestoreMany(
        { ids: selectedIds }
    );
    const handleClick = () => {
        restoreMany();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Restore selected posts</button>;
};

// set params when calling the restoreMany callback
import { useListContext } from 'react-admin';
import { useRestoreMany } from '@react-admin/ra-soft-delete';

const BulkRestorePostsButton = () => {
    const { selectedIds } = useListContext();
    const [restoreMany, { isPending, error }] = useRestoreMany();
    const handleClick = () => {
        restoreMany(
            { ids: seletedIds }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Restore selected posts</button>;
};
```

## TypeScript

The `useRestoreMany` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useRestoreMany<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type DeletedRecordType<Product>[]
        // TypeScript knows that error is of type Error
    },
});
```