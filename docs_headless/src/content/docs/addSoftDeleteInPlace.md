---
title: "addSoftDeleteInPlace"
---

This helper function wraps an existing [`dataProvider`](./DataProviders.md) to add the soft delete capabilities, keeping the deleted records in the same resource. This implementation will simply fill the `deleted_at` (configurable) and `deleted_by` (configurable) fields.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

You'll need to pass an object with all your resources as key so that `getListDeleted` knows where to look for deleted records.

> **Note on performances:** Avoid calling `getListDeleted` without a `resource` filter, as it uses a naive implementation combining multiple `getList` calls, which can lead to bad performances. It is recommended to use one list per resource in this case (see [`resource` property](./getListDeleted.md#resource)).

```tsx
// in src/dataProvider.ts
import { addSoftDeleteInPlace } from '@react-admin/ra-core-ee';
import baseDataProvider from './baseDataProvider';

export const dataProvider = addSoftDeleteInPlace(
    baseDataProvider,
    {
        posts: {},
        comments: {
            deletedAtFieldName: 'deletion_date',
        },
        accounts: {
            deletedAtFieldName: 'disabled_at',
            deletedByFieldName: 'disabled_by',
        }
    }
);
```
