---
title: "useGetLock"
---

A hook that gets the lock status for a record. It calls `dataProvider.getLock()` on mount.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

Here is a form toolbar that displays the lock status of the current record:

```tsx
const FormToolbar = () => {
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
        <div className="flex items-center gap-4">
            <button type="submit" disabled={isLockedByOtherUser}>Save</button>
            {isLockedByOtherUser && (
                <span>
                    {`This record is locked by another user: ${lock?.identity}.`}
                </span>
            )}
        </div>
    );
};
```

## Parameters

-   `resource`: the resource name (e.g. `'posts'`)
-   `params`: an object with the following properties:
    -   `id`: the record id (e.g. `123`)
    -   `meta`: Optional. an object that will be forwarded to the dataProvider (optional)
