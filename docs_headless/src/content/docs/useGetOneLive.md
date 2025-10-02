---
title: "useGetOneLive"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

Alternative to `useGetOne()` that subscribes to live updates on the record

```tsx
import { useRecordContext } from 'ra-core';
import { useGetOneLive } from '@react-admin/ra-core-ee';

const UserProfile = () => {
    const record = useRecordContext();
    const { data, isLoading, error } = useGetOneLive('users', {
        id: record.id,
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <p>ERROR</p>;
    }
    return <div>User {data.username}</div>;
};
```

The hook will subscribe to live updates on the record (topic: `resource/[resource]/[id]`) and will refetch the record when it is updated or deleted.

See the [useGetOne](./useGetOne.md) documentation for the full list of parameters and return type.