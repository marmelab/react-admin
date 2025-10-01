---
layout: default
title: "Soft Delete Setup"
---

# Soft Delete Setup

The soft delete feature is an [Enterprise Edition add-on](https://react-admin-ee.marmelab.com/documentation/ra-soft-delete) that allows you to "delete" records without actually removing them from your database. 

Use it to:

- Archive records safely instead of permanent deletion
- Browse and filter all deleted records in a dedicated interface
- Restore archived items individually or in bulk
- Track who deleted what and when

It provides drop-in replacements for DeleteButton and BulkDeleteButton.

## Installation

```bash
npm install --save @react-admin/ra-soft-delete
# or
yarn add @react-admin/ra-soft-delete
```

You will need an active Enterprise Edition license to use this package. Please refer to the [Enterprise Edition documentation](https://marmelab.com/react-admin/enterprise-edition.html) for more details.

## Data Provider 

### Methods

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

### Signature

Here is the full `SoftDeleteDataProvider` interface:

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

**Tip**: `ra-soft-delete` automatically populates the `authorId` parameter using `authProvider.getIdentity()` if it is implemented. It will use the `id` field of the returned identity object. Otherwise this field will be left blank.

**Tip**: Deleted records are immutable, so you don't need to implement an `updateDeleted` method.

Once your provider has all soft-delete methods, pass it to the `<Admin>` component and you're ready to start using `ra-soft-delete`.

```tsx
// in src/App.tsx
import { Admin } from 'react-admin';
import { dataProvider } from './dataProvider';

const App = () => <Admin dataProvider={dataProvider}>{/* ... */}</Admin>;
```

### Deleted Record Structure

A _deleted record_ is an object with the following properties:

- `id`: The identifier of the deleted record.
- `resource`: The resource name of the deleted record.
- `deleted_at`: The date and time when the record was deleted, in ISO 8601 format.
- `deleted_by`: (optional) The identifier of the user who deleted the record.
- `data`: The original record data before deletion.

Here is an example of a deleted record:

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

### Builders

`ra-soft-delete` comes with two built-in implementations that will add soft delete capabilities to your data provider without any specific backend requirements. You can choose the one that best fits your needs:

- `addSoftDeleteBasedOnResource` stores the deleted records for all resources in a single resource. This resource is named `deleted_records` by default.

    With this builder, all deleted records disappear from their original resource when soft-deleted, and are recreated in the `deleted_records` resource.

```tsx
// in src/dataProvider.ts
import { addSoftDeleteBasedOnResource } from '@react-admin/ra-soft-delete';
import baseDataProvider from './baseDataProvider';

export const dataProvider = addSoftDeleteBasedOnResource(
    baseDataProvider,
    { deletedRecordsResourceName: 'deleted_records' }
);
```

- `addSoftDeleteInPlace` keeps the deleted records in the same resource, but marks them as deleted.

    With this builder, all deleted records remain in their original resource when soft-deleted, but are marked with the `deleted_at` and `deleted_by` fields. The query methods (`getList`, `getOne`, etc.) automatically filter out deleted records.

    You'll need to pass a configuration object with all soft deletable resources as key so that `getListDeleted` knows where to look for deleted records.

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

**Note:** When using `addSoftDeleteInPlace`, avoid calling `getListDeleted` without a `resource` filter, as it uses a naive implementation combining multiple `getList` calls, which can lead to bad performance. It is recommended to use one list per resource in this case (see [`<DeletedRecordsList resource>` property](./DeletedRecordsList.md#resource)).

You can also write your own implementation. Feel free to look at these builders source code for inspiration. You can find it under your `node_modules` folder, e.g. at `node_modules/@react-admin/ra-soft-delete/src/dataProvider/addSoftDeleteBasedOnResource.ts`.

### Query and Mutation Hooks 

Each data provider verb has its own hook so you can use them in custom components:

- `softDelete`: [`useSoftDelete`](./useSoftDelete.md)
- `softDeleteMany`: [`useSoftDeleteMany`](./useSoftDeleteMany.md)
- `getListDeleted`: [`useGetListDeleted`](./useGetListDeleted.md)
- `getOneDeleted`: [`useGetOneDeleted`](./useGetOneDeleted.md)
- `restoreOne`: [`useRestoreOne`](./useRestoreOne.md)
- `restoreMany`: [`useRestoreMany`](./useRestoreMany.md)
- `hardDelete`: [`useHardDelete`](./useHardDelete.md)
- `hardDeleteMany`: [`useHardDeleteMany`](./useHardDeleteMany.md)


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
