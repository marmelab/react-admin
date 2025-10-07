---
title: "useLockCallbacks"
---
This utility hook allows to easily get the callbacks to **lock** and **unlock** a record, as well as the current **lock status**.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

Use this hook e.g. to build a lock button:

```tsx
import { useLockCallbacks } from '@react-admin/ra-core-ee';
import { LoaderCircle, Lock } from 'lucide-react';

export const LockButton = () => {
    const {
        lock,
        isLocked,
        isLockedByCurrentUser,
        isPending,
        isLocking,
        isUnlocking,
        doLock,
        doUnlock,
    } = useLockCallbacks();

    if (isPending) {
        return null;
    }

    return isLocked ? (
        isLockedByCurrentUser ? (
            <button
                disabled={isUnlocking}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    doUnlock();
                }}
                title="Locked by you, click to unlock"
            >
                {isUnlocking ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                    <Lock className="w-4 h-4" />
                )}
            </button>
        ) : (
            <Lock title={`Locked by another user: ${lock?.identity}`} />
        )
    ) : (
        <button
            disabled={isLocking}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                doLock();
            }}
            title="Record is unlocked, click to lock"
        >
            {isLocking ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <LockOpenIcon className="w-4 h-4" />}
        </button>
    );
};
```

You can also leverage this hook as a quick way to access the lock status of the current record:

```tsx
import { useLockCallbacks } from '@react-admin/ra-core-ee';

export const MyToolbar = () => {
    const { isLockedByCurrentUser } = useLockCallbacks();

    return (
        <div>
            <button type="submit" disabled={!isLockedByCurrentUser}>Save</button>
        </div>
    );
};  
```

## Parameters

`useLockCallbacks` accepts a single options parameter, with the following properties:

| Name                    | Required | Type         | Default Value                     | Description                                                                                   |
| ----------------------- | -------- | ------------ | --------------------------------- | --------------------------------------------------------------------------------------------- |
| `identity`              | No       | `Identifier` | From `AuthProvider.getIdentity()` | An identifier for the user who owns the lock.                                                 |
| `resource`              | No       | `string`     | From `ResourceContext`            | The resource name (e.g. `'posts'`).                                                           |
| `id`                    | No       | `Identifier` | From `RecordContext`              | The record id (e.g. `123`).                                                                   |
| `meta`                  | No       | `object`     | -                                 | Additional metadata forwarded to the dataProvider `lock()`, `unlock()` and `getLock()` calls. |
| `lockMutationOptions`   | No       | `object`     | -                                 | `react-query` mutation options, used to customize the lock side-effects.                      |
| `unlockMutationOptions` | No       | `object`     | -                                 | `react-query` mutation options, used to customize the unlock side-effects.                    |
| `queryOptions`          | No       | `object`     | -                                 | `react-query` query options, used to customize the lock query side-effects.                   |

You can call `useLockCallbacks` with no parameter, and it will guess the resource and record id from the context (or the route):

```tsx
const { isLocked, error, isLocking } = useLockCallbacks();
```

Or you can provide them explicitly:

```tsx
const { isLocked, error, isLocking } = useLockCallbacks({
    resource: 'venues',
    id: 123,
    identity: 'John Doe',
});
```

## Return value

`useLockCallbacks` returns an object with the following properties:

| Name                    | Type       | Description                                                               |
| ----------------------- | ---------- | ------------------------------------------------------------------------- |
| `isLocked`              | `boolean`  | Whether the record is currently locked (possibly by another user) or not. |
| `isLockedByCurrentUser` | `boolean`  | Whether the record is locked by the current user or not.                  |
| `lock`                  | `object`   | The lock data.                                                            |
| `error`                 | `object`   | The error object if any of the mutations or the query fails.              |
| `isPending`             | `boolean`  | Whether the lock query is in progress.                                    |
| `isLocking`             | `boolean`  | Whether the lock mutation is in progress.                                 |
| `isUnlocking`           | `boolean`  | Whether the unlock mutation is in progress.                               |
| `doLock`                | `function` | A callback to manually lock the record.                                   |
| `doUnlock`              | `function` | A callback to manually unlock the record.                                 |
| `doLockAsync`           | `function` | A callback to manually lock the record asynchronously.                    |
| `doUnlockAsync`         | `function` | A callback to manually unlock the record asynchronously.                  |
| `lockQuery`             | `object`   | The `react-query` query object for the lock status.                       |
| `lockMutation`          | `object`   | The `react-query` mutation object for the lock mutation.                  |
| `unlockMutation`        | `object`   | The `react-query` mutation object for the unlock mutation.                |