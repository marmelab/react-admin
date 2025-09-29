---
layout: default
title: "Soft Delete Setup"
---

# Soft Delete Setup

## Soft Delete Methods & Signature

`ra-soft-delete` relies on the `dataProvider` to soft-delete, restore or view deleted records.
In order to use the `ra-soft-delete`, you must add a few new methods to your data provider:

- `softDelete` performs the soft deletion of the provided record.
- `softDeleteMany` performs the soft deletion of the provided records.
- `getOneDeleted` gets one deleted record by its ID.
- `getListDeleted` gets a list of deleted records with filters and sort.
- `restoreOne` restores a deleted record.
- `restoreMany` restores deleted records.
- `hardDelete` permanently deletes a record.
- `hardDeleteMany` permanently deletes many records.
- (OPTIONAL) [`createMany`](#createmany) creates multiple records at once. This method is used internally by some data provider implementations to delete or restore multiple records at once. As it is optional, a default implementation is provided that simply calls `create` multiple times.

```tsx
const dataProviderWithSoftDelete: SoftDeleteDataProvider = {
    ...dataProvider,

    softDelete: (resource, params: SoftDeleteParams): SoftDeleteResult => {
        const { id, authorId } = params;
        // ...
        return { data: deletedRecord };
    },
    softDeleteMany: (resource, params: SoftDeleteManyParams): SoftDeleteManyResult => {
        const { ids, authorId } = params;
        // ...
        return { data: deletedRecords };
    },

    getOneDeleted: (params: GetOneDeletedParams): GetOneDeletedResult => {
        const { id } = params;
        // ...
        return { data: deletedRecord };
    },
    getListDeleted: (params: GetListDeletedParams): GetListDeletedResult => {
        const { filter, sort, pagination } = params;
        // ...
        return { data: deletedRecords, total: deletedRecords.length };
    },

    restoreOne: (params: RestoreOneParams): RestoreOneResult => {
        const { id } = params;
        // ...
        return { data: deletedRecord };
    },
    restoreMany: (params: RestoreManyParams): RestoreManyResult => {
        const { ids } = params;
        // ...
        return { data: deletedRecords };
    },

    hardDelete: (params: HardDeleteParams): HardDeleteResult => {
        const { id } = params;
        // ...
        return { data: deletedRecordId };
    },
    hardDeleteMany: (params: HardDeleteManyParams): HardDeleteManyResult => {
        const { ids } = params;
        // ...
        return { data: deletedRecordsIds };
    },
};
```

**Tip**: `ra-soft-delete` will automatically populate the `authorId` using your `authProvider`'s `getIdentity` method if there is one. It will use the `id` field of the returned identity object. Otherwise this field will be left blank.

**Tip**: Deleted records are immutable, so you don't need to implement an `updateDeleted` method.

A _deleted record_ is an object with the following properties:

```js
{
    id: 123,
    resource: "products",
    deleted_at: "2025-06-06T15:32:22Z",
    deleted_by: "johndoe",
    data: {
        id: 456,
        title: "Lorem ipsum",
        teaser: "Lorem ipsum dolor sit amet",
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    },
}
```

`ra-soft-delete` comes with two built-in implementations that will add soft delete capabilities to your data provider:

- [`addSoftDeleteBasedOnResource`](#addsoftdeletebasedonresource) stores the deleted records for all resources in a single `deleted_records` (configurable) resource.
- [`addSoftDeleteInPlace`](#addsoftdeleteinplace) keeps the deleted records in the same resource, but fills `deleted_at` (configurable) and `deleted_by` (configurable) fields.

You can also write your own implementation. Feel free to look at these builders source code for inspiration. You can find it under your `node_modules` folder, e.g. at `node_modules/@react-admin/ra-soft-delete/src/dataProvider/addSoftDeleteBasedOnResource.ts`.

Once your provider has all soft-delete methods, pass it to the `<Admin>` component and you're ready to start using `ra-soft-delete`.

```tsx
// in src/App.tsx
import { Admin } from 'react-admin';
import { dataProvider } from './dataProvider';

const App = () => <Admin dataProvider={dataProvider}>{/* ... */}</Admin>;
```

Each data provider verb has its own hook so you can use them in custom components:

- `softDelete`: [`useSoftDelete`](./useSoftDelete.md)
- `softDeleteMany`: [`useSoftDeleteMany`](./useSoftDeleteMany.md)
- `getListDeleted`: [`useGetListDeleted`](./useGetListDeleted.md)
- `getOneDeleted`: [`useGetOneDeleted`](./useGetOneDeleted.md)
- `restoreOne`: [`useRestoreOne`](./useRestoreOne.md)
- `restoreMany`: [`useRestoreMany`](./useRestoreMany.md)
- `hardDelete`: [`useHardDelete`](./useHardDelete.md)
- `hardDeleteMany`: [`useHardDeleteMany`](./useHardDeleteMany.md)

## `addSoftDeleteBasedOnResource`

Use `addSoftDeleteBasedOnResource` to add the soft delete capabilities to your data provider, storing all deleted records in a single `deleted_records` (configurable) resource.

```tsx
// in src/dataProvider.ts
import { addSoftDeleteBasedOnResource } from '@react-admin/ra-soft-delete';
import baseDataProvider from './baseDataProvider';

export const dataProvider = addSoftDeleteBasedOnResource(
    baseDataProvider,
    { deletedRecordsResourceName: 'deleted_records' }
);
```

## `addSoftDeleteInPlace`

Use `addSoftDeleteInPlace` to add the soft delete capabilities to your data provider, keeping the deleted records in the same resource. This implementation will simply fill the `deleted_at` (configurable) and `deleted_by` (configurable) fields.

You'll need to pass an object with all your resources as key so that `getListDeleted` knows where to look for deleted records.

> **Note on performances:** Avoid calling `getListDeleted` without a `resource` filter, as it uses a naive implementation combining multiple `getList` calls, which can lead to bad performances. It is recommended to use one list per resource in this case (see [`<DeletedRecordsList resource>` property](./DeletedRecordsList.md#resource)).

```tsx
// in src/dataProvider.ts
import { addSoftDeleteInPlace } from '@react-admin/ra-soft-delete';
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

## `createMany`

`ra-soft-delete` provides a default implementation of the `createMany` method that simply calls `create` multiple times. However, some data providers may be able to create multiple records at once, which can greatly improve performances.

```tsx
const dataProviderWithCreateMany = {
    ...dataProvider,
    createMany: (resource, params: CreateManyParams): CreateManyResult => {
        const {data} = params; // data is an array of records.
        // ...
        return {data: createdRecords};
    },
};
```
