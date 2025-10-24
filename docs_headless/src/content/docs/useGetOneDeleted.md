---
title: "useGetOneDeleted"
---

This hook calls `dataProvider.getOneDeleted()` when the component mounts. It queries the data provider for a single deleted record, based on its id.

```tsx
const { data, isPending, error, refetch } = useGetOne(
    { id, meta },
    options
);
```

The `meta` argument is optional. It can be anything you want to pass to the data provider, e.g. a list of fields to show in the result.

The options parameter is optional, and is passed to react-query's `useQuery` hook. Check [react-query's `useQuery` hook documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) for details on all available option.

The react-query [query key](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys) for this hook is `['getOneDeleted', { id: String(id), meta }]`.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

Call `useGetOneDeleted` in a component to query the data provider for a single deleted record, based on its id.

```tsx
import { useGetOneDeleted } from '@react-admin/ra-core-ee';

const DeletedUser = ({ deletedUserId }) => {
    const { data: deletedUser, isPending, error } = useGetOneDeleted({ id: deletedUserId });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {deletedUser.data.username} (deleted by {deletedUser.deleted_by})</div>;
};
```

## TypeScript

The `useGetOneDeleted` hook accepts a generic parameter for the record type:

```tsx
import { useGetOneDeleted } from '@react-admin/ra-core-ee';

const DeletedUser = ({ deletedUserId }) => {
    const { data: deletedUser, isPending, error } = useGetOneDeleted<User>({ id: deletedUserId });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    // TypeScript knows that deletedUser.data is of type User
    return <div>User {deletedUser.data.username} (deleted by {deletedUser.deleted_by})</div>;
};
```