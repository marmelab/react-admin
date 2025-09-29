---
title: "<LockStatusBase>"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

Use the `<LockStatusBase>` component to display the lock status of the record in the nearest `RecordContext`:

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

In addition to the [`useLockCallbacks`](#uselockcallbacks) parameters, `<LockStatusBase>` accepts a `render` prop. The function passed to the `render` prop will be called with the result of the `useLockCallbacks` hook.