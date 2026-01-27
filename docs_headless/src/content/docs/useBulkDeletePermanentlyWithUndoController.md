---
title: "useBulkDeletePermanentlyWithUndoController"
---

This hook prepares callbacks for a bulk delete permanently button with undo support. It calls `dataProvider.hardDeleteMany()` in `undoable` mutation mode, shows a notification, and unselects items from the list.

**Warning**: The `ids` here are the IDs of the *deleted records*, and **not** the IDs of the original records that have been deleted.

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
import { useBulkDeletePermanentlyWithUndoController } from '@react-admin/ra-core-ee';

const BulkDeletePermanentlyButton = () => {
    const { isPending, handleDeleteManyPermanently } =
        useBulkDeletePermanentlyWithUndoController();

    return (
        <button
            type="button"
            onClick={handleDeleteManyPermanently}
            disabled={isPending}
        >
            Delete selected permanently
        </button>
    );
};
```

## Parameters

The hook expects an object parameter with the following properties:

- `ids`: The deleted record ids to delete permanently. Defaults to `useListContext()` selection.
- `mutationOptions`: `react-query` mutation options (supports `meta`).
- `successMessage`: A custom notification message key.
- `onClick`: A callback called after the mutation is triggered.

## TypeScript

The `useBulkDeletePermanentlyWithUndoController` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useBulkDeletePermanentlyWithUndoController<Product, Error>({
    ids: [1, 2, 3],
    mutationOptions: {
        onError: error => {
            // TypeScript knows that error is of type Error
        },
    },
});
```
