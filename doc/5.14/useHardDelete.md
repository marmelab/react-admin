---
layout: default
title: "The useHardDelete Hook"
---

# `useHardDelete`

This hook allows calling `dataProvider.hardDelete()` when the callback is executed and deleting a single deleted record based on its `id`.

**Warning**: The `id` here is the ID of the *deleted record*, and **not** the ID of the actual record that has been deleted.

```tsx
const [hardDeleteOne, { data, isPending, error }] = useHardDelete(
    { id, previousData, meta },
    options,
);
```

The `hardDeleteOne()` method can be called with the same parameters as the hook:

```tsx
const [hardDeleteOne, { data, isPending, error }] = useHardDelete();

// ...

hardDeleteOne(
    { id, previousData, meta },
    options,
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `hardDeleteOne` callback (second example).

## Usage

```tsx
// set params when calling the hook
import { useRecordContext } from 'react-admin';
import { useHardDelete } from '@react-admin/ra-soft-delete';

const HardDeleteButton = () => {
    const deletedRecord = useRecordContext();
    const [hardDeleteOne, { isPending, error }] = useHardDelete(
        { id: deletedRecord.id, previousData: record }
    );
    const handleClick = () => {
        hardDeleteOne();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete</button>;
};

// set params when calling the hardDeleteOne callback
import { useRecordContext } from 'react-admin';
import { useHardDelete } from '@react-admin/ra-soft-delete';

const HardDeleteButton = () => {
    const deletedRecord = useRecordContext();
    const [hardDeleteOne, { isPending, error }] = useHardDelete();
    const handleClick = () => {
        hardDeleteOne(
            { id: deletedRecord.id, previousData: record }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Delete</button>;
};
```

## TypeScript

The `useHardDelete` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useHardDelete<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type DeletedRecordType<Product>
        // TypeScript knows that error is of type Error
    },
});
```
