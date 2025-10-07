---
title: "useGetLocksLive"
---

Use the `useGetLocksLive` hook to get all the locks for a resource in real time. 

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

This hook calls `dataProvider.getLocks()` for the current resource on mount, and subscribes to live updates on the `lock/[resource]` topic.
This means that if a lock is acquired or released by another user while the current user is on the page, the return value will be updated.

```tsx
import { useRecordContext } from 'ra-core';
import { useGetLocksLive } from '@react-admin/ra-core-ee';
import { Lock } from 'lucide-react';

export const LockField = () => {
    const record = useRecordContext();
    const locks = useGetLocksLive();
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