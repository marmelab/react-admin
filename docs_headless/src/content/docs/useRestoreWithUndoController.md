---
title: "useRestoreWithUndoController"
---

This hook prepares a callback for a restore button with undo support. It calls `dataProvider.restoreOne()` in `undoable` mutation mode, shows a notification, and unselects the record in the deleted records list.

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
import { useRestoreWithUndoController } from '@react-admin/ra-core-ee';

const RestoreWithUndoButton = props => {
    const record = useRecordContext(props);
    const { isPending, handleRestore } = useRestoreWithUndoController({
        record,
    });

    if (!record) return null;

    return (
        <button type="button" onClick={handleRestore} disabled={isPending}>
            Restore
        </button>
    );
};
```

## Parameters

The hook expects an object parameter with the following properties:

- `record`: The deleted record to restore. Required when `handleRestore` is called.
- `mutationOptions`: `react-query` mutation options (supports `meta`).
- `successMessage`: A custom notification message key.
- `onClick`: A callback called after the mutation is triggered.

## TypeScript

The `useRestoreWithUndoController` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useRestoreWithUndoController<Product, Error>({
    record,
    mutationOptions: {
        onError: error => {
            // TypeScript knows that error is of type Error
        },
    },
});
```
