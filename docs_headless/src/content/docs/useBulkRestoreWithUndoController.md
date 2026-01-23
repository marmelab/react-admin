---
title: "useBulkRestoreWithUndoController"
---

This hook prepares callbacks for a bulk restore button with undo support. It calls `dataProvider.restoreMany()` in `undoable` mutation mode, shows a notification, and unselects items from the list.

**Warning**: The `ids` here are the IDs of the *deleted records*, and **not** the IDs of the actual records that have been deleted.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
import * as React from 'react';
import { useBulkRestoreWithUndoController } from '@react-admin/ra-core-ee';

const BulkRestoreButton = () => {
    const { isPending, handleBulkRestore } = useBulkRestoreWithUndoController();

    return (
        <button type="button" onClick={handleBulkRestore} disabled={isPending}>
            Restore selected
        </button>
    );
};
```

## Parameters

The hook expects an object parameter with the following properties:

- `ids`: The deleted record ids to restore. Defaults to `useListContext()` selection.
- `mutationOptions`: `react-query` mutation options (supports `meta`).
- `successMessage`: A custom notification message key.
- `onClick`: A callback called after the mutation is triggered.

## TypeScript

The `useBulkRestoreWithUndoController` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useBulkRestoreWithUndoController<Product, Error>({
    ids: [1, 2, 3],
    mutationOptions: {
        onError: error => {
            // TypeScript knows that error is of type Error
        },
    },
});
```
