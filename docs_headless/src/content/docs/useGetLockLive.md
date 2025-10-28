---
title: "useGetLockLive"
---

A hook that gets the lock status for a record in real time.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

Use the `useGetLockLive()` hook to get the lock status in real time. This hook calls `dataProvider.getLock()` for the current record on mount, and subscribes to live updates on the `lock/[resource]/[id]` topic.

This means that if the lock is acquired or released by another user while the current user is on the page, the return value will be updated.

```tsx
import { useGetLockLive } from '@react-admin/ra-core-ee';

const LockStatus = () => {
    const { data: lock } = useGetLockLive();
    const { identity } = useGetIdentity();
    if (!lock) return <span>No lock</span>;
    if (lock.identity === identity?.id) return <span>Locked by you</span>;
    return <span>Locked by {lock.identity}</span>;
};
```

`useGetLockLive` reads the current resource and record id from the `ResourceContext` and `RecordContext`. You can provide them explicitly if you are not in such a context:

```tsx
const { data: lock } = useGetLockLive('posts', { id: 123 });
```
