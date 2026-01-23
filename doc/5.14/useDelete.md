---
layout: default
title: "useDelete"
storybook_path: ra-core-dataprovider-usedelete-optimistic--success-case
---

# `useDelete`

This hook allows calling `dataProvider.delete()` when the callback is executed and deleting a single record based on its `id`.

## Syntax

```jsx
const [deleteOne, { data, isPending, error }] = useDelete(
    resource,
    { id, previousData, meta },
    options
);
```

The `deleteOne()` method can be called with the same parameters as the hook:

```jsx
deleteOne(
    resource,
    { id, previousData },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `deleteOne` callback (second example below).

## Usage

```jsx
// set params when calling the hook
import { useDelete, useRecordContext } from 'react-admin';

const DeleteButton = () => {
    const record = useRecordContext();
    const [deleteOne, { isPending, error }] = useDelete(
        'likes',
        { id: record.id, previousData: record }
    );
    const handleClick = () => {
        deleteOne();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete</button>;
};

// set params when calling the deleteOne callback
import { useDelete, useRecordContext } from 'react-admin';

const DeleteButton = () => {
    const record = useRecordContext();
    const [deleteOne, { isPending, error }] = useDelete();
    const handleClick = () => {
        deleteOne(
            'likes',
            { id: record.id , previousData: record }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete</button>;
};
```

## TypeScript

The `useDelete` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useDelete<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product
        // TypeScript knows that error is of type Error
    },
})
```

## Soft Delete

Many applications require a "soft delete" feature, where records are not permanently removed from the database but are instead marked as deleted. This allows for easy recovery of deleted records and helps maintain data integrity.

`useSoftDelete`, part of [the `ra-soft-delete` Enterprise Edition module](https://react-admin-ee.marmelab.com/documentation/ra-soft-delete), works similarly to `useDelete`, but it calls `dataProvider.softDelete()` instead of `dataProvider.delete()`. 

```tsx
const [softDeleteOne, { data, isPending, error }] = useSoftDelete(
    resource,
    { id, authorId, previousData, meta },
    options,
);
```

The `authorId` parameter is optional, and is populated automatically if you have an `authProvider` with a `getIdentity` method.

Check the [Soft Delete documentation](./SoftDeleteDataProvider.md) for more information.