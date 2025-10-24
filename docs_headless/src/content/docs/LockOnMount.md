---
title: '<LockOnMount>'
---

`<LockOnMount />` calls [`dataProvider.lock()`](./RealtimeFeatures.md#data-provider-requirements) on mount and [`dataProvider.unlock()`](./RealtimeFeatures.md#data-provider-requirements) on unmount to lock and unlock the record. It relies on [`authProvider.getIdentity()`](./AuthProviderWriting.md#getidentity) to get the identity of the current user. It guesses the current `resource` and `recordId` from the context (or the route) if not provided.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
import { EditBase, Form } from 'ra-core';
import { LockOnMount, useLockCallbacks } from '@react-admin/ra-core-ee';

const PostEdit = () => (
    <EditBase>
        <PostEditForm />
        <LockOnMount />
    </EditBase>
);

const PostEditForm = () => {
    const { isPending, isLocked } = useLockCallbacks();

    if (isPending) {
        return <p>Loading...</p>;
    }

    return <Form disabled={isLocked}>{/* ... */}</Form>;
};
```
