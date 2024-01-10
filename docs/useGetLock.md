---
layout: default
title: "useGetLock"
---

# `useGetLock`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook gets the lock status for a record. It calls `dataProvider.getLock()` on mount.

## Usage

```jsx
import { useGetLock } from '@react-admin/ra-realtime';

const { data, isLoading } = useGetLock(resource, { id });
```

Here is a custom form Toolbar that displays the lock status of the current record:

```jsx
import {
    Toolbar,
    SaveButton,
    useGetIdentity,
    useResourceContext,
    useRecordContext,
} from 'react-admin';
import { useGetLock } from '@react-admin/ra-enterprise';

const CustomToolbar = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const { isLoading: identityLoading, identity } = useGetIdentity();
    const { isLoading: lockLoading, data: lock } = useGetLock(resource, {
        id: record.id,
    });

    if (identityLoading || lockLoading) {
        return null;
    }

    const isLockedByOtherUser = lock?.identity !== identity.id;

    return (
        <Toolbar>
            <SaveButton disabled={isLockedByOtherUser} />
            {isLockedByOtherUser && (
                <LockMessage>
                    {`This record is locked by another user: ${lock?.dentity}.`}
                </LockMessage>
            )}
        </Toolbar>
    );
};
```

## Parameters

- `resource`: the resource name (e.g. `'posts'`)
- `params`: an object with the following properties:
    - `id`: the record id (e.g. `123`)
    - `meta`: Optional. an object that will be forwarded to the dataProvider

## Live Version

To get the list of locks update in real time based on the `lock/[resource]` topic, use [the `useGetLockLive` hook](./useGetLockLive.md) instead.
