---
title: "useGetLocksLive"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

Use the `useGetLocksLive` hook to get the locks in real time. This hook calls `dataProvider.getLocks()` for the current resource on mount, and subscribes to live updates on the `lock/[resource]` topic.

This means that if a lock is acquired or released by another user while the current user is on the page, the return value will be updated.

```tsx
import { useRecordContext } from 'ra-core';
import { useGetLocksLive } from '@react-admin/ra-core-ee';
import { Lock } from 'lucide-react';

export const LockField = ({ locks }) => {
    const record = useRecordContext();
    if (!record) return null;
    const lock = locks?.find(lock => lock.recordId === record?.id);
    if (!lock) return <span className="w-4 h-4" />;
    return <Lock className="w-4 h-4" />;
};
```

`useGetLocksLive` reads the current resource from the `ResourceContext`. You can provide it explicitly if you are not in such a context:

```tsx
const { data: locks } = useGetLocksLive('posts');
```