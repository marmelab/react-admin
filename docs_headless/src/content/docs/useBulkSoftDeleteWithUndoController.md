---
title: "useBulkSoftDeleteWithUndoController"
---

This hook prepares callbacks for a bulk soft-delete button with undo support. It calls `dataProvider.softDeleteMany()` in `undoable` mutation mode, shows a notification, and unselects items from the list.

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
import { useBulkSoftDeleteWithUndoController } from '@react-admin/ra-core-ee';

const BulkSoftDeleteButton = () => {
    const { isPending, handleSoftDeleteMany } =
        useBulkSoftDeleteWithUndoController();

    return (
        <button type="button" onClick={handleSoftDeleteMany} disabled={isPending}>
            Archive selected            
        </button>
    );
};
```

## Parameters

The hook expects an object parameter with the following properties:

- `ids`: The selected record ids to delete. Defaults to `useListContext()` selection.
- `resource`: The resource name. Defaults to `useResourceContext()` when omitted.
- `authorId`: The identifier of the user who performs the action.
- `mutationOptions`: `react-query` mutation options (supports `meta`).
- `successMessage`: A custom notification message key.
- `onClick`: A callback called after the mutation is triggered.

## TypeScript

The `useBulkSoftDeleteWithUndoController` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useBulkSoftDeleteWithUndoController<Product, Error>({
    ids: [1, 2, 3],
    mutationOptions: {
        onError: error => {
            // TypeScript knows that error is of type Error
        },
    },
});
```
