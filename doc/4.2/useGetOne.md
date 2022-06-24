---
layout: default
title: "useGetOne"
---

# `useGetOne`

This hook calls `dataProvider.getOne()` when the component mounts. It queries the data provider for a single record, based on its `id`.

## Syntax

```jsx
const { data, isLoading, error, refetch } = useGetOne(
    resource,
    { id, meta },
    options
);
```

The `meta` argument is optional. It can be anything you want to pass to the data provider, e.g. a list of fields to show in the result.

The `options` parameter is optional, and is passed to [react-query's `useQuery` hook](https://react-query.tanstack.com/reference/useQuery). It may contain the following options:

* `cacheTime`
* `enabled`
* `initialData`
* `initialDataUpdatedAt`
* `isDataEqual`
* `keepPreviousData`
* `meta`
* `notifyOnChangeProps`
* `notifyOnChangePropsExclusions`
* `onError`
* `onSettled`
* `onSuccess`
* `placeholderData`
* `queryKeyHashFn`
* `refetchInterval`
* `refetchIntervalInBackground`
* `refetchOnMount`
* `refetchOnReconnect`
* `refetchOnWindowFocus`
* `retry`
* `retryOnMount`
* `retryDelay`
* `select`
* `staleTime`
* `structuralSharing`
* `suspense`
* `useErrorBoundary`

Check [react-query's `useQuery` hook documentation](https://react-query.tanstack.com/reference/useQuery) for details on each of these options.

The react-query [query key](https://react-query.tanstack.com/guides/query-keys) for this hook is `[resource, 'getOne', { id: String(id), meta }]`.

## Usage

Call `useGetOne` in a component to query the data provider for a single record, based on its `id`.

```jsx
import { useGetOne } from 'react-admin';

const UserProfile = ({ record }) => {
    const { data: user, isLoading, error } = useGetOne('users', { id: record.userId });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {user.username}</div>;
};
```

## Aggregating `getOne` Calls

If you use `useGetOne` several times on a page for the same resource, replace the `useGetOne` call by `useGetManyAggregate`, as it de-duplicates and aggregates queries for a single record into one batch query for many records.

```diff
-import { useGetOne } from 'react-admin';
+import { useGetManyAggregate } from 'react-admin';

const UserProfile = ({ record }) => {
-   const { data: user, isLoading, error } = useGetOne('users', { id: record.userId });
+   const { data: users, isLoading, error } = useGetManyAggregate('users', { ids: [record.userId] });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
-   return <div>User {user.username}</div>;
+   return <div>User {users[0].username}</div>;
};
```

This results in less calls to the dataProvider. For instance, if the `<UserProfile>` component above is rendered in a `<Datagrid>`, it will only make one call to `dataProvider.getMany()` for the entire list instead of one call to `dataProvider.getOne()` per row.

As this hook is often used to fetch references, react-admin exposes a `useReference` hook, which avoids doing the array conversion manually. It's an application hook rather than a data provider hook, so its syntax is a bit different. Prefer `useReference` to `useGetManyAggregate` when you use `useGetOne` to fetch a reference.

```diff
-import { useGetOne } from 'react-admin';
+import { useReference } from 'react-admin';

const UserProfile = ({ record }) => {
-   const { data: user, isLoading, error } = useGetOne('users', { id: record.userId });
+   const { referenceRecord: user, isLoading, error } = useReference({ reference: 'users', id: record.userId });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```
