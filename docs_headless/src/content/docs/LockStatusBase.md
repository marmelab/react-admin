---
title: "<LockStatusBase>"
---

`<LockStatusBase>` displays the lock status of the current record. It allows to visually indicate whether the record is locked or not, by the current user or not, and provides an easy way to lock or unlock the record.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
import React from 'react';
import { Lock, LockOpen, LoaderCircle } from 'lucide-react';
import { LockStatusBase } from '@react-admin/ra-core-ee';

export const LockStatus = () => {
    return (
        <LockStatusBase
            {...props}
            render={({
                doLock,
                doUnlock,
                isLocking,
                isPending,
                isUnlocking,
                lockStatus,
                message,
            }) => {
                if (isPending) {
                    return null;
                }

                if (lockStatus === 'lockedByUser') {
                    return (
                        <button
                            title={message}
                            disabled={isUnlocking}
                            onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                                e.stopPropagation();
                                doUnlock();
                            }}
                        >
                            {isUnlocking ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <Lock className="h-4 w-4" />
                            )}
                        </button>
                    );
                }
                if (lockStatus === 'lockedByAnotherUser') {
                    return (
                        <Lock className="h-4 w-4 text-error" />
                    );
                }
                if (lockStatus === 'unlocked') {
                    return (
                        <button
                            title={message}
                            disabled={isLocking}
                            onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                                e.stopPropagation();
                                doLock();
                            }}
                            color="warning"
                        >
                            {isLocking ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <LockOpen className="h-4 w-4" />
                            )}
                        </button>
                    );
                }
                return null;
            }}
        />
    );
};
```

In addition to the [`useLockCallbacks`](./useLockCallbacks.md) parameters, `<LockStatusBase>` accepts a `render` prop. The function passed to the `render` prop will be called with the result of the `useLockCallbacks` hook.