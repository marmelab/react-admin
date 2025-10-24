---
title: '<WithLocks>'
---

`<WithLocks>` fetches the locks for a resource on mount, and puts them in a LocksContext. The locks are updated in real time.

This component calls [`dataProvider.getLocks()`](./RealtimeFeatures.md#data-provider-requirements), then subscribes to the locks topic for the current resource, and refetches the locks when a new event is received.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
import { ListBase, useRecordContext } from 'ra-core';
import { WithLocks, useLocksContext } from '@react-admin/ra-core-ee';
import { DataTable } from 'your-ra-ui-library';

const LockField = () => {
    const locks = useLocksContext();
    const record = useRecordContext();

    if (!record) return null;

    const lock = locks.find(lock => lock.recordId === record?.id);
    if (!lock) return null;

    return <span>Locked by {lock.identity}</span>;
};

const PostList = () => (
    <WithLocks>
        <ListBase>
            <DataTable>
                {/* ... */}
                <DataTable.Col source="lockStatus" field={LockField} />
            </DataTable>
        </ListBase>
    </WithLocks>
);
```

## Props

| Prop       | Required | Type        | Default | Description                                       |
| ---------- | -------- | ----------- | ------- | ------------------------------------------------- |
| `children` | Required | `ReactNode` |         | The component to render inside the `LocksContext` |
