---
layout: default
title: "The useHardDeleteMany Hook"
---

# `useHardDeleteMany`

This hook allows calling `dataProvider.hardDeleteMany()` when the callback is executed and deleting an array of deleted records based on their `ids`.

**Warning**: The `ids` here are the IDs of the *deleted records*, and **not** the IDs of the actual records that have been deleted.

```tsx
const [hardDeleteMany, { data, isPending, error }] = useHardDeleteMany(
    { ids, meta },
    options,
);
```

The `hardDeleteMany()` method can be called with the same parameters as the hook:

```tsx
const [hardDeleteMany, { data, isPending, error }] = useHardDeleteMany();

// ...

hardDeleteMany(
    { ids, meta },
    options,
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `hardDeleteMany` callback (second example).

## Usage

```tsx
// set params when calling the hook
import { useListContext } from 'react-admin';
import { useHardDeleteMany } from '@react-admin/ra-soft-delete';

const BulkHardDeletePostsButton = () => {
    const { selectedIds } = useListContext();
    const [hardDeleteMany, { isPending, error }] = useHardDeleteMany(
        { ids: selectedIds }
    );
    const handleClick = () => {
        hardDeleteMany();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
};

// set params when calling the hardDeleteMany callback
import { useListContext } from 'react-admin';
import { useHardDeleteMany } from '@react-admin/ra-soft-delete';

const BulkHardDeletePostsButton = () => {
    const { selectedIds } = useListContext();
    const [hardDeleteMany, { isPending, error }] = useHardDeleteMany();
    const handleClick = () => {
        hardDeleteMany(
            { ids: seletedIds }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
};
```

## TypeScript

The `useHardDeleteMany` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useHardDeleteMany<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product['id'][]
        // TypeScript knows that error is of type Error
    },
});
```