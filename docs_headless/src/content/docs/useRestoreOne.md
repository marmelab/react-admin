---
title: "useRestoreOne"
---

This hook allows calling `dataProvider.restoreOne()` when the callback is executed and restoring a single deleted record based on its `id`.

**Tip:** If you need an undoable UI action, see [`useRestoreWithUndoController`](./useRestoreWithUndoController.md).

**Warning**: The `id` here is the ID of the *deleted record*, and **not** the ID of the actual record that has been deleted.

```tsx
const [restoreOne, { data, isPending, error }] = useRestoreOne(
    { id, meta },
    options,
);
```

The `restoreOne()` method can be called with the same parameters as the hook:

```tsx
const [restoreOne, { data, isPending, error }] = useRestoreOne();

// ...

restoreOne(
    { id, meta },
    options,
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `restoreOne` callback (second example).

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
import { useRestoreOne } from '@react-admin/ra-core-ee';

const RestoreButton = () => {
    const deletedRecord = useRecordContext();
    const [restoreOne, { isPending, error }] = useRestoreOne(
        { id: deletedRecord.id }
    );
    const handleClick = () => {
        restoreOne();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Restore</button>;
};

// set params when calling the restoreOne callback
import { useRecordContext } from 'ra-core';
import { useRestoreOne } from '@react-admin/ra-core-ee';

const HardDeleteButton = () => {
    const deletedRecord = useRecordContext();
    const [restoreOne, { isPending, error }] = useRestoreOne();
    const handleClick = () => {
        restoreOne(
            { id: deletedRecord.id }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isPending} onClick={handleClick}>Restore</button>;
};
```

## TypeScript

The `useRestoreOne` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useRestoreOne<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type DeletedRecordType<Product>
        // TypeScript knows that error is of type Error
    },
});
```
