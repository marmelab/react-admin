---
title: "useSoftDeleteWithUndoController"
---

This hook prepares a callback for a soft-delete button with undo support. It calls `dataProvider.softDelete()` in `undoable` mutation mode, shows a notification, and unselects the record.

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
import { useSoftDeleteWithUndoController } from '@react-admin/ra-core-ee';

const SoftDeleteWithUndoButton = props => {
    const record = useRecordContext(props);
    const { isPending, handleSoftDelete } = useSoftDeleteWithUndoController({
        record,
    });

    if (!record) return null;

    return (
        <button type="button" onClick={handleSoftDelete} disabled={isPending}>
            Archive
        </button>
    );
};
```

## Parameters

The hook expects an object parameter with the following properties:

- `record`: The record to soft-delete. Required when `handleSoftDelete` is called.
- `resource`: The resource name. Defaults to `useResourceContext()` when omitted.
- `authorId`: The identifier of the user who performs the action.
- `mutationOptions`: `react-query` mutation options (supports `meta`).
- `successMessage`: A custom notification message key.
- `onClick`: A callback called after the mutation is triggered.

## TypeScript

The `useSoftDeleteWithUndoController` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useSoftDeleteWithUndoController<Product, Error>({
    record,
    mutationOptions: {
        onError: error => {
            // TypeScript knows that error is of type Error
        },
    },
});
```
