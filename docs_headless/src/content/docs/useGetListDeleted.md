---
title: "useGetListDeleted"
---

This hook calls `dataProvider.getListDeleted()` when the component mounts. It's ideal for getting a list of deleted records. It supports filtering, sorting and pagination.

```tsx
const { data, total, isPending, error, refetch, meta } = useGetListDeleted(
    {
        pagination: { page, perPage },
        sort: { field, order },
        filter,
        meta
    },
    options
);
```

The `meta` argument is optional. It can be anything you want to pass to the data provider, e.g. a list of fields to show in the result. It is distinct from the `meta` property of the response, which may contain additional metadata returned by the data provider.

The options parameter is optional, and is passed to react-query's `useQuery` hook. Check [react-query's `useQuery` hook documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) for details on all available option.

The react-query [query key](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys) for this hook is `['getListDeleted', { pagination, sort, filter, meta }]`.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

Call the `useGetListDeleted` hook when you need to fetch a list of deleted records from the data provider.

```tsx
import { useGetListDeleted } from '@react-admin/ra-core-ee';

const LatestDeletedPosts = () => {
    const { data, total, isPending, error } = useGetListDeleted(
        { 
            filter: { resource: "posts" },
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'deleted_at', order: 'DESC' }
        }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <>
            <h1>Latest deleted posts</h1>
            <ul>
                {data.map(deletedRecord =>
                    <li key={deletedRecord.id}>{deletedRecord.data.title}</li>
                )}
            </ul>
            <p>{data.length} / {total} deleted posts</p>
        </>
    );
};
```

If you need to learn more about pagination, sort or filter, please refer to [`useGetList` documentation](./useGetList.md), as `useGetListDeleted` implements these parameters the same way.

## TypeScript

The `useGetListDeleted` hook accepts a generic parameter for the record type:

```tsx
import { useGetListDeleted } from '@react-admin/ra-core-ee';

const LatestDeletedPosts = () => {
    const { data, total, isPending, error } = useGetListDeleted<Post>(
        { 
            filter: { resource: "posts" },
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'deleted_at', order: 'DESC' }
        }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <>
            <h1>Latest deleted posts</h1>
            <ul>
                {/* TypeScript knows that data is of type DeletedRecordType<Post>[] */}
                {data.map(deletedRecord =>
                    <li key={deletedRecord.id}>{deletedRecord.data.title}</li>
                )}
            </ul>
            <p>{data.length} / {total} deleted posts</p>
        </>
    );
};
```