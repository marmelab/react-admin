---
title: "useSoftDeleteMany"
---

This hook allows calling `dataProvider.softDeleteMany()` when the callback is executed and deleting an array of records based on their `ids`.

**Tip:** If you need an undoable UI action, see [`useBulkSoftDeleteWithUndoController`](./useBulkSoftDeleteWithUndoController.md).

```tsx
const [softDeleteMany, { data, isPending, error }] = useSoftDeleteMany(
    resource,
    { ids, authorId, meta },
    options,
);
```

The `softDeleteMany()` method can be called with the same parameters as the hook:

```tsx
const [softDeleteMany, { data, isPending, error }] = useSoftDeleteMany();

// ...

softDeleteMany(
    resource,
    { ids, authorId, meta },
    options,
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `softDeleteMany` callback (second example).

**Tip**: If it's not provided, `useSoftDeleteMany` will automatically populate the `authorId` using your `authProvider`'s `getIdentity` method if there is one. It will use the `id` field of the returned identity object. Otherwise this field will be left blank.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
// set params when calling the hook
import { useListContext } from 'ra-core';
import { useSoftDeleteMany } from '@react-admin/ra-core-ee';

const BulkSoftDeletePostsButton = () => {
    const { selectedIds } = useListContext();
    const [softDeleteMany, { isPending, error }] = useSoftDeleteMany(
        'posts',
        { ids: selectedIds }
    );
    const handleClick = () => {
        softDeleteMany();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
};

// set params when calling the softDeleteMany callback
import { useListContext } from 'ra-core';
import { useSoftDeleteMany } from '@react-admin/ra-core-ee';

const BulkSoftDeletePostsButton = () => {
    const { selectedIds } = useListContext();
    const [softDeleteMany, { isPending, error }] = useSoftDeleteMany();
    const handleClick = () => {
        softDeleteMany(
            'posts',
            { ids: seletedIds }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete selected posts</button>;
};
```

## TypeScript

The `useSoftDeleteMany` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useSoftDeleteMany<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product[]
        // TypeScript knows that error is of type Error
    },
});
```
