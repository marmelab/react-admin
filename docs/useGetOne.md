---
layout: default
title: "useGetOne"
---

# `useGetOne`

This hook calls `dataProvider.getOne()` when the component mounts. It queries the data provider for a single record, based on its `id`.

## Syntax

```jsx
const { data, isPending, error, refetch } = useGetOne(
    resource,
    { id, meta },
    options
);
```

The `meta` argument is optional. It can be anything you want to pass to the data provider, e.g. a list of fields to show in the result.

The `options` parameter is optional, and is passed to [react-query's `useQuery` hook](https://tanstack.com/query/v5/docs/react/reference/useQuery). It may contain the following options:

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

Check [react-query's `useQuery` hook documentation](https://tanstack.com/query/v5/docs/react/reference/useQuery) for details on each of these options.

The react-query [query key](https://tanstack.com/query/v5/docs/react/guides/query-keys) for this hook is `[resource, 'getOne', { id: String(id), meta }]`.

## Usage

Call `useGetOne` in a component to query the data provider for a single record, based on its `id`.

```jsx
import { useGetOne, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
    const { data: user, isPending, error } = useGetOne('users', { id: record.userId });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {user.username}</div>;
};
```

## Aggregating `getOne` Calls

<iframe src="https://www.youtube-nocookie.com/embed/egBhWqF3sWc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

If you use `useGetOne` several times on a page for the same resource, replace the `useGetOne` call by `useGetManyAggregate`, as it de-duplicates and aggregates queries for a single record into one batch query for many records.

```diff
-import { useGetOne, useRecordContext } from 'react-admin';
+import { useGetManyAggregate, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
-   const { data: user, isPending, error } = useGetOne('users', { id: record.userId });
+   const { data: users, isPending, error } = useGetManyAggregate('users', { ids: [record.userId] });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
-   return <div>User {user.username}</div>;
+   return <div>User {users[0].username}</div>;
};
```

This results in less calls to the dataProvider. For instance, if the `<UserProfile>` component above is rendered in a `<Datagrid>`, it will only make one call to `dataProvider.getMany()` for the entire list instead of one call to `dataProvider.getOne()` per row.

As `useGetManyAggregate` is often used to fetch references, react-admin exposes a `useReference` hook, which avoids doing the array conversion manually. It's an application hook rather than a data provider hook, so its syntax is a bit different. Prefer `useReference` to `useGetManyAggregate` when you use `useGetOne` to fetch a reference.

```diff
-import { useGetOne, useRecordContext } from 'react-admin';
+import { useReference, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
-   const { data: user, isPending, error } = useGetOne('users', { id: record.userId });
+   const { referenceRecord: user, isPending, error } = useReference({ reference: 'users', id: record.userId });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {user.username}</div>;
};
```

## Refreshing the Record

If you want to refresh the record, use the `refetch` function returned by the hook.

```jsx
import { useGetOne } from 'react-admin';

const UserProfile = ({ userId }) => {
    const { data, isPending, error, refetch } = useGetOne('users', { id: userId });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <>
            <div>User {data.username}</div>
            <button onClick={() => refetch()}>Refresh</button>
        </>
    );
};
```

## Live Updates

If you want to subscribe to live updates on the record (topic: `resource/[resource]/[id]`), use [the `useGetOneLive` hook](./useGetOneLive.md) instead.

```diff
-import { useGetOne, useRecordContext } from 'react-admin';
+import { useRecordContext } from 'react-admin';
+import { useGetOneLive } from '@react-admin/ra-realtime';

const UserProfile = () => {
    const record = useRecordContext();
-   const { data, isPending, error } = useGetOne('users', { id: record.userId });
+   const { data, isPending, error } = useGetOneLive('users', { id: record.userId });
    if (isPending) {
        return <Loading />;
    }
    if (error) {
        return <p>ERROR</p>;
    }
    return <div>User {data.username}</div>;
};
```

## TypeScript

The `useGetOne` hook accepts a generic parameter for the record type:

```tsx
import { useGetOne, useRecordContext } from 'react-admin';

type Ticket = {
    id: number;
    userId: string;
    message: string;
};

type User = {
    id: number;
    username: string;
}

const UserProfile = () => {
    const ticket = useRecordContext<Ticket>();
    const { data: user, isPending, error } = useGetOne<User>('users', { id: ticket.userId });
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    // TypeScript knows that user is of type User
    return <div>User {user.username}</div>;
};
```
