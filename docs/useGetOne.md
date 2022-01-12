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
    { id },
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
