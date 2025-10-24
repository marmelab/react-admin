---
title: "useGetOneLive"
---

An alternative to `useGetOne()` that subscribes to live updates on the record

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

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