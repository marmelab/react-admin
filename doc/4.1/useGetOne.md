---
layout: default
title: "useGetOne"
---

# `useGetOne`

This hook calls `dataProvider.getOne()` when the component mounts. It queries the data provider for a single record, based on its `id`.

```jsx
// syntax
const { data, isLoading, error, refetch } = useGetOne(
    resource,
    { id, meta },
    options
);

// example
import { useGetOne } from 'react-admin';

const UserProfile = ({ record }) => {
    const { data, isLoading, error } = useGetOne('users', { id: record.id });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <div>User {data.username}</div>;
};
```

**Tip**: If you use `useGetOne` several times on a page for the same resource, prefer [`useGetMany`](./useGetMany.md) instead, as it de-duplicates and aggregates queries for a single record into one batch query for many records.

```diff
-useGetOne('posts', { id });
+useGetMany('posts', { id: [id] });
```
