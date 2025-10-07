---
title: "useLockOnCall"
---

A hook that gets a callback to lock a record and its mutation state.
`useLockOnCall` calls `dataProvider.lock()` when the callback is called. It relies on `authProvider.getIdentity()` to get the identity of the current user. It guesses the current `resource` and `recordId` from the context (or the route) if not provided. It releases the lock when the component unmounts by calling `dataProvider.unlock()`.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/useLockOnCall.mp4" type="video/mp4"/>
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

Use this hook in a toolbar, to let the user lock the record manually.

```tsx
import { EditBase } from 'ra-core';
import { useLockOnMount } from '@react-admin/ra-core-ee';
import { Alert, AlertTitle, Box, Button } from '@material-ui/core';

const LockStatus = () => {
    const [doLock, { data, error, isLoading }] = useLockOnCall();
    return (
        <div>
            {isLoading ? (
                <div>Locking post...</div>
            ) : error ? (
                <div>
                    <div>Failed to lock</div>
                    <div>Someone else is probably already locking it.</div>
                </div>
            ) : data ? (
                <div>
                    <div>Post locked</div> 
                    <div>Only you can edit it.</div>
                </div>
            ) : (
                <button onClick={() => { doLock(); }}>
                    Lock post
                </button>
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

**Note**: If users close their tab/browser when on a page with a locked record, `useLockOnCall` will block the navigation and show a notification until the record is unlocked. Hence it's a good practice to give them a way to unlock the record manually, e.g. by using the `doUnlock` callback returned by the [`useLockCallbacks`](#uselockcallbacks) hook or the [`<LockStatusBase>`](#lockstatusbase) component.

## Parameters

`useLockOnCall` accepts a single options parameter, with the following properties (all optional):

-   `identity`: An identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This could be an authentication token for instance. Falls back to the identifier of the identity returned by the `AuthProvider.getIdentity()` function.
-   `resource`: The resource name (e.g. `'posts'`). The hook uses the `ResourceContext` if not provided.
-   `id`: The record id (e.g. `123`). The hook uses the `RecordContext` if not provided.
-   `meta`: An object that will be forwarded to the `dataProvider.lock()` call
-   `lockMutationOptions`: `react-query` mutation options, used to customize the lock side-effects for instance
-   `unlockMutationOptions`: `react-query` mutation options, used to customize the unlock side-effects for instance

```tsx
const LockButton = ({ resource, id, identity }) => {
    const [doLock, lockMutation] = useLockOnCall({ resource, id, identity });
    return (
        <button onClick={() => {doLock();}} disabled={lockMutation.isLoading}>
            Lock
        </button>
    );
};
```