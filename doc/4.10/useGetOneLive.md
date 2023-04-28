---
layout: default
title: "useGetOneLive"
---

# `useGetOneLive`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook, alternative to [`useGetOne`](./useGetOne.md), subscribes to live updates on the record.

## Usage

```jsx
import { useRecordContext } from 'react-admin';
import { useGetOneLive } from '@react-admin/ra-realtime';

const UserProfile = () => {
    const record = useRecordContext();
    const { data, isLoading, error } = useGetOneLive('users', { id: record.userId });
    if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return <p>ERROR</p>;
    }
    return <div>User {data.username}</div>;
};
```

The hook will subscribe to live updates on the record (topic: `resource/[resource]/[id]`) and will refetch the record when it is updated or deleted.

See [the `useGetOne` documentation](./useGetOne.md) for the full list of parameters and return type.
