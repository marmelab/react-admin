---
title: "useGetLockLive"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

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
