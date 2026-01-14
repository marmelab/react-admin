---
title: "useDeletePermanentlyWithUndoController"
---

This hook prepares a callback for a delete permanently button with undo support. It calls `dataProvider.hardDelete()` in `undoable` mutation mode, shows a notification, and unselects the record in the deleted records list.

**Warning**: The `record.id` here is the ID of the *deleted record*, and **not** the ID of the original record.

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
import { useRecordContext } from 'ra-core';
import { useDeletePermanentlyWithUndoController } from '@react-admin/ra-core-ee';

const DeletePermanentlyWithUndoButton = props => {
    const record = useRecordContext(props);
    const { isPending, handleDeletePermanently } =
        useDeletePermanentlyWithUndoController({
            record,
        });

    if (!record) return null;

    return (
        <button type="button" onClick={handleDeletePermanently} disabled={isPending}>
            Delete permanently
        </button>
    );
};
```

## Parameters

The hook expects an object parameter with the following properties:

- `record`: The deleted record to delete permanently. Required when `handleDeletePermanently` is called.
- `mutationOptions`: `react-query` mutation options (supports `meta`).
- `successMessage`: A custom notification message key.
- `onClick`: A callback called after the mutation is triggered.

## TypeScript

The `useDeletePermanentlyWithUndoController` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useDeletePermanentlyWithUndoController<Product, Error>({
    record,
    mutationOptions: {
        onError: error => {
            // TypeScript knows that error is of type Error
        },
    },
});
```
