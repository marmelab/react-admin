---
title: "useLockOnMount"
---

This hook locks the current record on mount.

`useLockOnMount` calls `dataProvider.lock()` on mount and `dataProvider.unlock()` on unmount to lock and unlock the record. It relies on `authProvider.getIdentity()` to get the identity of the current user. It guesses the current `resource` and `recordId` from the context (or the route) if not provided.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/useLockOnMount.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

Use this hook e.g. in an `<Edit>` component to lock the record so that it only accepts updates from the current user.

```tsx
import { EditBase, Form } from 'ra-core';
import { useLockOnMount } from '@react-admin/ra-core-ee';

const LockStatus = () => {
    const { isLocked, error, isLoading } = useLockOnMount();
    return (
        <div>
            {isLoading && <p>Locking post...</p>}
            {error && (
                <p>
                    <div>Failed to lock</div>
                    <div>Someone else is probably already locking it.</div>
                </p>
            )}
            {isLocked && (
                <p>
                    <div>Post locked</div>
                    <div>Only you can edit it.</div>
                </p>
            )}
        </div>
    );
};

const PostEdit = () => (
    <EditBase>
        <PostAside />
        {/* The edit form*/}
    </EditBase>
);
```

**Note**: If users close their tab/browser when on a page with a locked record, `useLockOnMount` will block the navigation and show a notification until the record is unlocked. Hence it's a good practice to give them a way to unlock the record manually, e.g. by using the `doUnlock` callback returned by the hook or the [`<LockStatusBase>`](./LockStatusBase.md) component.

## Parameters

`useLockOnMount` accepts a single options parameter, with the following properties (all optional):

-   `identity`: An identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This could be an authentication token for instance. Falls back to the identifier of the identity returned by the `AuthProvider.getIdentity()` function.
-   `resource`: The resource name (e.g. `'posts'`). The hook uses the `ResourceContext` if not provided.
-   `id`: The record id (e.g. `123`). The hook uses the `RecordContext` if not provided.
-   `meta`: An object that will be forwarded to the `dataProvider.lock()` call
-   `lockMutationOptions`: `react-query` mutation options, used to customize the lock side-effects for instance
-   `unlockMutationOptions`: `react-query` mutation options, used to customize the unlock side-effects for instance

You can call `useLockOnMount` with no parameter, and it will guess the resource and record id from the context (or the route):

```tsx
const { isLocked, error, isLoading } = useLockOnMount();
```

Or you can provide them explicitly:

```tsx
const { isLocked, error, isLoading } = useLockOnMount({
    resource: 'venues',
    id: 123,
    identity: 'John Doe',
});
```

**Tip**: If the record can't be locked because another user is already locking it, you can use [`react-query`'s retry feature](https://react-query-v3.tanstack.com/guides/mutations#retry) to try again later:

```tsx
const { isLocked, error, isLoading } = useLockOnMount({
    lockMutationOptions: {
        // retry every 5 seconds, until the lock is acquired
        retry: true,
        retryDelay: 5000,
    },
});
```

## Return value

`useLockOnMount` returns an object with the following properties:

-   `isLocked`: Whether the record is successfully locked by this hook or not.
-   `isLockedByCurrentUser`: Whether the record is locked by the current user or not.
-   `lock`: The lock data.
-   `error`: The error object if the lock attempt failed.
-   `isLocking`: Whether the lock mutation is in progress.
-   `isUnlocking`: Whether the unlock mutation is in progress.
-   `doLock`: A callback to manually lock the record.
-   `doUnlock`: A callback to manually unlock the record.
-   `doLockAsync`: A callback to manually lock the record asynchronously.
-   `doUnlockAsync`: A callback to manually unlock the record asynchronously.
