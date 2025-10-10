---
title: "useSoftDelete"
---

This hook allows calling `dataProvider.softDelete()` when the callback is executed and deleting a single record based on its `id`.

```tsx
const [softDeleteOne, { data, isPending, error }] = useSoftDelete(
    resource,
    { id, authorId, previousData, meta },
    options,
);
```

The `softDeleteOne()` method can be called with the same parameters as the hook:

```tsx
const [softDeleteOne, { data, isPending, error }] = useSoftDelete();

// ...

softDeleteOne(
    resource,
    { id, authorId, previousData, meta },
    options,
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `softDeleteOne` callback (second example).

**Tip**: If it's not provided, `useSoftDelete` will automatically populate the `authorId` using your `authProvider`'s `getIdentity` method if there is one. It will use the `id` field of the returned identity object. Otherwise this field will be left blank.

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
import { useRecordContext } from 'ra-core';
import { useSoftDelete } from '@react-admin/ra-core-ee';

const SoftDeleteButton = () => {
    const record = useRecordContext();
    const [softDeleteOne, { isPending, error }] = useSoftDelete(
        'likes',
        { id: record.id, previousData: record }
    );
    const handleClick = () => {
        softDeleteOne();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete</button>;
};

// set params when calling the softDeleteOne callback
import { useRecordContext } from 'ra-core';
import { useSoftDelete } from '@react-admin/ra-core-ee';

const SoftDeleteButton = () => {
    const record = useRecordContext();
    const [softDeleteOne, { isPending, error }] = useSoftDelete();
    const handleClick = () => {
        softDeleteOne(
            'likes',
            { id: record.id, previousData: record }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete</button>;
};
```

## TypeScript

The `useSoftDelete` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useSoftDelete<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product
        // TypeScript knows that error is of type Error
    },
});
```